import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const prerender = false;

export const ssr = true;
// export const csr = true;

export const load: PageServerLoad = async ({ setHeaders, parent, fetch }) => {
	setHeaders({
		'cache-control': 'max-age=86400'
	});

	const api = createApiClient(fetch);
	const topAdvertisers = await api.get('/creatives/top', 'Top Advertisers');
	const androidAppRanks = await api.get('/rankings/1/1/short', 'Android App Ranks');
	const iOSAppRanks = await api.get('/rankings/4/120/short', 'iOS App Ranks');
	const androidGameRanks = await api.get('/rankings/1/36/short', 'Android Game Ranks');
	const iOSGameRanks = await api.get('/rankings/4/62/short', 'iOS Game Ranks');
	const topCompanies = await api.get('/companies/topshort', 'Top Companies');

	const { appsOverview } = await parent();

	return {
		androidAppRanks,
		iOSAppRanks,
		androidGameRanks,
		iOSGameRanks,
		topCompanies,
		topAdvertisers,
		appsOverview
	};
};
