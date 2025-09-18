import type { LayoutServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;
	const category = params.category;

	let url;

	if (category) {
		url = `/companies/${companyDomain}?category=${category}`;
	} else {
		url = `/companies/${companyDomain}`;
	}

	const companyDetails = await api.get(url, 'Company Details');

	const companyTree = await api.get(`/companies/${companyDomain}/tree`, 'Company Tree');

	return {
		companyDetails,
		companyTree
	};
};
