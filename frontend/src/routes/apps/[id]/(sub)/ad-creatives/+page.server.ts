import type { PageServerLoad } from './$types';
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
		title: `Ad Creatives for ${myapp.name}`,
		description: `Explore the advertising creatives used for ${myapp.name}. See the ad creatives they are running and their ad and creative strategies.`,
		keywords: `ad creatives, videos, images, ads`
	};
};
