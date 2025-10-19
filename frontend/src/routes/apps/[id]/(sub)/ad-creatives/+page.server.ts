import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const { myapp } = await parent();
	let creatives = null;
	if (myapp.ad_creative_count && myapp.ad_creative_count > 0) {
	    const id = params.id;
	    const api = createApiClient(fetch);
		creatives = await api.get(`/creatives/apps/${id}/ads`, 'Ad Creatives');
	}

	return {
		creatives,
		myapp,
		// Meta Tags
		toFollow: 'noindex, follow',
		title: `Ad Creatives for ${myapp.name}`,
		description: `Explore the advertising creatives used for ${myapp.name}. See the ad creatives they are running and their ad and creative strategies.`,
		keywords: `ad creatives, videos, images, ads`
	};
};
