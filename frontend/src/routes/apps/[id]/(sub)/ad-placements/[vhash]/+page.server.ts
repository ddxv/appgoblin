import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, parent, params }) => {
	const api = createApiClient(fetch);
	const { myapp } = await parent();
	const id = params.id;
	const vhash = params.vhash;
	const creativerecords = await api.get(`/creatives/apps/${id}/ads/${vhash}`, 'CreativeRecords');

	return {
		creativerecords,
		myapp
	};
};
