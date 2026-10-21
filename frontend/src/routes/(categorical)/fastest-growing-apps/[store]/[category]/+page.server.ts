import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const csr: boolean = true;
export const ssr: boolean = true;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const category = params.category;
	const store = params.store;
	let storeId = 1;
	if (store === 'google') {
		storeId = 1;
	} else if (store === 'apple') {
		storeId = 2;
	}
	const api = createApiClient(fetch);

	const growthApps = await api.get(
		`/apps/growth/${storeId}?app_category=${category}`,
		'Growth Apps'
	);

	return { growthApps };
};
