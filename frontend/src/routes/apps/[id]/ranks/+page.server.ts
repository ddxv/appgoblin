import type { PageServerLoad } from './$types.js';

import type { Actions } from './$types';

export const actions = {
	
	updateRanks: async ({ request, params }) => {
		const formData = await request.formData();
		const country = formData.get('country');
		const id = params.id;

		const resp = await fetch(`http://localhost:8000/api/apps/${id}/ranks?country=${country}`);
		return checkStatus(resp, 'App Ranks');
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

export const load: PageServerLoad = async ({ params, url }) => {
	const id = params.id;
	const country = url.searchParams.get('country') || 'US';

	const myranksOverview = async () => {
		const resp = await fetch(`http://localhost:8000/api/apps/${id}/ranks/overview`);
		return checkStatus(resp, 'App Ranks Overview');
	};

	const myranks = async () => {
		const resp = await fetch(`http://localhost:8000/api/apps/${id}/ranks?country=${country}`);
		return checkStatus(resp, 'App Ranks');
	};


	return {
		myranks: myranks(),
		myranksOverview: myranksOverview(),
	};
};
