import type { PageServerLoad } from './$types.js';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ params }) => {
	const category = params.category;
	const store = params.store;
	let storeId = 1;
	if (store === 'google') {
		storeId = 1;
	} else if (store === 'apple') {
		storeId = 2;
	}

	const resParts = fetch(
		`http://localhost:8000/api/apps/growth/${storeId}?app_category=${category}`
	);
	console.log('start load overview for fastest growing apps');
	try {
		return {
			growthApps: resParts
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					} else if (resp.status === 406) {
						console.log('Sdks sdkparts not found');
						return 'Sdks sdkparts not Found';
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
			results: {},
			status: 500,
			error: 'Failed to load sdks'
		};
	}
};
