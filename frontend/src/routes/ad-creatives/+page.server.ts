import type { PageServerLoad } from './$types';

export const csr = false;

function checkStatus(resp: Response, name: string) {
	if (resp.status === 200) {
		return resp.json();
	} else if (resp.status === 404) {
		console.log(`${name} Not found`);
		return { error: `${name} Not Found` };
	} else if (resp.status === 500) {
		console.log(`${name} API Server error`);
		return { error: `${name} API Server error` };
	} else {
		console.log(`${name} Unexpected status: ${resp.status}`);
		return { error: `${name} Unexpected error (${resp.status})` };
	}
}

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const resp = await fetch(`http://localhost:8000/api/creatives`);
		const creatives = await checkStatus(resp, 'Creatives');

		return {
			creatives
		};
	} catch (error) {
		console.error('Failed to load creatives:', error);
		return {
			creatives: { error: 'Failed to load creatives' }
		};
	}
};
