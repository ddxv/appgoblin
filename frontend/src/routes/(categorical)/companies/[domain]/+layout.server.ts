import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const companyDomain = params.domain;
	const category = params.category;

	let res;

	if (category) {
		res = fetch(`http://localhost:8000/api/companies/${companyDomain}?category=${category}`);
	} else {
		res = fetch(`http://localhost:8000/api/companies/${companyDomain}`);
	}

	const res_tree = await fetch(`http://localhost:8000/api/companies/${companyDomain}/tree`);
	const res_domains = fetch(`http://localhost:8000/api/companies/${companyDomain}/domains`);

	return {
		companyDetails: res
			.then((resp) => {
				if (resp.status === 200) {
					return resp.json();
				} else if (resp.status === 404) {
					console.log('Company Not found');
					return 'Company Not Found';
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
		companyTree: await res_tree.json(),
		companyDomains: res_domains
			.then((resp) => {
				if (resp.status === 200) {
					return resp.json();
				} else if (resp.status === 404) {
					console.log('Company Tree Not found');
					return 'Company Tree Not Found';
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
};
