import type { PageServerLoad } from './$types';

import type { Actions } from './$types';
import { getCachedData } from '../../../../hooks.server';

import { createApiClient } from '$lib/server/api';

export const actions = {
	updateRanks: async ({ request, fetch, params }) => {
		const formData = await request.formData();
		const country = formData.get('country');
		const id = params.id;
		const api = createApiClient(fetch);
		const resp = await api.get(`/apps/${id}/ranks?country=${country}`, `App Ranks ${country}`);
		return resp;
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, params, url }) => {
	const id = params.id;
	const country = url.searchParams.get('country') || 'US';
	const api = createApiClient(fetch);
	const myranksOverview = await api.get(`/apps/${id}/ranks/overview`, 'App Ranks Overview');
	const myranks = api.get(`/apps/${id}/ranks?country=${country}`, 'App Ranks');
	const { countries } = await getCachedData();

	return {
		myranks,
		myranksOverview,
		countries
	};
};
