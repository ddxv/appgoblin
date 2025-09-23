import type { LayoutServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	const api = createApiClient(fetch);
	const devs = await api.get(`/developers/${params.developer}`, 'Developer Apps');

	return { devs };
};
