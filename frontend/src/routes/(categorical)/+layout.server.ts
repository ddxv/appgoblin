import type { LayoutServerLoad } from './$types';

import { getCachedData } from '../../hooks.server';

export const csr = false;

export const load: LayoutServerLoad = async () => {
	const cachedData = await getCachedData();
	const { appCats, companyTypes, storeIDLookup } = cachedData;
	return {
		companyTypes,
		appCats,
		storeIDLookup,
		cacheTimestamp: new Date().toISOString()
	};
};
