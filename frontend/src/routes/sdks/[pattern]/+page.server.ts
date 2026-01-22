import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { requireFullAuth } from '$lib/server/auth/auth';

export const ssr: boolean = true;
export const csr: boolean = true;

export const load: PageServerLoad = async (event) => {
	const { params, fetch } = event;
	const value_pattern = params.pattern;
	const api = createApiClient(fetch);
	requireFullAuth(event);

	const matchedApps = api.get(`/sdks/${value_pattern}`, 'Sdks Pattern');
	const matchedCompanies = api.get(`/sdks/${value_pattern}/companies`, 'Sdks Pattern Companies');

	return {
		matchedCompanies,
		matchedApps
	};
};
