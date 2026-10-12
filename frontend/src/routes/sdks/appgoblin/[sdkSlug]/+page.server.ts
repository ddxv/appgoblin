import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { requireAuthOr401 } from '$lib/server/auth/auth';
import { userHasTierAccess } from '$lib/server/subscription';

export const load: PageServerLoad = async (event) => {
    const { user } = requireAuthOr401(event);
    const detail = await createApiClient(event.fetch).get(`/sdks/appgoblin/${encodeURIComponent(event.params.sdkSlug)}`, 'SDK Details');
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
        const response = await createApiClient(event.fetch).post(
            `/sdks/id/${Number((await event.request.formData()).get('sdk_id'))}/export`,
            { recipient_email: user.email, user_id: user.id },
            'SDK Export'
        );
        return { success: true, exportMessage: `Report generation queued. A download link will be sent to ${user.email}.`, reportId: response.report_id };
    }
};
