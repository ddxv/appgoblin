import type { RequestEvent } from '@sveltejs/kit';

import { RefillingTokenBucket } from './auth/rate-limit.js';
import { getClientIP } from './request.js';

export type RateLimitTier = 'authenticated' | 'anonymous' | 'jsonScraper';

export interface RateLimitResult {
	allowed: boolean;
	tier: RateLimitTier;
	limit: number;
	remaining: number;
	retryAfterSeconds: number;
}

/**
 * `max` is the burst size and one token refills per second, so it is also the
 * sustained requests-per-minute ceiling. Signed-in users are keyed by user id
 * so they never compete with anonymous traffic sharing their IP.
 */
const BUCKETS: Record<RateLimitTier, RefillingTokenBucket<string>> = {
	authenticated: new RefillingTokenBucket<string>(600, 1),
	anonymous: new RefillingTokenBucket<string>(300, 1),
	// Small bucket plus a large per-request cost, so a scraper is out after a
	// couple of requests.
	jsonScraper: new RefillingTokenBucket<string>(30, 1)
};

/**
 * Runs before session validation, which costs a database lookup per request.
 */
const PRE_AUTH_BUCKET = new RefillingTokenBucket<string>(600, 1);

interface CostProfile {
	read: number;
	write: number;
	dataRequest: number;
	expensiveRoute: number;
}

/**
 * `__data.json` requests are the documented way to read page data without the
 * HTML shell, so they cost extra — heavily for clients that did not come from
 * one of our own pages.
 */
const COSTS: Record<RateLimitTier, CostProfile> = {
	authenticated: { read: 1, write: 3, dataRequest: 1, expensiveRoute: 1 },
	anonymous: { read: 1, write: 3, dataRequest: 2, expensiveRoute: 1 },
	jsonScraper: { read: 3, write: 9, dataRequest: 6, expensiveRoute: 3 }
};

/** Routes that fan out into several backend queries. */
const EXPENSIVE_PREFIXES = [
	'/search',
	'/api/',
	'/companies/',
	'/apps/',
	'/sdks/',
	'/ad-creatives',
	'/collections/',
	'/categories/',
	'/keywords/',
	'/developers/',
	'/app-explorer',
	'/top-mobile-advertisers'
];

/** Routes whose pages are `noindex` or auth-gated. */
const NOINDEX_PREFIXES = ['/search', '/apps/comparison', '/sdks', '/auth', '/account'];

export function isNoindexPath(pathname: string): boolean {
	return NOINDEX_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isStaticAssetPath(pathname: string): boolean {
	return pathname.startsWith('/_app') || pathname.startsWith('/favicon');
}

/**
 * Browsers attach Fetch Metadata headers to every `fetch()`, including the one
 * SvelteKit's router makes for `__data.json`. A crawler calling the endpoint
 * over plain HTTP sends none. Header check rather than user agent because a
 * user agent is free text that any client can set to anything.
 */
function isBrowserDataFetch(event: RequestEvent): boolean {
	const headers = event.request.headers;
	if (headers.has('sec-fetch-site') && headers.has('sec-fetch-dest')) {
		return true;
	}
	// Browsers predating Fetch Metadata send no `Sec-Fetch-*` headers.
	const referer = headers.get('referer');
	return referer !== null && referer.startsWith(event.url.origin);
}

/** A data request that did not originate from one of our pages. */
export function isJsonScrape(event: RequestEvent): boolean {
	return event.isDataRequest && !isBrowserDataFetch(event);
}

function clientKey(event: RequestEvent): string {
	const ip = getClientIP(event.request);
	if (ip !== null) {
		return ip;
	}
	try {
		return event.getClientAddress();
	} catch {
		// Share one bucket rather than letting the request through unmetered.
		return 'unknown';
	}
}

function requestCost(event: RequestEvent, tier: RateLimitTier): number {
	const profile = COSTS[tier];
	const method = event.request.method;
	const isRead = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';

	let cost = isRead ? profile.read : profile.write;
	if (event.isDataRequest) {
		cost += profile.dataRequest;
	}
	if (EXPENSIVE_PREFIXES.some((prefix) => event.url.pathname.startsWith(prefix))) {
		cost += profile.expensiveRoute;
	}
	return cost;
}

function consume(
	bucket: RefillingTokenBucket<string>,
	key: string,
	cost: number
): Omit<RateLimitResult, 'tier'> {
	const allowed = bucket.consume(key, cost);
	const remaining = bucket.getRemaining(key);
	return {
		allowed,
		limit: bucket.max,
		remaining,
		// One token refills per interval, so the wait is the size of the deficit.
		retryAfterSeconds: allowed
			? 0
			: Math.max(1, Math.ceil((cost - remaining) * bucket.refillIntervalSeconds))
	};
}

export function checkPreAuthRateLimit(event: RequestEvent): Omit<RateLimitResult, 'tier'> {
	if (event.cookies.get('session') === undefined) {
		return {
			allowed: true,
			limit: PRE_AUTH_BUCKET.max,
			remaining: PRE_AUTH_BUCKET.max,
			retryAfterSeconds: 0
		};
	}
	return consume(PRE_AUTH_BUCKET, clientKey(event), 1);
}

/**
 * Must run after the auth handle so `locals.user` is populated.
 */
export function checkRateLimit(event: RequestEvent): RateLimitResult {
	const user = event.locals.user;
	const tier: RateLimitTier =
		user !== null ? 'authenticated' : isJsonScrape(event) ? 'jsonScraper' : 'anonymous';

	const key = user !== null ? `user:${user.id}` : `ip:${clientKey(event)}`;
	return { ...consume(BUCKETS[tier], key, requestCost(event, tier)), tier };
}

/**
 * A direct data request for a noindex or auth-gated page. A 404 is cheaper than
 * serving the payload and then rate limiting the follow-up requests. Indexable
 * pages are not blocked; they are charged to the `jsonScraper` bucket and get
 * an `X-Robots-Tag` header instead.
 */
export function isBlockedDataRequest(event: RequestEvent): boolean {
	if (event.locals.user !== null) {
		return false;
	}
	return isJsonScrape(event) && isNoindexPath(event.url.pathname);
}

export function rateLimitResponse(
	event: RequestEvent,
	result: Omit<RateLimitResult, 'tier'>
): Response {
	const headers = new Headers({
		'Retry-After': String(result.retryAfterSeconds),
		'RateLimit-Limit': String(result.limit),
		'RateLimit-Remaining': String(Math.max(0, result.remaining)),
		'RateLimit-Reset': String(result.retryAfterSeconds),
		'Cache-Control': 'no-store'
	});

	// SvelteKit's client parses data responses as JSON, so a plain-text body
	// would surface as an opaque "Internal Error" instead of the real status.
	if (event.isDataRequest) {
		headers.set('Content-Type', 'application/json');
		return new Response(JSON.stringify({ message: 'Too many requests' }), {
			status: 429,
			headers
		});
	}

	headers.set('Content-Type', 'text/plain; charset=utf-8');
	return new Response('Too many requests', { status: 429, headers });
}

// A fully refilled bucket behaves exactly like a missing one, so dropping it
// keeps the map from growing for the lifetime of the process.
const sweepTimer = setInterval(() => {
	for (const bucket of Object.values(BUCKETS)) {
		bucket.sweep();
	}
	PRE_AUTH_BUCKET.sweep();
}, 60_000);
sweepTimer.unref?.();
