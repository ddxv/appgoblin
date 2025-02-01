import type { PageServerLoad } from './$types';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ params }) => {
	const companyDomain = params.domain;
	const publisher_id = params.publisher_id;

	const publishers_apps = fetch(
		`http://localhost:8000/api/companies/${companyDomain}/adstxt/publisher/${publisher_id}`
	);

	console.log(`start load overview for company=${companyDomain}`);
	try {
		return {
			publishersApps: publishers_apps
				.then((resp) => {
					if (resp.status === 200) {
						return resp.json();
					} else if (resp.status === 404) {
						console.log('Company Parent Categories Not found');
						return 'Company Parent Categories Not Found';
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
			error: 'Failed to load company data'
		};
	}
};
