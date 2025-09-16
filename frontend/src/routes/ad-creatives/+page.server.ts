import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api';

export const csr = false;

export const load: PageServerLoad = async ({ fetch }) => {
	const api = createApiClient(fetch);
	const creatives = await api.get('/creatives', 'Creatives');

	return { creatives };
};
