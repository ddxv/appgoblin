import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, params }) => {
	const api = createApiClient(fetch);
	const periodValue = params.period;

	const category = params.category;
	const store = params.store;
	let storeId = 1;
	if (store === 'google') {
		storeId = 1;
	} else if (store === 'apple') {
		storeId = 2;
	}

	const newApps = await api.get(`/apps/new-apps/${periodValue}/${storeId}/${category}`, 'New Apps');

	return {
		newApps
	};
};
