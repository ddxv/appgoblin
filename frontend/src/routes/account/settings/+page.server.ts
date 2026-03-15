import { fail, redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth/session';
import { loginUrl } from '$lib/server/auth/auth';
import type { Actions, RequestEvent } from './$types';

export const actions: Actions = {
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
