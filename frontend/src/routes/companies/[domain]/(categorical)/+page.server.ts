import { db } from '$lib/server/auth/db';
import { STRIPE_PRICES } from '$lib/server/stripe';
import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, parent, params, locals }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;

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
			hasB2BSdkAccess = [STRIPE_PRICES.b2b_sdk, STRIPE_PRICES.b2b_premium].includes(
				row.provider_price_id
			);
		}
	}

	const [companyAppCategories, companyTopApps, { companyDetails, companyTree }] = await Promise.all(
		[
			api.get(
				`/companies/${companyDomain}/parentcategories?rollup=false&group_mode=none`,
				'Company App Categories'
			),
			api.get(`/companies/${companyDomain}/topapps`, 'Company Top Apps'),
			parent()
		]
	);

	const parentAppCategories = companyDetails.parent_overview
		? await api.get(
				`/companies/${companyDomain}/parentcategories?rollup=true&group_mode=none`,
				'Parent Company App Categories'
			)
		: null;

	return {
		companyDetails,
		companyTree,
		companyAppCategories,
		parentAppCategories,
		companyTopApps,
		companySdks: { companies: {} },
		companyCreatives: [],
		hasB2BSdkAccess
	};
};
