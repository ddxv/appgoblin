import type { PageServerLoad } from './$types';

import { loadAdCreativesPage } from './load-page';

export const ssr = true;
export const csr = true;

export const load: PageServerLoad = async ({ fetch, url }) => {
	return loadAdCreativesPage({
		fetch,
		url,
		primaryFilter: 'base'
	});
};
