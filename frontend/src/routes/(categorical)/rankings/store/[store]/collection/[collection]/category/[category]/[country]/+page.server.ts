export const ssr: boolean = true;
export const csr: boolean = true;

import type { PageServerLoad } from '../$types.js';
import { getCachedData } from '../../../../../../../../../../hooks.server.js';

export const load: PageServerLoad = async ({ fetch, params, setHeaders }) => {
	const { countries } = await getCachedData();
	const emptyResponse = {};
	setHeaders({
		'cache-control': 'max-age=3600'
	});
	try {
		const collectionValue = params.collection;
		const categoryValue = params.category;
		const countryValue = params.country || 'US';
		const res = fetch(
			`http://localhost:8000/api/rankings/${collectionValue}/${categoryValue}?country=${countryValue}`
		);
		const history = fetch(
			`http://localhost:8000/api/rankings/${collectionValue}/${categoryValue}/history?country=${countryValue}`
		);

		return {
			ranks: res.then((resp) => resp.json()),
			history: history.then((resp) => resp.json()),
			countries: countries
		};
	} catch (error) {
		console.error('Failed to load app data:', error);
		return {
			ranks: emptyResponse,
			history: emptyResponse,
			status: 500,
			error: 'Failed to load ranked apps'
		};
	}
};
