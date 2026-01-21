import type { PageServerLoad } from './$types.js';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
	const { companyTypes } = await parent();
	const { myapp } = await parent();
	const api = createApiClient(fetch);

	const id = params.id;
	const versionTimeline = await api.get(`/apps/${id}/versions`, 'App Version Timeline');

	let myPackageInfo = {};
	if (myapp.sdk_successful_last_crawled) {
		myPackageInfo = await api.get(`/apps/${id}/sdks`, 'App Package Info');
	}

	return {
		myPackageInfo,
		versionTimeline,
		companyTypes,
		myapp,
		// Meta Tags
		toFollow: 'index, follow',
		title: `SDKs and Trackers in ${myapp.name}`,
		description: `Explore the SDKs, trackers and permissions in ${myapp.name}. See which SDKs, trackers and permissions are used in ${myapp.name}.`,
		keywords: `SDKs, competitor analysis, trackers, permissions, ad networks, ad publishers, ad networks, ad publishers`
	};
};
