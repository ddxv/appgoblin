import Stripe from 'stripe';
import { db } from '$lib/server/auth/db';
import { error } from '@sveltejs/kit';

import { STRIPE_SECRET_KEY, APPGOBLIN_ENDPOINT_URL } from '$env/static/private';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2026-06-24.dahlia'
});

export type BillingCycle = 'monthly' | 'yearly';

/** Known tier slugs that can be subscribed to. */
export type StripePriceKey = 'b2b_sdk' | 'b2b_appads' | 'b2b_premium';

/** Human-readable label for a plan, useful for account/receipt pages. */
export const STRIPE_PLAN_LABELS: Record<StripePriceKey, string> = {
	b2b_sdk: 'Business SDK',
	b2b_appads: 'App-Ads.txt',
	b2b_premium: 'Premium B2B'
};

export async function createCheckoutSession(
	userId: number,
	email: string,
	priceKey: StripePriceKey,
	billingCycle: BillingCycle = 'monthly'
) {
	try {
		// Create or get customer
		let stripeCustomerId: string | null = null;

		const user = await db.queryOne<{ provider_customer_id: string | null }>(
			'SELECT provider_customer_id FROM users WHERE id = $1',
			[userId]
		);

		if (user?.provider_customer_id) {
			stripeCustomerId = user.provider_customer_id;
		} else {
			const customer = await stripe.customers.create({
				email: email,
				metadata: {
					userId: userId.toString()
				}
			});
			stripeCustomerId = customer.id;
			await db.execute('UPDATE users SET provider_customer_id = $1 WHERE id = $2', [
				stripeCustomerId,
				userId
			]);
		}

		// Look up the active Stripe price ID from the DB instead of hardcoded env vars.
		// This automatically picks up new prices and tolerates retired IDs
		// as long as they exist in tier_prices with is_current = TRUE.
		const priceRow = await db.queryOne<{ provider_price_id: string }>(
			`SELECT tp.provider_price_id
		 FROM public.tier_prices tp
		 JOIN public.tiers t ON t.id = tp.tier_id
		 WHERE t.slug = $1 AND tp.billing_cycle = $2
		   AND tp.provider_name = 'stripe' AND tp.is_current = TRUE`,
			[priceKey, billingCycle]
		);

		if (!priceRow) {
			throw error(400, 'No active Stripe price found for this plan');
		}
		const priceId = priceRow.provider_price_id;

		const session = await stripe.checkout.sessions.create({
			customer: stripeCustomerId,
			billing_address_collection: 'auto',
			line_items: [
				{
					price: priceId,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${APPGOBLIN_ENDPOINT_URL}/account?success=true`,
			cancel_url: `${APPGOBLIN_ENDPOINT_URL}/pricing?canceled=true`
		});

		return session.url;
	} catch (e) {
		console.error('Error creating checkout session:', e);
		throw error(500, 'Error creating checkout session');
	}
}

export async function createPortalSession(userId: number) {
	try {
		const user = await db.queryOne<{ provider_customer_id: string | null }>(
			'SELECT provider_customer_id FROM users WHERE id = $1',
			[userId]
		);

		if (!user?.provider_customer_id) {
			throw error(400, 'User does not have a Stripe customer ID');
		}

		const session = await stripe.billingPortal.sessions.create({
			customer: user.provider_customer_id,
			return_url: `${APPGOBLIN_ENDPOINT_URL}/account`
		});

		return session.url;
	} catch (e) {
		console.error('Error creating portal session:', e);
		throw error(500, 'Error creating portal session');
	}
}
