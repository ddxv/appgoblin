import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const api = createApiClient(fetch);
	const id = params.id;
	const creatives = await api.get(`/creatives/apps/${id}/ads`, 'Ad Creatives');
	const { myapp } = await parent();

	return {
		creatives,
		myapp
	};
};
