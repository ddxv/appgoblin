import { fail, redirect } from '@sveltejs/kit';
import { requireFullAuth } from '#lib/server/auth/auth.js';
import { db } from '#lib/server/auth/db.js';
import { getUserOrganization, isOrganizationOwner } from '#lib/server/organization.js';
import { createPortalSession, updateSubscriptionSeats } from '#lib/server/stripe.js';
import type { Actions, RequestEvent } from './$types';

async function requireSubscriptionUser(event: RequestEvent) {
	const { user } = requireFullAuth(event);
	const organization = await getUserOrganization(user.id);
	return { user, organization };
}

export async function load(event: RequestEvent) {
	await requireSubscriptionUser(event);
}

export const actions: Actions = {
	seats: async (event: RequestEvent) => {
		const { user, organization } = await requireSubscriptionUser(event);
		if (!organization || !(await isOrganizationOwner(user.id, organization.organizationId))) {
			return fail(403, { message: 'Only the organization owner can manage seats.' });
		}
		const formData = await event.request.formData();
		const totalSeats = Number(formData.get('totalSeats'));
		try {
			await updateSubscriptionSeats(user.id, totalSeats);
			return { seatsUpdated: true };
		} catch (error) {
			console.error(error);
			return fail(400, { message: 'Unable to update seats.' });
		}
	},
	portal: async (event: RequestEvent) => {
		const { user, organization } = await requireSubscriptionUser(event);
		if (!organization || !(await isOrganizationOwner(user.id, organization.organizationId))) {
			return fail(403, { message: 'Only the organization owner can manage the subscription.' });
		}

		const subscription = await db.queryOne<{ provider_name: string; status: string }>(
			`SELECT tp.provider_name, s.status
			 FROM subscriptions s
			 LEFT JOIN tier_prices tp ON tp.id = s.tier_price_id
				 JOIN organization_members om ON om.organization_id = s.organization_id
				 WHERE om.user_id = $1
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
