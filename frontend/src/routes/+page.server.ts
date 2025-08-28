import type { PageServerLoad } from './$types.js';

export const prerender = false;

export const load: PageServerLoad = async ({ setHeaders, parent, fetch }) => {
	setHeaders({
		'cache-control': 'max-age=3600'
	});

	const { appsOverview } = await parent();

	try {
		const [
			androidAppRanks,
			iOSAppRanks,
			androidGameRanks,
			iOSGameRanks,
			topCompanies,
			topAdvertisers
		] = await Promise.all([
			fetch(`http://localhost:8000/api/rankings/1/1/short`).then((r) => r.json()),
			fetch(`http://localhost:8000/api/rankings/4/120/short`).then((r) => r.json()),
			fetch(`http://localhost:8000/api/rankings/1/36/short`).then((r) => r.json()),
			fetch(`http://localhost:8000/api/rankings/4/62/short`).then((r) => r.json()),
			fetch(`http://localhost:8000/api/companies/topshort`).then((r) => r.json()),
			fetch(`http://localhost:8000/api/creatives/top`).then((r) => r.json())
		]);

		return {
			androidAppRanks,
			iOSAppRanks,
			androidGameRanks,
			iOSGameRanks,
			topCompanies,
			topAdvertisers,
			appsOverview
		};
	} catch (err) {
		console.error('Failed to load homepage data:', err);
		return {
			androidAppRanks: null,
			iOSAppRanks: null,
			androidGameRanks: null,
			iOSGameRanks: null,
			topCompanies: null,
			topAdvertisers: null,
			appsOverview,
			error: 'Failed to load ranked apps'
		};
	}
};
