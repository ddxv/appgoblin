import { fail, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { loginUrl, requireAuthOr401 } from '$lib/server/auth/auth';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth/session';
import type { PageServerLoadEvent } from './$types';

export async function load(event: PageServerLoadEvent) {
	requireAuthOr401(event);
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
