import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

import type { Actions } from './$types';

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

export const load: PageServerLoad = async ({ fetch, params }) => {
	const api = createApiClient(fetch);
	const id = params.id;

	const apis = await api.get(`/apps/${id}/apis`, 'App APIs');

	return {
		apis
	};
};
