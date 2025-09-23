import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const api = createApiClient(fetch);
	const term = params.term;
	const searchTerm = decodeURIComponent(term);
	console.log(`search start term=${searchTerm}`);

	const results = api.get(`/apps/search/${searchTerm}`, 'Apps Search');
	const companiesResults = api.get(`/companies/search/${searchTerm}`, 'Companies Search');

	return {
		results,
		companiesResults
	};
};
