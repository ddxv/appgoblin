import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const prerender = true;

export const load: PageServerLoad = async ({ fetch }) => {
	const api = createApiClient(fetch);
	const datasets = await api.get('/public/exports/datasets', 'Export Datasets');
	return { datasets: Array.isArray(datasets) ? datasets : [] };
};
