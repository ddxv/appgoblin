import type { LayoutServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';

import { getCachedData } from '../../../hooks.server';

export const load: LayoutServerLoad = async ({ fetch, params, locals }) => {
	const api = createApiClient(fetch);

	const myapp = await api.get(`/apps/${params.id}`, 'App Details');
	const cachedData = await getCachedData();
	const { appCats, companyTypes } = cachedData;

	let isFollowingApp = false;
	if (locals.user) {
		const followed = await db.queryOne<{ id: number }>(
			`SELECT id
			 FROM public.user_followed_apps
			 WHERE user_id = $1 AND store_id = $2
			 LIMIT 1`,
			[locals.user.id, myapp.store_id]
		);
		isFollowingApp = !!followed;
	}

	return { myapp, companyTypes, appCats, isFollowingApp };
};
