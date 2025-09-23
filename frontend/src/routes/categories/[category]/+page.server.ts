import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ params, fetch }) => {
	const api = createApiClient(fetch);
	const category = params.category;
	const results = await api.get(`/categories/${category}`, 'Categories');

	return { results };
};
