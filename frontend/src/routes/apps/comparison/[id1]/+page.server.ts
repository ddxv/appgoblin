import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { getCachedData } from '../../../../hooks.server';

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const api = createApiClient(fetch);
	const { id1 } = params;

	console.log(`Loading base comparison app ${id1}`);

	// Get search query params for both slots
	const search1 = url.searchParams.get('search1') || '';
	const search2 = url.searchParams.get('search2') || '';

	try {
		const promises: Promise<any>[] = [
			api.get(`/apps/${id1}`, `App ${id1} Details`),
			api.get(`/apps/${id1}/global-metrics-history`, `App ${id1} History`),
			api.get(`/apps/${id1}/ratingHistogram`, `App ${id1} Histogram`),
			api.get(`/apps/${id1}/sdksoverview`, `App ${id1} SDKs`),
			getCachedData()
		];

		// Add search requests if search params are present
		if (search1 && search1.length >= 3) {
			promises.push(
				api.get(`/apps/search/${encodeURIComponent(search1)}`, `Search Slot 1: ${search1}`)
			);
		} else {
			promises.push(Promise.resolve(null));
		}

		if (search2 && search2.length >= 3) {
			promises.push(
				api.get(`/apps/search/${encodeURIComponent(search2)}`, `Search Slot 2: ${search2}`)
			);
		} else {
			promises.push(Promise.resolve(null));
		}

		const [app1, history1, histogram1, sdks1, cachedData, searchResult1, searchResult2] =
			await Promise.all(promises);

		const { companyTypes, appCats } = cachedData;

		// Resolve categories server-side to avoid sending full appCats list to client
		if (appCats?.categories) {
			const cat1 = appCats.categories.find((c: any) => c.id === app1.category);
			if (cat1) app1.category = cat1.name;
		}

		return {
			app1,
			history1,
			histogram1,
			sdks1,
			companyTypes,
			searchResult1: searchResult1 || null,
			searchResult2: searchResult2 || null
		};
	} catch (e) {
		console.error('Error fetching data for base comparison app:', e);
		throw e;
	}
};
