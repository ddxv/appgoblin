import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';
import { getStripePriceIds } from '$lib/server/stripe';

type ActiveSubscriptionRow = {
	provider_price_id: string;
};

async function isPremiumB2B(userId: number | null): Promise<boolean> {
	if (!userId) return false;
	const row = await db.queryOne<ActiveSubscriptionRow>(
		`SELECT provider_price_id FROM subscriptions
		 WHERE user_id = $1
		 AND status IN ('active', 'trialing')
		 AND (cancel_at IS NULL OR cancel_at > NOW())
		 ORDER BY created_at DESC LIMIT 1`,
		[userId]
	);
	return !!row && getStripePriceIds('b2b_premium').includes(row.provider_price_id);
}

export const load: PageServerLoad = async ({ fetch, params, parent, locals }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;
	const premiumB2B = await isPremiumB2B(locals.user?.id ?? null);

	const limit = premiumB2B ? 80 : 8;
	const companyCreatives = await api.get(
		`/creatives/companies/${companyDomain}?limit=${limit}&shortlist=false`,
		'Company Creatives'
	);

	// waiting for parent layout data
	const { companyDetails, companyTree } = await parent();

	return {
		companyDetails,
		companyTree,
		companyCreatives,
		premiumB2B
	};
};
