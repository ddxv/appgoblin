import { fail, redirect } from '@sveltejs/kit';
import { requireFullAuth } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import { createPortalSession } from '$lib/server/stripe';
import type { Actions, RequestEvent } from './$types';

export const actions: Actions = {
	portal: async (event: RequestEvent) => {
		const { user } = requireFullAuth(event);

		const subscription = await db.queryOne<{ provider_name: string; status: string }>(
			`SELECT provider_name, status
			 FROM subscriptions
			 WHERE user_id = $1
			 AND (
			 	(cancel_at IS NOT NULL AND cancel_at > NOW())
			 	OR (cancel_at IS NULL AND status IN ('active', 'trialing'))
			 )
			 ORDER BY updated_at DESC LIMIT 1`,
			[user.id]
		);

		if (subscription?.provider_name !== 'stripe') {
			redirect(303, '/pricing');
		}

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
