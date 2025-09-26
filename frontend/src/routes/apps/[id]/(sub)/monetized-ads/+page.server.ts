import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const { myapp } = await parent();
	const id = params.id;
	const api = createApiClient(fetch);
	const creatives = await api.get(`/creatives/apps/${id}/monetized`, 'Creatives');

	return {
		creatives,
		myapp,
		// Meta Tags
		title: `Ad Monetization for ${myapp.name}`,
		description: `Explore the ads ${myapp.name} uses for monetization. See which ad networks ${myapp.name} is working with to monetize their app.`,
		keywords: `monetized ads, ads, ad networks, ad publishers, ad networks, ad publishers`
	};
};
