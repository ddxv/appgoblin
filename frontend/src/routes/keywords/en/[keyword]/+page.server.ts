import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ params }) => {
	const keyword = params.keyword;
	const api = createApiClient(fetch);

	const keywordDetails = await api.get(`/keywords/${keyword}`, 'Keyword Details');
	const keywordApps = await api.get(`/keywords/${keyword}/ranks`, 'Keyword Apps');

	return {
		keywordDetails,
		keywordApps
	};
};
