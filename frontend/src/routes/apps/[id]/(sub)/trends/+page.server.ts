import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const api = createApiClient(fetch);
	const id = params.id;

	const myhistory = await api.get(`/apps/${id}/history`, 'App History');

	return {
		myhistory
	};
};
