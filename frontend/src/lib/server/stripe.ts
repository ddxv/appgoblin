import Stripe from 'stripe';
import { db } from '$lib/server/auth/db';
import { error } from '@sveltejs/kit';

import {
	STRIPE_SECRET_KEY,
	STRIPE_PRICE_B2B_SDK_MO,
	STRIPE_PRICE_B2B_SDK_YR,
	STRIPE_PRICE_B2B_APPADS_ID_MO,
	STRIPE_PRICE_B2B_APPADS_ID_YR,
	STRIPE_PRICE_B2B_PREMIUM_MO,
	STRIPE_PRICE_B2B_PREMIUM_YR,
	APPGOBLIN_ENDPOINT_URL
} from '$env/static/private';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2026-03-25.dahlia'
});

export type BillingCycle = 'monthly' | 'yearly';

export const STRIPE_PRICES = {
	b2b_sdk: { monthly: STRIPE_PRICE_B2B_SDK_MO, yearly: STRIPE_PRICE_B2B_SDK_YR },
	b2b_appads: {
		monthly: STRIPE_PRICE_B2B_APPADS_ID_MO,
		yearly: STRIPE_PRICE_B2B_APPADS_ID_YR
	},
	b2b_premium: {
		monthly: STRIPE_PRICE_B2B_PREMIUM_MO,
		yearly: STRIPE_PRICE_B2B_PREMIUM_YR
	}
} as const satisfies Record<string, Record<BillingCycle, string>>;

export type StripePriceKey = keyof typeof STRIPE_PRICES;

/** Flatten one or more plan keys into their full list of price IDs (both cycles). */
export function getStripePriceIds(...keys: StripePriceKey[]): string[] {
	return keys.flatMap((key) => {
		const entry = STRIPE_PRICES[key];
		return [entry.monthly, entry.yearly];
	});
}

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

		const priceId = STRIPE_PRICES[priceKey]?.[billingCycle];

		if (!priceId) {
			throw error(400, 'Invalid Stripe price key or billing cycle');
		}

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
