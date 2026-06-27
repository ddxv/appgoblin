import { db } from '$lib/server/auth/db';
import { getStripePriceIds } from '$lib/server/stripe';
import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, parent, params, locals }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;
	const category = params.category;

	const user = locals.user;
	let hasB2BSdkAccess = false;
	if (user) {
		const row = await db.queryOne<{ provider_price_id: string }>(
			`SELECT provider_price_id FROM subscriptions
			 WHERE user_id = $1
			 AND status IN ('active', 'trialing')
			 AND (cancel_at IS NULL OR cancel_at > NOW())
			 ORDER BY created_at DESC LIMIT 1`,
			[user.id]
		);
		if (row) {
			hasB2BSdkAccess = getStripePriceIds('b2b_sdk', 'b2b_premium').includes(row.provider_price_id);
		}
	}

	const companyCategoryApps = await api.get(
		`/companies/${companyDomain}/topapps?category=${category}`,
		'Company Top Apps'
	);

	const { companyDetails, companyTree } = await parent();

	return {
		companyDetails,
		companyTree,
		companyCategoryApps,
		hasB2BSdkAccess
	};
};
