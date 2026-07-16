import { requireAuthOr401 } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import { STRIPE_PLAN_LABELS, type StripePriceKey } from '$lib/server/stripe';
import type { LayoutServerLoadEvent } from './$types';

export async function load(event: LayoutServerLoadEvent) {
	const { user } = requireAuthOr401(event);

	interface Subscription {
		status: string;
		provider_name: string;
		current_period_start: Date | null;
		current_period_end: Date;
		cancel_at: Date | null;
		cancel_requested_at: Date | null;
		tier_slug: string | null;
	}

	interface SubscriptionHistoryRow {
		status: string;
		current_period_start: Date | null;
		current_period_end: Date;
		cancel_at: Date | null;
		cancel_requested_at: Date | null;
		updated_at: Date;
		tier_slug: string | null;
	}

	const subscription = await db.queryOne<Subscription>(
		`SELECT s.status, tp.provider_name, s.current_period_start, s.current_period_end,
		        s.cancel_at, s.cancel_requested_at,
		        t.slug AS tier_slug
         FROM subscriptions s
         LEFT JOIN tier_prices tp ON tp.id = s.tier_price_id
         LEFT JOIN tiers t ON t.id = tp.tier_id
	         WHERE s.user_id = $1
	         AND (
	         	(s.cancel_at IS NOT NULL AND s.cancel_at > NOW())
	         	OR (s.cancel_at IS NULL AND s.status IN ('active', 'trialing'))
	         )
	         ORDER BY s.updated_at DESC LIMIT 1`,
		[user.id]
	);

	const subscriptionHistory = await db.query<SubscriptionHistoryRow>(
		`SELECT s.status, s.current_period_start, s.current_period_end, s.cancel_at,
		        s.cancel_requested_at, s.updated_at,
		        t.slug AS tier_slug
		 FROM subscriptions s
		 LEFT JOIN tier_prices tp ON tp.id = s.tier_price_id
		 LEFT JOIN tiers t ON t.id = tp.tier_id
		 WHERE s.user_id = $1
		 AND NOT (
		 	(s.cancel_at IS NOT NULL AND s.cancel_at > NOW())
		 	OR (s.cancel_at IS NULL AND s.status IN ('active', 'trialing'))
		 )
		 ORDER BY COALESCE(s.cancel_at, s.current_period_end, s.updated_at) DESC
		 LIMIT 5`,
		[user.id]
	);

	const resolvePlanName = (slug: string | null): string | null =>
		slug && slug in STRIPE_PLAN_LABELS
			? STRIPE_PLAN_LABELS[slug as StripePriceKey]
			: slug; // fallback to raw slug if unknown

	return {
		user,
		subscription,
		showStripePortal: subscription?.provider_name === 'stripe',
		subscriptionHistory: subscriptionHistory.map((entry) => ({
			...entry,
			planName: resolvePlanName(entry.tier_slug) ?? entry.tier_slug
		})),
		subscriptionTier: resolvePlanName(subscription?.tier_slug ?? null)
	};
}
