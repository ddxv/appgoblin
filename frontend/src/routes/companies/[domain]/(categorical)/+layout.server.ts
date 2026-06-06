import type { LayoutServerLoad } from './$types';
import { getAppCategories } from '$lib/server/appCategories';

export const load: LayoutServerLoad = async () => {
	const appCats = await getAppCategories();

	return {
		appCats
	};
};
