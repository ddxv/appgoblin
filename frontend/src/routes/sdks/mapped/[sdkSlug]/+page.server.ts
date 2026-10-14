import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { requireAuthOr401 } from '$lib/server/auth/auth';
import { userHasTierAccess } from '$lib/server/subscription';

export const load: PageServerLoad = async (event) => {
	const { user } = requireAuthOr401(event);
	const detail = await createApiClient(event.fetch).get(
		`/sdks/appgoblin/${encodeURIComponent(event.params.sdkSlug)}`,
		'SDK Details'
	);
	return {
		...detail,
		hasB2BSdkAccess: await userHasTierAccess(user.id, 'b2b_sdk', 'b2b_premium')
	};
};

export const actions = {
	emailExport: async (event) => {
		const { user } = requireAuthOr401(event);
		const hasAccess = await userHasTierAccess(user.id, 'b2b_sdk', 'b2b_premium');
		if (!hasAccess) return { success: false, error: 'B2B SDK Intelligence access is required.' };
		const formData = await event.request.formData();
		const latestOnly = formData.get('latest_only') === 'true';
		const response = await createApiClient(event.fetch).post(
			`/sdks/id/${Number(formData.get('sdk_id'))}/export`,
			{
				recipient_email: user.email,
				user_id: user.id,
				sdk_slug: event.params.sdkSlug,
				latest_only: latestOnly
			},
			'SDK Export'
		);
		return {
			success: true,
			exportMessage:
				'Report queued, when finished a download link will be emailed and available in your Account Reports tab.',
			reportId: response.report_id
		};
	}
};
