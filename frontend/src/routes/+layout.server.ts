import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
	// Rerun this load function on every navigation to keep user data fresh
	depends('app:user');

	return {
		user: locals.user ?? null
	};
};
