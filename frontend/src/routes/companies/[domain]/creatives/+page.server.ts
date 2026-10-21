import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';
import { userHasTierAccess } from '$lib/server/subscription';

async function isPremiumB2B(userId: number | null): Promise<boolean> {
	if (!userId) return false;
	return userHasTierAccess(userId, 'b2b_premium');
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
