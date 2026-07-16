import { userHasTierAccess } from '$lib/server/subscription';
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
		hasB2BSdkAccess = await userHasTierAccess(user.id, 'b2b_sdk', 'b2b_premium');
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
