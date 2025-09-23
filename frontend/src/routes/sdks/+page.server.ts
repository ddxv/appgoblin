import type { PageServerLoad } from './$types.js';
import { getCachedData } from '../../hooks.server';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch }) => {
	const api = createApiClient(fetch);
	const sdksUserRequested = api.get(`/sdks/user_requested`, 'Sdks User Requested');
	const sdksOverview = api.get(`/sdks/latest`, 'Sdks Latest');
	const sdksParts = api.get(`/sdks/sdkparts`, 'Sdks Parts');
	const { appsOverview } = await getCachedData();
	console.log('start load overview for sdks');
	return {
		appsOverview,
		sdksOverview,
		sdksParts,
		sdksUserRequested
	};
};
