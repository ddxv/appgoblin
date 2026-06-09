import type { LayoutServerLoad } from '../../$types';

import { getAppCategories } from '$lib/server/appCategories';
import { getCachedData } from '../../../hooks.server';

export const load: LayoutServerLoad = async () => {
	const cachedData = await getCachedData();
	const appCats = await getAppCategories();
	const { companyTypes, categoryIDLookup } = cachedData;
	return {
		companyTypes,
		appCats,
		categoryIDLookup,
		cacheTimestamp: new Date().toISOString()
	};
};
