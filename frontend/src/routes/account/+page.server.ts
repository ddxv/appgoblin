import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { loginUrl, requireFullAuth } from '$lib/server/auth/auth';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth/session';
import type { PageServerLoadEvent } from './$types';

export async function load(event: PageServerLoadEvent) {
	// Require auth at index too, but data is already passed implicitly from +layout.server.ts
	requireFullAuth(event);
	return {};
}

export const actions = {
	logout: async (event: RequestEvent) => {
		if (event.locals.session === null) {
			return fail(401, {
				message: 'Not authenticated'
			});
		}

		invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, loginUrl('/account'));
	}
};
