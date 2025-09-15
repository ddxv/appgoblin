import type { LayoutServerLoad } from './$types';

function checkStatus(resp: Response, name: string) {
	if (resp.status === 200) {
		return resp.json();
	} else if (resp.status === 404) {
		console.log(`Developer ${name} Not found`);
		return `${name} Not Found`;
	} else if (resp.status === 500) {
		console.log(`Developer ${name} API Server error`);
		return `Developer ${name} API Server error`;
	} else {
		throw new Error('Unknown error');
	}
}

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	const mydevs = async () => {
		const resp = await fetch(`http://localhost:8000/api/developers/${params.developer}`);
		return checkStatus(resp, params.developer);
	};

	// Get the app data first
	const devs = await mydevs();

	return { devs };
};
