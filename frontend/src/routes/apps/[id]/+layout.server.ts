import type { LayoutServerLoad } from './$types';

function checkStatus(resp: Response, name: string) {
	if (resp.status === 200) {
		return resp.json();
	} else if (resp.status === 404) {
		console.log(`App ${name} Not found`);
		return `${name} Not Found`;
	} else if (resp.status === 500) {
		console.log(`App ${name} API Server error`);
		return `${name} API Server error`;
	} else {
		throw new Error('Unknown error');
	}
}

export const load: LayoutServerLoad = async ({ fetch, params, parent }) => {
	const { companyTypes } = await parent();

	const myapp = async () => {
		const resp = await fetch(`http://localhost:8000/api/apps/${params.id}`);
		return checkStatus(resp, 'App');
	};

	// Get the app data first
	const app = await myapp();

	return { myapp: app, companyTypes: await companyTypes };
};
