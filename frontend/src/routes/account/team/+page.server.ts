import { fail } from '@sveltejs/kit';
import { requireFullAuth } from '$lib/server/auth/auth';
import {
	createOrganizationInvitation,
	getActiveOrganizationInvitations,
	getOrganizationMembers,
	getOrganizationSeatSummary,
	getUserOrganization,
	isOrganizationOwner,
	revokeOrganizationInvitation,
	updateOrganizationName
} from '$lib/server/organization';
import { sendOrganizationInvitationEmail } from '$lib/server/contact';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { user } = requireFullAuth(event);
	const organization = await getUserOrganization(user.id);
	if (!organization) return { organization: null, members: [], seats: null, invitations: [] };

	const [members, seats, invitations] = await Promise.all([
		getOrganizationMembers(organization.organizationId),
		getOrganizationSeatSummary(organization.organizationId),
		getActiveOrganizationInvitations(organization.organizationId)
	]);
	return { organization, members, seats, invitations };
};

export const actions: Actions = {
	rename: async (event) => {
		const { user } = requireFullAuth(event);
		const organization = await getUserOrganization(user.id);
		if (!organization || !(await isOrganizationOwner(user.id, organization.organizationId))) {
			return fail(403, { message: 'Only the organization owner can rename it.' });
		}

		const formData = await event.request.formData();
		const name = formData.get('name');
		if (typeof name !== 'string') return fail(400, { message: 'Enter an organization name.' });

		try {
			await updateOrganizationName(organization.organizationId, user.id, name);
			return { renameSuccess: true };
		} catch (error) {
			return fail(400, {
				message: error instanceof Error ? error.message : 'Unable to update organization name.'
			});
		}
	},
	invite: async (event) => {
		const { user } = requireFullAuth(event);
		const organization = await getUserOrganization(user.id);
		if (!organization || !(await isOrganizationOwner(user.id, organization.organizationId))) {
			return fail(403, { message: 'Only the organization owner can invite members.' });
		}

		const formData = await event.request.formData();
		const email = formData.get('email');
		if (typeof email !== 'string' || !email.includes('@')) {
			return fail(400, { message: 'Enter a valid email address.' });
		}

		try {
			const invitation = await createOrganizationInvitation(
				organization.organizationId,
				user.id,
				email
			);
			await sendOrganizationInvitationEmail(
				email.trim().toLowerCase(),
				organization.organizationName,
				invitation.token
			);
			console.info('Organization invitation created', {
				organizationId: organization.organizationId,
				email,
				expiresAt: invitation.expiresAt
			});
			return { success: true };
		} catch (error) {
			console.error('Failed to create organization invitation', error);
			return fail(400, {
				message: error instanceof Error ? error.message : 'Unable to create invitation.'
			});
		}
	},
	revokeInvitation: async (event) => {
		const { user } = requireFullAuth(event);
		const organization = await getUserOrganization(user.id);
		if (!organization || !(await isOrganizationOwner(user.id, organization.organizationId))) {
			return fail(403, { message: 'Only the organization owner can remove invitations.' });
		}

		const formData = await event.request.formData();
		const invitationId = Number(formData.get('invitationId'));
		if (!Number.isInteger(invitationId) || invitationId < 1) {
			return fail(400, { message: 'Invalid invitation.' });
		}

		try {
			await revokeOrganizationInvitation(organization.organizationId, user.id, invitationId);
			return { revokeSuccess: true };
		} catch (error) {
			return fail(400, {
				message: error instanceof Error ? error.message : 'Unable to remove invitation.'
			});
		}
	}
};
