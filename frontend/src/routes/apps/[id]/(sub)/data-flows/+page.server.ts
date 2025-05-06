import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, parent }) => {
	const id = params.id;
	// Load parent data first because it is cached
	const { companyTypes } = await parent();

	console.log('id', id);

	const apisResp = await fetch(`http://localhost:8000/api/apps/${id}/apis`);
	const apis = await apisResp.json();

	return {
		apis: apis
	};
};
