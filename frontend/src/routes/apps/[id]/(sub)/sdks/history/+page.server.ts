import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { requireAuthOr401 } from '$lib/server/auth/auth';
import { userHasTierAccess } from '$lib/server/subscription';

export const load: PageServerLoad = async (event) => {
	const { fetch, params, parent, locals } = event;
	requireAuthOr401(event);
	const parentData = await parent();
	const { myapp, versionTimeline } = parentData;
	const api = createApiClient(fetch);

	let hasB2BSdkAccess = false;
	if (locals.user) {
		hasB2BSdkAccess = await userHasTierAccess(locals.user.id, 'b2b_sdk', 'b2b_premium');
	}

	const id = params.id;
	let sdkHistory: Record<string, any> = { history: [] };
	if (myapp.sdk_successful_last_crawled) {
		sdkHistory = await api.get(`/apps/${id}/sdks/history`, 'App SDK History');
	}

	return {
		sdkHistory,
		myapp,
		hasB2BSdkAccess,
		versionTimeline,
		// Meta Tags
		toFollow: 'noindex, nofollow',
		title: `SDK Change History for ${myapp.name}`,
		description: `Historical view of SDK additions and removals across versions of ${myapp.name}.`,
		keywords: `SDKs, history, changes, versions, trackers`
	};
};
