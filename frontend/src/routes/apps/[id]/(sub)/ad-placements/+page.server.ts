import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const api = createApiClient(fetch);
	const id = params.id;
	const creatives = await api.get(`/creatives/apps/${id}/ads`, 'Ad Creatives');
	const { myapp } = await parent();

	return {
		creatives,
		myapp,
		// Meta Tags
		title: `Ad Placements for ${myapp.name}`,
		description: `Explore the ad placements used for ${myapp.name}. See the ad placements they are running and their ad and creative strategies.`,
		keywords: `ad placements, ad publishers, ad networks, videos, images, ads`
	};
};
