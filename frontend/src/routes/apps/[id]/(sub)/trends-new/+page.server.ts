import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const id = params.id;

	const appGlobalMetrics = await api.get(
		`/apps/${id}/global-metrics-history`,
		'App Global Metrics History'
	);
	const { myapp } = await parent();

	return {
		appGlobalMetrics: appGlobalMetrics,
		// Meta Tags
		toFollow: 'noindex, nofollow',
		title: `Install and Rating History for ${myapp.name}`,
		description: `Explore the install and rating history for ${myapp.name}. See the install and rating history for ${myapp.name}.`,
		keywords: `trends, install history, rating history, install and rating history`
	};
};
