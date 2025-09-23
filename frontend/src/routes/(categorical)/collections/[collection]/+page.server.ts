import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	const api = createApiClient(fetch);
	const collectionValue = params.collection;

	setHeaders({
		'cache-control': 'public, max-age=86400, stale-while-revalidate=3600'
	});

	const AppCollections = await api.get(`/apps/collections/${collectionValue}`, 'App Collections');

	return {
		AppCollections
	};
};
