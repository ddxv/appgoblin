import type { PageServerLoad } from './$types.js';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ parent }) => {
	const { appsOverview } = await parent();
	const resUserRequested = fetch(`http://localhost:8000/api/sdks/user_requested`);
	const resLatest = fetch(`http://localhost:8000/api/sdks/latest`);
	const resParts = fetch(`http://localhost:8000/api/sdks/sdkparts`);
	console.log('start load overview for sdks');
	try {
		return {
			appsOverview,
			sdksUserRequested: resUserRequested
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					} else if (resp.status === 406) {
						console.log('Sdks overview not found');
						return 'Sdks overview not Found';
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
				),
			sdksOverview: resLatest
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					} else if (resp.status === 406) {
						console.log('Sdks latest results not found');
						return 'Sdks latest results not Found';
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
				),

			sdksParts: resParts
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
