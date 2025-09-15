import type { PageServerLoad } from './$types.js';

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
	const id = params.id;

	console.log('id', id);

	const apisResp = await fetch(`http://localhost:8000/api/apps/${id}/apis`);
	const apis = await apisResp.json();

	return {
		apis: apis
	};
};
