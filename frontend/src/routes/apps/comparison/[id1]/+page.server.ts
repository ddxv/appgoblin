import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api';
import { getCachedData } from '../../../../hooks.server';

export const load: PageServerLoad = async ({ fetch, params, url, locals }) => {
	const api = createApiClient(fetch);
	const { companyTypes } = await getCachedData();
	const userId = locals.user?.id;
	const search1 = url.searchParams.get('search1')?.trim();
	const search2 = url.searchParams.get('search2')?.trim();

	const [app1, history1, histogram1, sdks1, searchResult1, searchResult2] = await Promise.all([
		api.get(`/apps/${params.id1}`, 'App Details'),
		api.get(`/apps/${params.id1}/global-metrics-history`, 'App Global Metrics History'),
		api.get(`/apps/${params.id1}/ratingHistogram`, 'Rating Histogram'),
		api.get(`/apps/${params.id1}/sdksoverview`, 'App SDKs Overview'),
		search1 && search1.length >= 3
			? api.get(`/apps/search/${encodeURIComponent(search1)}`, 'Apps Search', 30000, userId)
			: null,
		search2 && search2.length >= 3
			? api.get(`/apps/search/${encodeURIComponent(search2)}`, 'Apps Search', 30000, userId)
			: null
	]);

	return {
		app1,
		history1,
		histogram1,
		sdks1,
		companyTypes,
		searchResult1,
		searchResult2
	};
};
