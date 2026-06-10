import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoadEvent } from './$types';
import { createCheckoutSession, type StripePriceKey } from '$lib/server/stripe';
import { requireFullAuth, loginUrl, isSafeRedirect } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';

const allowedKeys: StripePriceKey[] = ['b2b_sdk', 'b2b_appads', 'b2b_premium'];

export async function load(event: PageServerLoadEvent) {
	// Check if user arrived here with a subscribe intent (after auth chain)
	const subscribe = event.url.searchParams.get('subscribe');
	if (
		subscribe &&
		allowedKeys.includes(subscribe as StripePriceKey) &&
		event.locals.user &&
		event.locals.user.emailVerified
	) {
		// User is fully authenticated — create checkout URL and redirect directly
		const existingSubscription = await db.queryOne<{
			status: string;
			provider_name: string;
			cancel_at: Date | null;
			cancel_requested_at: Date | null;
		}>(
			`SELECT status, provider_name, cancel_at, cancel_requested_at
             FROM subscriptions
             WHERE user_id = $1
             AND status IN ('active', 'trialing')
			 ORDER BY updated_at DESC
             LIMIT 1`,
			[event.locals.user.id]
		);

		if (
			existingSubscription &&
			existingSubscription.provider_name === 'stripe' &&
			!existingSubscription.cancel_at &&
			!existingSubscription.cancel_requested_at
		) {
			return redirect(303, '/account');
		}

		let url;
		try {
			url = await createCheckoutSession(
				event.locals.user.id,
				event.locals.user.email,
				subscribe as StripePriceKey
			);
		} catch (e) {
			console.error(e);
		}
		if (url) {
			return redirect(303, url);
		}
	}

	return {
		user: event.locals.user
	};
}

export const actions: Actions = {
	subscribe: async (event) => {
		// Check auth early so we can encode the priceKey in the redirect
		if (event.locals.session === null || event.locals.user === null) {
			const formData = await event.request.formData();
			const priceKey = formData.get('priceKey');
			if (typeof priceKey === 'string' && allowedKeys.includes(priceKey as StripePriceKey)) {
				return redirect(302, loginUrl(`/pricing?subscribe=${encodeURIComponent(priceKey)}`));
			}
			return redirect(302, loginUrl('/pricing'));
		}
		if (!event.locals.user.emailVerified) {
			const formData = await event.request.formData();
			const priceKey = formData.get('priceKey');
			if (typeof priceKey === 'string' && allowedKeys.includes(priceKey as StripePriceKey)) {
				return redirect(
					302,
					`/auth/verify-email?redirectTo=${encodeURIComponent('/pricing?subscribe=' + encodeURIComponent(priceKey))}`
				);
			}
			return redirect(302, '/auth/verify-email');
		}

		const { user } = requireFullAuth(event);

		const formData = await event.request.formData();
		const priceKey = formData.get('priceKey');

		if (typeof priceKey !== 'string') {
			return fail(400, { message: 'Missing price selection' });
		}

		if (!allowedKeys.includes(priceKey as StripePriceKey)) {
			return fail(400, { message: 'Invalid price selection' });
		}

		const normalizedKey = priceKey as StripePriceKey;

		// Check for existing active subscription (allow checkout if previously canceled)
		const existingSubscription = await db.queryOne<{
			status: string;
			provider_name: string;
			cancel_at: Date | null;
			cancel_requested_at: Date | null;
		}>(
			`SELECT status, provider_name, cancel_at, cancel_requested_at
             FROM subscriptions
             WHERE user_id = $1
             AND status IN ('active', 'trialing')
			 ORDER BY updated_at DESC
             LIMIT 1`,
			[user.id]
		);

		if (
			existingSubscription &&
			existingSubscription.provider_name === 'stripe' &&
			!existingSubscription.cancel_at &&
			!existingSubscription.cancel_requested_at
		) {
			return redirect(303, '/account');
		}

		let url;
		try {
			url = await createCheckoutSession(user.id, user.email, normalizedKey);
		} catch (e) {
			console.error(e);
			return fail(500, { message: 'An error occurred' });
		}

		if (!url) {
			return fail(500, { message: 'Failed to create checkout session' });
		}

		redirect(303, url);
	}
};
