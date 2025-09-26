import type { PageServerLoad, Actions } from './$types';

import { createApiClient } from '$lib/server/api';

export const actions = {
	requestSDKScan: async (event) => {
		const formData = await event.request.formData();
		const appId = formData.get('appId');
		console.log('requestSDKScan', appId);

		const response = await fetch(`http://localhost:8000/api/apps/${appId}/requestSDKScan`, {
			method: 'POST'
		});
		if (response.status === 200) {
			return { success: true };
		} else {
			return { success: false };
		}
	}
} satisfies Actions;

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const id = params.id;

	const appSDKsOverview = await api.get(`/apps/${params.id}/sdksoverview`, 'App SDKs Overview');

	const { myapp } = await parent();

	// Streaming
	const myhistory = await api.get(`/apps/${id}/history`, 'App History');

	return {
		myapp,
		myhistory,
		appSDKsOverview
	};
};
