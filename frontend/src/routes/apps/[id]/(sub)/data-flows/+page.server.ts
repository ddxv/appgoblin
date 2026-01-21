import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const { myapp } = await parent();
	let apis = { apis: [] };
	if (myapp.api_successful_last_crawled) {
		const id = params.id;
		const api = createApiClient(fetch);
		apis = await api.get(`/apps/${id}/apis`, 'App APIs');
	}

	return {
		apis,
		myapp,
		// Meta Tags
		toFollow: 'noindex, follow',
		title: `API Calls for ${myapp.name}`,
		description: `Explore the API calls used for ${myapp.name}. See which companies ${myapp.name} is sharing data with.`,
		keywords: `tracking, data sharing, data flows, api calls, api, data`
	};
};
