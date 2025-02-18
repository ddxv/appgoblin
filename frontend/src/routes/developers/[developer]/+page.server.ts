import type { PageServerLoad } from './$types.js';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ params, locals }) => {
	const developerValue = params.developer;
	const res = fetch(`http://localhost:8000/api/apps/developers/${developerValue}`);
	console.log(`load started developer=${developerValue}`);
	try {
		return {
			devs: res
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					} else if (resp.status === 404) {
						console.log('Developer Not found');
						return 'Developer Not Found';
					} else if (resp.status === 500) {
						console.log('API Server error');
						return 'Backend Error';
					}
				})
				.then(
					(json) => json,
					(error) => {
						console.log('Uncaught error', error);
						return 'Uncaught Error';
					}
				)
		};
	} catch (error) {
		console.error('Failed to load data:', error);
		return {
			devs: {},
			status: 500,
			error: 'Failed to load trending apps'
		};
	}
};
