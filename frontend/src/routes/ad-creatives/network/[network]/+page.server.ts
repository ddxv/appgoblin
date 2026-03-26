import type { PageServerLoad } from './$types';

import { loadAdCreativesPage } from '../../load-page';

export const ssr = true;
export const csr = true;

export const load: PageServerLoad = async ({ fetch, locals, params, url }) => {
	return loadAdCreativesPage({
		fetch,
		isSignedIn: Boolean(locals.user),
		url,
		primaryFilter: 'network',
		network: params.network
	});
};
