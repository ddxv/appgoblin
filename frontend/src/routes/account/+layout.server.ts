import { requireFullAuth } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import { getStripePriceIds, STRIPE_PLAN_LABELS, type StripePriceKey } from '$lib/server/stripe';
import type { LayoutServerLoadEvent } from './$types';

export async function load(event: LayoutServerLoadEvent) {
	// This route requires full authentication (opt-in protection)
	const { user } = requireFullAuth(event);

	interface Subscription {
		status: string;
		provider_name: string;
		current_period_start: Date | null;
		current_period_end: Date;
		cancel_at: Date | null;
		cancel_requested_at: Date | null;
		provider_price_id: string;
	}

	interface SubscriptionHistoryRow extends Subscription {
		updated_at: Date;
	}

	const subscription = await db.queryOne<Subscription>(
		`SELECT status, provider_name, current_period_start, current_period_end, cancel_at, cancel_requested_at, provider_price_id
         FROM subscriptions 
	         WHERE user_id = $1
	         AND (
	         	(cancel_at IS NOT NULL AND cancel_at > NOW())
	         	OR (cancel_at IS NULL AND status IN ('active', 'trialing'))
	         )
	         ORDER BY updated_at DESC LIMIT 1`,
		[user.id]
	);

	const priceIdToLabel: Record<string, string> = {};
	for (const key of Object.keys(STRIPE_PLAN_LABELS) as StripePriceKey[]) {
		for (const id of getStripePriceIds(key)) {
			priceIdToLabel[id] = STRIPE_PLAN_LABELS[key];
		}
	}

	const subscriptionHistory = await db.query<SubscriptionHistoryRow>(
		`SELECT status, current_period_start, current_period_end, cancel_at, cancel_requested_at,
		        provider_price_id, updated_at
		 FROM subscriptions
		 WHERE user_id = $1
		 AND NOT (
		 	(cancel_at IS NOT NULL AND cancel_at > NOW())
		 	OR (cancel_at IS NULL AND status IN ('active', 'trialing'))
		 )
		 ORDER BY COALESCE(cancel_at, current_period_end, updated_at) DESC
		 LIMIT 5`,
		[user.id]
	);

	return {
		user,
		subscription,
		showStripePortal: subscription?.provider_name === 'stripe',
		subscriptionHistory: subscriptionHistory.map((entry) => ({
			...entry,
			planName: priceIdToLabel[entry.provider_price_id] ?? entry.provider_price_id
		})),
		subscriptionTier:
			subscription?.provider_price_id && priceIdToLabel[subscription.provider_price_id]
				? priceIdToLabel[subscription.provider_price_id]
				: null
	};
}
