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

export const load: PageServerLoad = async ({ params}) => {
	const keyword = params.keyword;
	

	const keywordDetails = async () => {
		const resp = await fetch(`http://localhost:8000/api/keywords/${keyword}`);
		return checkStatus(resp, 'Keyword Details');
	};

	return {
		keywordDetails: keywordDetails()
	};
};
