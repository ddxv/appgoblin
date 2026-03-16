import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const term = url.searchParams.get('term')?.trim();
	if (!term) {
		throw redirect(303, '/');
	}

	throw redirect(303, `/search/${encodeURIComponent(term)}`);
};
