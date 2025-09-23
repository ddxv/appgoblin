import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=86400, stale-while-revalidate=3600'
	});
};
