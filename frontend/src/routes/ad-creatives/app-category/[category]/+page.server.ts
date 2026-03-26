import type { PageServerLoad } from './$types';

import { loadAdCreativesPage } from '../../load-page';

export const ssr = true;
export const csr = true;

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	return loadAdCreativesPage({
		fetch,
		url,
		primaryFilter: 'app-category',
		category: params.category
	});
};
