import type { LayoutServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: LayoutServerLoad = async ({ fetch, params, parent }) => {
	const { myapp, companyTypes } = await parent();
	const api = createApiClient(fetch);

	const id = params.id;
	const versionTimeline = await api.get(`/apps/${id}/versions`, 'App Version Timeline');

	let myPackageInfo: Record<string, any> = {};
	if (myapp.sdk_successful_last_crawled) {
		myPackageInfo = await api.get(`/apps/${id}/sdks`, 'App Package Info');
	}

	return {
		myPackageInfo,
		versionTimeline,
		companyTypes,
		myapp
	};
};
