import { fail, redirect } from '@sveltejs/kit';
import { requireAuthOr401 } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import { createPortalSession } from '$lib/server/stripe';
import type { Actions, RequestEvent } from './$types';

export const actions: Actions = {
	portal: async (event: RequestEvent) => {
		const { user } = requireAuthOr401(event);

		const subscription = await db.queryOne<{ provider_name: string; status: string }>(
			`SELECT tp.provider_name, s.status
			 FROM subscriptions s
			 LEFT JOIN tier_prices tp ON tp.id = s.tier_price_id
			 WHERE s.user_id = $1
			 AND (
			   (s.cancel_at IS NOT NULL AND s.cancel_at > NOW())
			   OR (s.cancel_at IS NULL AND s.status IN ('active', 'trialing'))
			 )
			 ORDER BY s.updated_at DESC LIMIT 1`,
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
