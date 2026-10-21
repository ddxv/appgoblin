import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, depends }) => {
	// Depend on user context so this load function runs again when auth state changes
	depends('app:user');

	const api = createApiClient(fetch);
	const datasets = await api.get('/public/exports/datasets', 'Export Datasets');
	return { datasets: Array.isArray(datasets) ? datasets : [] };
};
