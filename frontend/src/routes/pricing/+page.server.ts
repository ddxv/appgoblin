import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoadEvent } from './$types';
import {
	createCheckoutSession,
	getStripePriceIds,
	STRIPE_PLAN_LABELS,
	STRIPE_PRICES,
	type StripePriceKey,
	type BillingCycle
} from '$lib/server/stripe';
import { requireFullAuth, loginUrl, isSafeRedirect } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';

const allowedKeys: StripePriceKey[] = ['b2b_sdk', 'b2b_appads', 'b2b_premium'];
const allowedCycles: BillingCycle[] = ['monthly', 'yearly'];

function parseBillingCycle(value: FormDataEntryValue | string | null): BillingCycle {
	return value === 'yearly' ? 'yearly' : 'monthly';
}

export async function load(event: PageServerLoadEvent) {
	// Map every Stripe price ID (both monthly + yearly) to a human label.
	const priceIdToLabel: Record<string, string> = {};
	for (const key of Object.keys(STRIPE_PLAN_LABELS) as StripePriceKey[]) {
		for (const id of getStripePriceIds(key)) {
			priceIdToLabel[id] = STRIPE_PLAN_LABELS[key];
		}
	}

	// Check if user arrived here with a subscribe intent (after auth chain)
	const subscribe = event.url.searchParams.get('subscribe');
	const billingCycle = parseBillingCycle(event.url.searchParams.get('cycle'));
	if (subscribe && allowedKeys.includes(subscribe as StripePriceKey)) {
		// Not signed in — bounce through login (or email verification) preserving
		// the subscribe intent in the URL, matching the form-action path.
		if (event.locals.session === null || event.locals.user === null) {
			return redirect(
				302,
				loginUrl(
					`/pricing?subscribe=${encodeURIComponent(subscribe)}&cycle=${encodeURIComponent(billingCycle)}`
				)
			);
		}
		if (!event.locals.user.emailVerified) {
			return redirect(
				302,
				`/auth/verify-email?redirectTo=${encodeURIComponent('/pricing?subscribe=' + encodeURIComponent(subscribe) + '&cycle=' + encodeURIComponent(billingCycle))}`
			);
		}

		// User is fully authenticated — create checkout URL and redirect directly
		const existingSubscription = await db.queryOne<{
			status: string;
			provider_name: string;
			provider_price_id: string;
			cancel_at: Date | null;
			cancel_requested_at: Date | null;
		}>(
			`SELECT status, provider_name, provider_price_id, cancel_at, cancel_requested_at
             FROM subscriptions
             WHERE user_id = $1
             AND status IN ('active', 'trialing')
			 ORDER BY updated_at DESC
             LIMIT 1`,
			[event.locals.user.id]
		);

		if (
			existingSubscription &&
			existingSubscription.provider_name === 'stripe' &&
			!existingSubscription.cancel_at &&
			!existingSubscription.cancel_requested_at
		) {
			// Only short-circuit to /account/subscription if the user is trying
			// to re-buy the exact same plan+cycle they're already on. Otherwise
			// let them upgrade (e.g. monthly → yearly, or switch tiers) by going
			// through checkout.
			const subscribedKey = (Object.keys(STRIPE_PLAN_LABELS) as StripePriceKey[]).find((key) =>
				getStripePriceIds(key).includes(existingSubscription.provider_price_id)
			);
			const subscribedCycle = subscribedKey
				? (['monthly', 'yearly'] as const).find(
						(cycle) =>
							existingSubscription.provider_price_id === STRIPE_PRICES[subscribedKey]?.[cycle]
					)
				: undefined;
			if (subscribedKey === (subscribe as StripePriceKey) && subscribedCycle === billingCycle) {
				return redirect(303, '/account/subscription');
			}
		}

		let url;
		try {
			url = await createCheckoutSession(
				event.locals.user.id,
				event.locals.user.email,
				subscribe as StripePriceKey,
				billingCycle
			);
		} catch (e) {
			console.error(e);
		}
		if (url) {
			return redirect(303, url);
		}
	}

	// Resolve the signed-in user's current plan so we can surface it on the page.
	let currentSubscription: {
		status: string;
		provider_name: string;
		provider_price_id: string;
		current_period_end: Date | null;
		cancel_at: Date | null;
	} | null = null;

	if (event.locals.user) {
		const row = await db.queryOne<{
			status: string;
			provider_name: string;
			provider_price_id: string;
			current_period_end: Date | null;
			cancel_at: Date | null;
		}>(
			`SELECT status, provider_name, provider_price_id,
			        current_period_end, cancel_at
			 FROM subscriptions
			 WHERE user_id = $1
			 AND (
			 	(cancel_at IS NOT NULL AND cancel_at > NOW())
			 	OR (cancel_at IS NULL AND status IN ('active', 'trialing'))
			 )
			 ORDER BY updated_at DESC
			 LIMIT 1`,
			[event.locals.user.id]
		);
		if (row) {
			currentSubscription = row;
		}
	}

	const currentPlanLabel = currentSubscription
		? (priceIdToLabel[currentSubscription.provider_price_id] ?? null)
		: null;
	const currentPlanKey =
		currentSubscription && currentPlanLabel
			? ((Object.entries(STRIPE_PLAN_LABELS).find(
					([, label]) => label === currentPlanLabel
				)?.[0] as StripePriceKey | undefined) ?? null)
			: null;
	const currentPlanCycle: BillingCycle | null = currentPlanKey
		? ((['monthly', 'yearly'] as const).find(
				(cycle) => currentSubscription?.provider_price_id === STRIPE_PRICES[currentPlanKey]?.[cycle]
			) ?? null)
		: null;

	return {
		user: event.locals.user,
		currentSubscription,
		currentPlanKey,
		currentPlanLabel,
		currentPlanCycle
	};
}

