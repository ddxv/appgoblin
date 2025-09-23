import type { LayoutServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

import { getCachedData } from '../../../hooks.server';

export const load: LayoutServerLoad = async ({ fetch, params, setHeaders }) => {
	const api = createApiClient(fetch);

	const myapp = await api.get(`/apps/${params.id}`, 'App Details');
	const cachedData = await getCachedData();
	const { appCats, companyTypes } = cachedData;

	return { myapp, companyTypes, appCats };
};
