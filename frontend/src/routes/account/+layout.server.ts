import { requireAuthOr401 } from '#lib/server/auth/auth.js';
import { db } from '#lib/server/auth/db.js';
import { STRIPE_PLAN_LABELS, stripe, type StripePriceKey } from '#lib/server/stripe.js';
import { getUserOrganization } from '#lib/server/organization.js';
import type { LayoutServerLoadEvent } from './$types';

export async function load(event: LayoutServerLoadEvent) {
	const { user } = requireAuthOr401(event);
	const organization = await getUserOrganization(user.id);

	interface Subscription {
		status: string;
		provider_name: string;
		provider_subscription_id: string | null;
		current_period_start: Date | null;
		current_period_end: Date;
		cancel_at: Date | null;
		cancel_requested_at: Date | null;
		seats_total: number;
		created_at: Date;
		tier_slug: string | null;
		billing_cycle: 'monthly' | 'yearly';
		provider_price_id: string | null;
		base_price_amount: number | null;
		seat_price_amount: number | null;
		planName?: string | null;
	}

	interface SubscriptionHistoryRow extends Subscription {
		updated_at: Date;
	}

	const subscriptions = await db.query<Subscription>(
		`		SELECT s.status, tp.provider_name, s.provider_subscription_id, s.current_period_start, s.current_period_end,
		        s.cancel_at, s.cancel_requested_at, s.seats_total, s.created_at,
		        t.slug AS tier_slug, tp.billing_cycle,
		        tp.provider_price_id,
		        NULL::numeric AS base_price_amount,
		        NULL::numeric AS seat_price_amount
         FROM subscriptions s
         LEFT JOIN tier_prices tp ON tp.id = s.tier_price_id
         LEFT JOIN tiers t ON t.id = tp.tier_id
			 JOIN organization_members om ON om.organization_id = s.organization_id
		 WHERE om.user_id = $1
	         AND (
	         	(s.cancel_at IS NOT NULL AND s.cancel_at > NOW())
	         	OR (s.cancel_at IS NULL AND s.status IN ('active', 'trialing'))
	         )
	         ORDER BY s.updated_at DESC`,
		[user.id]
	);

	const subscription = subscriptions[0] ?? null;
	if (subscription?.provider_name === 'stripe' && subscription.provider_subscription_id) {
		try {
			const stripeSubscription = await stripe.subscriptions.retrieve(
				subscription.provider_subscription_id,
				{
					expand: ['items.data.price']
				}
			);
			const items = stripeSubscription.items.data;
			const baseItem = items.find((item) => item.price.id === subscription.provider_price_id);
			const seatItem = items.find((item) => item.price.id !== subscription.provider_price_id);
			subscription.base_price_amount = baseItem?.price.unit_amount
				? baseItem.price.unit_amount / 100
				: null;
			subscription.seat_price_amount = seatItem?.price.unit_amount
				? seatItem.price.unit_amount / 100
				: null;
		} catch (error) {
			console.error('Unable to load Stripe subscription pricing:', error);
		}
	}

	const subscriptionHistory = await db.query<SubscriptionHistoryRow>(
		`SELECT s.status, s.current_period_start, s.current_period_end, s.cancel_at,
		        s.cancel_requested_at, s.updated_at,
		        t.slug AS tier_slug
		 FROM subscriptions s
		 LEFT JOIN tier_prices tp ON tp.id = s.tier_price_id
		 LEFT JOIN tiers t ON t.id = tp.tier_id
		 JOIN organization_members om ON om.organization_id = s.organization_id
		 WHERE om.user_id = $1
		 AND NOT (
		 	(s.cancel_at IS NOT NULL AND s.cancel_at > NOW())
		 	OR (s.cancel_at IS NULL AND s.status IN ('active', 'trialing'))
		 )
		 ORDER BY COALESCE(s.cancel_at, s.current_period_end, s.updated_at) DESC`,
		[user.id]
	);

	const resolvePlanName = (slug: string | null): string | null =>
		slug && slug in STRIPE_PLAN_LABELS ? STRIPE_PLAN_LABELS[slug as StripePriceKey] : slug; // fallback to raw slug if unknown

	return {
		user: { ...user, organizationRole: organization?.role ?? null },
		subscription,
		subscriptions: subscriptions.map((entry) => ({
			...entry,
			planName: resolvePlanName(entry.tier_slug)
		})),
		showStripePortal: subscription?.provider_name === 'stripe',
		subscriptionHistory: subscriptionHistory.map((entry) => ({
			...entry,
			planName: resolvePlanName(entry.tier_slug) ?? entry.tier_slug
		})),
		subscriptionTier: resolvePlanName(subscription?.tier_slug ?? null)
	};
}
