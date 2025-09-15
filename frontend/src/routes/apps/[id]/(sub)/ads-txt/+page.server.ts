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

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const id = params.id;
	// Load parent data first because it is cached
	const { appCats, companyTypes, myapp } = await parent();

	let myAdsTxt = async () => 'No AdsTxt Result';
	if (myapp.adstxt_crawl_result === 1) {
		myAdsTxt = async () => {
			const resp = await fetch(`http://localhost:8000/api/apps/${id}/adstxt`);
			return checkStatus(resp, 'App AdsTxt');
		};
	}

	return {
		myAdsTxt: myAdsTxt(),
		appCats: appCats,
		companyTypes: companyTypes
	};
};
