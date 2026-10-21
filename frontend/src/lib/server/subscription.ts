import { db } from '$lib/server/auth/db';
import { getOrganizationSubscriptionAccess } from '$lib/server/organization';

/**
 * Get all tier slugs the user currently has access to.
 * Returns an empty array for free/no-subscription users.
 */
export async function getUserTierSlugs(userId: number): Promise<string[]> {
	const organizationSubscription = await getOrganizationSubscriptionAccess(userId);
	return organizationSubscription?.tier_slug ? [organizationSubscription.tier_slug] : [];
}

/**
 * Check if a user has access to any of the given tier slugs.
 *
 * @example
 *   await userHasTierAccess(userId, 'b2b_sdk', 'b2b_premium')
 */
export async function userHasTierAccess(userId: number, ...slugs: string[]): Promise<boolean> {
	if (!userId || slugs.length === 0) return false;
	const organizationSubscription = await getOrganizationSubscriptionAccess(userId);
	return (
		!!organizationSubscription?.tier_slug && slugs.includes(organizationSubscription.tier_slug)
	);
}

/**
 * Get the user's active subscription with joined tier info.
 * Returns null if no active subscription found.
 */
export async function getActiveSubscription(userId: number) {
	const organizationSubscription = await getOrganizationSubscriptionAccess(userId);
	if (organizationSubscription) {
		return db.queryOne(
			`SELECT s.id, s.status, tp.provider_name,
			        s.current_period_start, s.current_period_end,
			        s.cancel_at, s.cancel_requested_at,
			        s.tier_price_id, t.slug AS tier_slug,
			        tp.billing_cycle
			 FROM subscriptions s
			 LEFT JOIN tier_prices tp ON tp.id = s.tier_price_id
			 LEFT JOIN tiers t ON t.id = tp.tier_id
			 JOIN organization_members om ON om.organization_id = s.organization_id
			 WHERE om.user_id = $1 AND s.id = $2`,
			[userId, organizationSubscription.id]
		);
	}

	const row = await db.queryOne<{
		id: number;
		status: string;
		current_period_start: Date;
		current_period_end: Date;
		cancel_at: Date | null;
		cancel_requested_at: Date | null;
		tier_price_id: number | null;
		tier_slug: string | null;
		billing_cycle: string | null;
	}>(
		`SELECT s.id, s.status, tp.provider_name,
		        s.current_period_start, s.current_period_end,
		        s.cancel_at, s.cancel_requested_at,
		        s.tier_price_id,
		        t.slug AS tier_slug,
		        tp.billing_cycle
		 FROM public.subscriptions s
		 LEFT JOIN public.tier_prices tp ON tp.id = s.tier_price_id
		 LEFT JOIN public.tiers t ON t.id = tp.tier_id
		 JOIN organization_members om ON om.organization_id = s.organization_id
		 WHERE om.user_id = $1
		   AND (
		     (s.cancel_at IS NOT NULL AND s.cancel_at > NOW())
		     OR (s.cancel_at IS NULL AND s.status IN ('active', 'trialing'))
		   )
		 ORDER BY s.updated_at DESC
		 LIMIT 1`,
		[userId]
	);
	return row ?? null;
}
