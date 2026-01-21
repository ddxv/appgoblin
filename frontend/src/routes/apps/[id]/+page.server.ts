import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const id = params.id;

	const appSDKsOverview = await api.get(`/apps/${params.id}/sdksoverview`, 'App SDKs Overview');

	const { myapp } = await parent();

	const myhistory = await api.get(`/apps/${id}/ratingHistogram`, 'Rating Histogram');

	return {
		//Meta
		toFollow: 'index, follow',
		//Data
		myapp,
		myhistory,
		appSDKsOverview
	};
};
