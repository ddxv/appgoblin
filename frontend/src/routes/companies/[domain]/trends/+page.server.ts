import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;
	const companyTrends = await api.get(`/companies/${companyDomain}/trends`, 'Company Trends');

	const { companyDetails, companyTree } = await parent();

	return {
		companyDetails,
		companyTree,
		companyTrends
	};
};