export const actions: Actions = {
	subscribe: async (event) => {
		// Check auth early so we can encode the priceKey + cycle in the redirect
		if (event.locals.session === null || event.locals.user === null) {
			const formData = await event.request.formData();
			const priceKey = formData.get('priceKey');
			const cycle = parseBillingCycle(formData.get('billingCycle'));
			if (typeof priceKey === 'string' && allowedKeys.includes(priceKey as StripePriceKey)) {
				return redirect(
					302,
					loginUrl(
						`/pricing?subscribe=${encodeURIComponent(priceKey)}&cycle=${encodeURIComponent(cycle)}`
					)
				);
			}
			return redirect(302, loginUrl('/pricing'));
		}
		if (!event.locals.user.emailVerified) {
			const formData = await event.request.formData();
			const priceKey = formData.get('priceKey');
			const cycle = parseBillingCycle(formData.get('billingCycle'));
			if (typeof priceKey === 'string' && allowedKeys.includes(priceKey as StripePriceKey)) {
				return redirect(
					302,
					`/auth/verify-email?redirectTo=${encodeURIComponent('/pricing?subscribe=' + encodeURIComponent(priceKey) + '&cycle=' + encodeURIComponent(cycle))}`
				);
			}
			return redirect(302, '/auth/verify-email');
		}

		const { user } = requireFullAuth(event);

		const formData = await event.request.formData();
		const priceKey = formData.get('priceKey');
		const billingCycle = parseBillingCycle(formData.get('billingCycle'));

		if (typeof priceKey !== 'string') {
			return fail(400, { message: 'Missing price selection' });
		}

		if (!allowedKeys.includes(priceKey as StripePriceKey)) {
			return fail(400, { message: 'Invalid price selection' });
		}

		if (!allowedCycles.includes(billingCycle)) {
			return fail(400, { message: 'Invalid billing cycle' });
		}

		const normalizedKey = priceKey as StripePriceKey;

		// Check for existing active subscription (allow checkout if previously canceled)
		const existingSubscription = await db.queryOne<{
			status: string;
			provider_name: string;
			provider_price_id: string;
			cancel_at: Date | null;
			cancel_requested_at: Date | null;
		}>(
			`SELECT status, provider_name, provider_price_id, cancel_at, cancel_requested_at
             FROM subscriptions
             WHERE user_id = $1
             AND status IN ('active', 'trialing')
			 ORDER BY updated_at DESC
             LIMIT 1`,
			[user.id]
		);

		if (
			existingSubscription &&
			existingSubscription.provider_name === 'stripe' &&
			!existingSubscription.cancel_at &&
			!existingSubscription.cancel_requested_at
		) {
			// Only short-circuit if the user is re-buying the exact same plan+cycle.
			const subscribedKey = (Object.keys(STRIPE_PLAN_LABELS) as StripePriceKey[]).find((key) =>
				getStripePriceIds(key).includes(existingSubscription.provider_price_id)
			);
			const subscribedCycle = subscribedKey
				? (['monthly', 'yearly'] as const).find(
						(cycle) =>
							existingSubscription.provider_price_id === STRIPE_PRICES[subscribedKey]?.[cycle]
					)
				: undefined;
			if (subscribedKey === normalizedKey && subscribedCycle === billingCycle) {
				return redirect(303, '/account/subscription');
			}
		}

		let url;
		try {
			url = await createCheckoutSession(user.id, user.email, normalizedKey, billingCycle);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'An error occurred' });
		}

		if (!url) {
			return fail(500, { message: 'Failed to create checkout session' });
		}

		redirect(303, url);
	}
};
