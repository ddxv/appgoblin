import { requireFullAuth } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import { STRIPE_PRICES } from '$lib/server/stripe';
import type { LayoutServerLoadEvent } from './$types';

export async function load(event: LayoutServerLoadEvent) {
	// This route requires full authentication (opt-in protection)
	const { user } = requireFullAuth(event);

	interface Subscription {
		status: string;
		current_period_end: Date;
		cancel_at: Date | null;
		provider_price_id: string;
	}

	const subscription = await db.queryOne<Subscription>(
		`SELECT status, current_period_end, cancel_at, provider_price_id
         FROM subscriptions 
         WHERE user_id = $1 
         ORDER BY created_at DESC LIMIT 1`,
		[user.id]
	);

	const priceIdToLabel: Record<string, string> = {
		[STRIPE_PRICES.app_dev]: 'Premium Access',
		[STRIPE_PRICES.b2b_sdk]: 'Business SDK',
		[STRIPE_PRICES.b2b_appads]: 'App-Ads.txt',
		[STRIPE_PRICES.b2b_premium]: 'Premium B2B'
	};

	return {
		user,
		subscription,
		subscriptionTier:
			subscription?.provider_price_id && priceIdToLabel[subscription.provider_price_id]
				? priceIdToLabel[subscription.provider_price_id]
				: null
	};
}
