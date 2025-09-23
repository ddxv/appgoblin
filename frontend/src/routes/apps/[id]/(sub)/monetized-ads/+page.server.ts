import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const { myapp } = await parent();
	const id = params.id;
	const api = createApiClient(fetch);
	const creatives = await api.get(`/creatives/apps/${id}/monetized`, 'Creatives');

	return {
		creatives,
		myapp
	};
};
