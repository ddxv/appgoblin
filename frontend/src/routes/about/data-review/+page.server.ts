import type { PageServerLoad } from '../../$types';
import { getCachedData } from '../../../hooks.server';

export const prerender = false;

export const ssr = true;
export const csr = true;

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=86400, stale-while-revalidate=3600'
	});

	const cachedData = await getCachedData();

	const appsOverview = cachedData.appsOverview;

	return {
		appsOverview
	};
};
