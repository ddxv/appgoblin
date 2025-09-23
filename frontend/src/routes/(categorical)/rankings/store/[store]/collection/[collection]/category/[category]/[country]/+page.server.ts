import type { PageServerLoad } from '../$types';
import { getCachedData } from '../../../../../../../../../../hooks.server';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, params }) => {
	const api = createApiClient(fetch);

	const collectionValue = params.collection;
	const categoryValue = params.category;
	const countryValue = params.country || 'US';

	const ranks = await api.get(
		`/rankings/${collectionValue}/${categoryValue}?country=${countryValue}`,
		'Rankings'
	);
	const history = await api.get(
		`/rankings/${collectionValue}/${categoryValue}/history?country=${countryValue}`,
		'Rankings History'
	);
	const { countries } = await getCachedData();

	return {
		ranks,
		history,
		s: countries
	};
};
