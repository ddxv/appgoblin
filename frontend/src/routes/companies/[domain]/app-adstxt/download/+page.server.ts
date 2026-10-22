import { error, redirect } from '@sveltejs/kit';
import { buildAppAdsTxtUrl } from '#lib/server/downloads.js';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		error(401, 'Please sign in to download App-Ads.txt data.');
	}
	const domain = event.params.domain || '';
	const downloadUrl = buildAppAdsTxtUrl(domain);
	if (downloadUrl) redirect(302, downloadUrl, { external: true });
	return { downloadUrl: null };
};
