import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;
	const companyAppCategories = await api.get(
		`/companies/${companyDomain}/parentcategories`,
		'Company App Categories'
	);
	const companyTopApps = await api.get(`/companies/${companyDomain}/topapps`, 'Company Top Apps');

	const { companyDetails, companyTree } = await parent();

	return {
		companyDetails,
		companyTree,
		companyAppCategories: companyAppCategories,
		companyTopApps,
		companySdks: { companies: {} },
		companyCreatives: []
	};
};
