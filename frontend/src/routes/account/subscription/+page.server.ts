import { fail, redirect } from '@sveltejs/kit';
import { requireFullAuth } from '$lib/server/auth/auth';
import { createPortalSession } from '$lib/server/stripe';
import type { Actions, RequestEvent } from './$types';

export const actions: Actions = {
	portal: async (event: RequestEvent) => {
		const { user } = requireFullAuth(event);
		let url;
		try {
			url = await createPortalSession(user.id);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'An error occurred' });
		}

		if (!url) {
			return fail(500, { message: 'Failed to create portal session' });
		}

		redirect(303, url);
	}
};
