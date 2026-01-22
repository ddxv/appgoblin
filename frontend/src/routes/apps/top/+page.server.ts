import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

interface CompanyRaw {
	company_name: string | null;
	company_domain: string | null;
	total_apps: number;
}

export const load: PageServerLoad = async ({ fetch }) => {
	const api = createApiClient(fetch);

	// Load companies for the dropdown filters
	const companiesOverview = await api.get('/companies', 'Companies Overview');

	// Filter out companies with null names or domains, and sort by app count
	const companies = (companiesOverview.companies_overview || [])
		.filter(
			(c: CompanyRaw) =>
				c.company_name != null &&
				c.company_domain != null &&
				c.company_name.trim() !== '' &&
				c.company_domain.trim() !== ''
		)
		.sort((a: CompanyRaw, b: CompanyRaw) => (b.total_apps || 0) - (a.total_apps || 0));

	return {
		companies
	};
};
