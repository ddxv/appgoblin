import type { PageServerLoad } from './$types.js';

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

export const load: PageServerLoad = async ({ parent, params }) => {
	const { myapp } = await parent();
	const id = params.id;
	const creatives = async () => {
		const resp = await fetch(`http://localhost:8000/api/creatives/apps/${id}/monetized`);
		return checkStatus(resp, 'Creatives');
	};

	return {
		creatives: creatives(),
		myapp
	};
};
