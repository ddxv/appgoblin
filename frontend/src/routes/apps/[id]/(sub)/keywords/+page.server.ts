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

export const load: PageServerLoad = async ({ params, parent }) => {
	const id = params.id;
	// Load parent data first because it is cached
	const { myapp } = await parent();

	// Conditionally create myKeywords based on description length
	let myKeywords = async () => 'No Keywords Result';
	if (myapp.description && myapp.description.length > 100) {
		myKeywords = async () => {
			const resp = await fetch(`http://localhost:8000/api/apps/${id}/keywords`);
			return checkStatus(resp, 'App Keywords');
		};
	}

	return {
		myKeywords: myKeywords(),
		myapp: myapp
	};
};
