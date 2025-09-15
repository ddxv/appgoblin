import type { PageServerLoad } from './$types.js';

import type { Actions } from './$types';

export const actions = {
	updateRanks: async ({ request, fetch, params }) => {
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

export const load: PageServerLoad = async ({ fetch, params, url, parent }) => {
	const { countries } = await parent();
	const id = params.id;
	const country = url.searchParams.get('country') || 'US';

	const myranksOverview = async () => {
		try {
			const resp = await fetch(`http://localhost:8000/api/apps/${id}/ranks/overview`, {
				signal: AbortSignal.timeout(10000) // 10 second timeout
			});
			return checkStatus(resp, 'App Ranks Overview');
		} catch (error: any) {
			console.error('App Ranks Overview fetch failed:', error.message);
			return 'App Ranks Overview API Error'; // Return fallback instead of crashing
		}
	};

	const myranks = async () => {
		try {
			const resp = await fetch(`http://localhost:8000/api/apps/${id}/ranks?country=${country}`, {
				signal: AbortSignal.timeout(10000)
			});
			return checkStatus(resp, 'App Ranks');
		} catch (error: any) {
			console.error('App Ranks fetch failed:', error.message);
			return 'App Ranks API Error';
		}
	};

	return {
		myranks: myranks(),
		myranksOverview: myranksOverview(),
		countries: countries
	};
};
