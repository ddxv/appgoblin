export const ssr: boolean = true;
export const csr: boolean = true;

console.log('Script executed');
import type { StoreCategoryRanks } from '../../../../../../../../types.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, url }): Promise<StoreCategoryRanks> => {
	const storeVal = params.store;
	const collectionValue = params.collection;
	const categoryValue = params.category;
	const res = await fetch(
		`http://localhost:8000/api/rankings/${storeVal}/${collectionValue}/${categoryValue}`
	);
	console.log(`to fetch s=${storeVal} col=${collectionValue} cat=${categoryValue}`);
	if (!res.ok) {
		throw new Error(
			`Failed to fetch s=${storeVal} col=${collectionValue} cat=${categoryValue} with status ${res.status}`
		);
	}

	const ranks = await res.json();
	return ranks;
};