import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;

	const [companyAppCategories, companyTopApps, { companyDetails, companyTree }] = await Promise.all(
		[
			api.get(
				`/companies/${companyDomain}/parentcategories?rollup=false`,
				'Company App Categories'
			),
			api.get(`/companies/${companyDomain}/topapps`, 'Company Top Apps'),
			parent()
		]
	);

	const parentAppCategories = companyDetails.parent_overview
		? await api.get(
				`/companies/${companyDomain}/parentcategories?rollup=true`,
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
		companyCreatives: []
	};
};
