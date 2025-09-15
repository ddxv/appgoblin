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

function checkStatus(resp: Response, name: string) {
	if (resp.status === 200) {
		console.log('App Full SDKs Result');
		return resp.json();
	} else if (resp.status === 404) {
		console.log(`App ${name}  SDKs Not found`);
		return `${name} Not Found`;
	} else if (resp.status === 500) {
		console.log(`App ${name} SDKs API Server error`);
		return `${name} SDKs API Server error`;
	} else {
		throw new Error('Unknown error');
	}
}

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const id = params.id;
	// Load parent data first because it is cached
	const { companyTypes } = await parent();
	const { myapp } = await parent();

	console.log('id', id);

	const resp = await fetch(`http://localhost:8000/api/apps/${id}/sdks`);

	return {
		myPackageInfo: checkStatus(resp, 'App Package Info'),
		companyTypes: companyTypes,
		myapp: myapp
	};
};
