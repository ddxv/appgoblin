import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCachedData } from '../../../../hooks.server';

export const GET: RequestHandler = async () => {
	const { companyDirectory } = await getCachedData();

	return json(companyDirectory, {
		headers: {
			'cache-control': 'public, max-age=86400, stale-while-revalidate=3600'
		}
	});
};
