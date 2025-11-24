import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const id = params.id;
	const { myapp } = await parent();
	let isIOS = myapp.store.includes('Apple');

	let storeDbId = isIOS ? 2 : 1;
	let appMetrics = [];
	if (storeDbId === 2) {
		appMetrics = await api.get(
			`/apps/${id}/country-metrics-history`,
			'App Country Metrics History'
		);
	} else {
		appMetrics = await api.get(`/apps/${id}/global-metrics-history`, 'App Global Metrics History');
	}

	return {
		appMetrics,
		isIOS: isIOS,
		// Meta Tags
		toFollow: 'noindex, nofollow',
		title: `Install and Rating History for ${myapp.name}`,
		description: `Explore the install and rating history for ${myapp.name}. See the install and rating history for ${myapp.name}.`,
		keywords: `trends, install history, rating history, install and rating history`
	};
};
