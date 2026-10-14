import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { userHasTierAccess } from '$lib/server/subscription';
import { requireAuthOr401 } from '$lib/server/auth/auth';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, params, parent, locals }) => {
	const api = createApiClient(fetch);
	const companyDomain = params.domain;

	const companySdks = await api.get(`/companies/${companyDomain}/sdks`, 'Company SDKs');

	// waiting for parent layout data
	const { companyDetails, companyTree } = await parent();
	const hasB2BSdkAccess = locals.user
		? await userHasTierAccess(locals.user.id, 'b2b_sdk', 'b2b_premium')
		: false;

	return {
		companyDetails,
		companyTree,
		companySdks,
		hasB2BSdkAccess
	};
};

export const actions = {
	emailExport: async (event) => {
		const { user } = requireAuthOr401(event);
		const formData = await event.request.formData();
		const sdkId = Number(formData.get('sdk_id'));
		const sdkSlug = formData.get('sdk_slug')?.toString().trim();
		if (!Number.isInteger(sdkId) || sdkId <= 0) return fail(400, { error: 'Invalid SDK.' });
		if (!(await userHasTierAccess(user.id, 'b2b_sdk', 'b2b_premium')))
			return fail(403, { error: 'B2B SDK Intelligence access is required.' });
		try {
			await createApiClient(event.fetch).post(
				`/sdks/id/${sdkId}/export`,
				{ recipient_email: user.email, user_id: user.id, sdk_slug: sdkSlug },
				'SDK Export'
			);
			return {
				success: true,
				exportMessage: `Report generation queued. A download link will be sent to ${user.email}.`
			};
		} catch {
			return fail(500, { error: 'Failed to queue CSV export.' });
		}
	}
};
