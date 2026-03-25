import type { PageServerLoad } from './$types';

import { createApiClient } from '$lib/server/api';

export const ssr = true;
export const csr = true;

export const load: PageServerLoad = async ({ fetch, url }) => {
	const category = url.searchParams.get('category') || null;
	const format = url.searchParams.get('format') || null;
	const company = url.searchParams.get('company') || null;
	const api = createApiClient(fetch);

	let apiUrl = '/creatives/clusters';

	const params = new URLSearchParams();
	if (category) {
		params.set('app_category', category);
	}
	if (format && format !== 'all') {
		params.set('format', format);
	}
	if (company) {
		params.set('company', company);
	}

	const queryString = params.toString();
	if (queryString) {
		apiUrl += `?${queryString}`;
	}

	const creativeClusters = await api.get(apiUrl, 'Creative Clusters');

	return {
		creativeClusters,
		selectedCategory: category,
		selectedFormat: format,
		searchCompany: company
	};
};
