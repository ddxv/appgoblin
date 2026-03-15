import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';

import { getCachedData } from '../../../hooks.server';

export const load: LayoutServerLoad = async ({ fetch, params, parent, locals }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;
	const category = params.category;

	const { appCats } = await getCachedData();

	if (category && !appCats.categories.find((cat) => cat.id === category)) {
		error(404, {
			message: `Category "${category}" not found`
		});
	}

	let url;

	if (category) {
		url = `/companies/${companyDomain}?category=${category}`;
	} else {
		url = `/companies/${companyDomain}`;
	}

	const companyDetails = await api.get(url, 'Company Details');

	const companyTree = await api.get(`/companies/${companyDomain}/tree`, 'Company Tree');

	let companyLookup: { company_id: number; company_name: string; company_domain: string } | null =
		null;
	try {
		companyLookup = await api.get(`/companies/${companyDomain}/lookup`, 'Company Lookup');
	} catch {
		companyLookup = null;
	}

	let isFollowingCompany = false;
	if (locals.user && companyLookup?.company_id) {
		const followed = await db.queryOne<{ id: number }>(
			`SELECT id
			 FROM public.user_followed_companies
			 WHERE user_id = $1 AND company_id = $2
			 LIMIT 1`,
			[locals.user.id, companyLookup.company_id]
		);
		isFollowingCompany = !!followed;
	}

	return {
		companyDetails,
		companyTree,
		companyLookup,
		isFollowingCompany
	};
};
