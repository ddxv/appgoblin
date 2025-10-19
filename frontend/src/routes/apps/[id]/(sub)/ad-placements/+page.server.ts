import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	let creatives = null;
	const { myapp } = await parent();
	if (myapp.ad_creative_count && myapp.ad_creative_count > 0) {
	    const api = createApiClient(fetch);
	    const id = params.id;
		creatives = await api.get(`/creatives/apps/${id}/ads`, 'Ad Creatives');
	}

	return {
		creatives,
		myapp,
		// Meta Tags
		toFollow: 'noindex, follow',
		title: `Ad Placements for ${myapp.name}`,
		description: `Explore the ad placements used for ${myapp.name}. See the ad placements they are running and their ad and creative strategies.`,
		keywords: `ad placements, ad publishers, ad networks, videos, images, ads`
	};
};
