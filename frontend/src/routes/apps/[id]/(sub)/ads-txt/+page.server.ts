import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const id = params.id;
	const api = createApiClient(fetch);
	const { appCats, companyTypes, myapp } = await parent();

	let myAdsTxt = 'No AdsTxt Result';
	if (myapp.adstxt_crawl_result === 1) {
		myAdsTxt = await api.get(`/apps/${id}/adstxt`, 'App AdsTxt');
	}

	return {
		myAdsTxt,
		appCats,
		companyTypes
	};
};
