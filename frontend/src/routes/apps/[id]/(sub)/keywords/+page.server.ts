import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const id = params.id;
	// Load parent data first because it is cached
	const { myapp } = await parent();

	// Conditionally create myKeywords based on description length
	let myKeywords = 'No Keywords Result';
	if (myapp.description && myapp.description.length > 100) {
		myKeywords = await api.get(`/apps/${id}/keywords`, 'App Keywords');
	}

	return {
		// Meta Tags
		title: `Keywords for ${myapp.name}`,
		description: `Keywords used for ${myapp.name}. Browse the keyword rankings for ${myapp.name}.`,
		keywords: `keywords, aso`,
		// Data
		myKeywords,
		myapp
	};
};
