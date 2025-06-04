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
		return resp.json();
	} else if (resp.status === 404) {
		console.log(`${name} Not found`);
		return `${name} Not Found`;
	} else if (resp.status === 500) {
		console.log(`${name} API Server error`);
		return `${name} API Server error`;
	} else {
		throw new Error('Unknown error');
	}
}

export const load: PageServerLoad = async ({ params, parent }) => {
	const id = params.id;
	// Load parent data first because it is cached
	const { myapp } = await parent();

	const myhistory = async () => {
		const resp = await fetch(`http://localhost:8000/api/apps/${id}/history`);
		return checkStatus(resp, 'App History');
	};

	const appSDKsOverview = async () => {
		const resp = await fetch(`http://localhost:8000/api/apps/${params.id}/sdksoverview`);
		return checkStatus(resp, 'App SDKs Overview');
	};

	return {
		myapp: myapp,
		myhistory: myhistory(),
		appSDKsOverview: appSDKsOverview()
	};
};
