import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async ({ fetch, params }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;
	const publisher_id = params.publisher_id;

	const publishersApps = api.get(
		`/companies/${companyDomain}/adstxt/publisher/${publisher_id}`,
		'Company Publisher Apps'
	);
	return {
		publishersApps
	};
};
