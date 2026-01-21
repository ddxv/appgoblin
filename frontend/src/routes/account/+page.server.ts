import { fail, redirect } from '@sveltejs/kit';
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server/auth/session';
import { requireFullAuth } from '$lib/server/auth/auth';

import type { Actions, PageServerLoadEvent, RequestEvent } from './$types';

export function load(event: PageServerLoadEvent) {
	// This route requires full authentication (opt-in protection)
	const { user } = requireFullAuth(event);
	return {
		user
	};
}

export const actions: Actions = {
	default: action
};

async function action(event: RequestEvent) {
	if (event.locals.session === null) {
		return fail(401, {
			message: 'Not authenticated'
		});
	}
	invalidateSession(event.locals.session.id);
	deleteSessionTokenCookie(event);
	return redirect(302, '/auth/login');
}
