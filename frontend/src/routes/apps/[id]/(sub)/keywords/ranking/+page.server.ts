import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const id = params.id;
	const { myapp } = await parent();

	let myKeywords = 'No Keywords Result';
	if (myapp.description && myapp.description.length > 100) {
		myKeywords = await api.get(`/apps/${id}/keywords`, 'App Keywords');
	}

	return {
		toFollow: 'noindex, nofollow',
		title: `Ranking Keywords for ${myapp.name}`,
		description: `Current ranking keywords for ${myapp.name}.`,
		keywords: 'keywords, aso, ranking',
		myKeywords,
		myapp
	};
};
