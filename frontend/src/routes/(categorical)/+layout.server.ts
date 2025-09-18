import type { LayoutServerLoad } from './$types';

import { getCachedData } from '../../hooks.server';

export const csr = false;

export const load: LayoutServerLoad = async () => {
	const cachedData = await getCachedData();
	const { appCats, companyTypes } = cachedData;
	return {
		companyTypes,
		appCats,
		cacheTimestamp: new Date().toISOString()
	};
};
