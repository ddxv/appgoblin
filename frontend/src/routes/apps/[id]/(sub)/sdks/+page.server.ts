import type { PageServerLoad } from './$types.js';
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

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const api = createApiClient(fetch);
	const id = params.id;

	const myPackageInfo = await api.get(`/apps/${id}/sdks`, 'App Package Info');
	const { companyTypes } = await parent();
	const { myapp } = await parent();

	return {
		myPackageInfo,
		companyTypes,
		myapp,
		// Meta Tags
		title: `SDKs and Trackers in ${myapp.name}`,
		description: `Explore the SDKs, trackers and permissions in ${myapp.name}. See which SDKs, trackers and permissions are used in ${myapp.name}.`,
		keywords: `SDKs, competitor analysis, trackers, permissions, ad networks, ad publishers, ad networks, ad publishers`
	};
};
