import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';

export const load: PageServerLoad = async ({ fetch, params, parent }) => {
    const { myapp } = await parent();
    const api = createApiClient(fetch);

    const id = params.id;
    let sdkHistory: Record<string, any> = { history: [] };
    if (myapp.sdk_successful_last_crawled) {
        sdkHistory = await api.get(`/apps/${id}/sdks/history`, 'App SDK History');
    }

    return {
        sdkHistory,
        myapp,
        // Meta Tags
        toFollow: 'noindex, nofollow',
        title: `SDK Change History for ${myapp.name}`,
        description: `Historical view of SDK additions and removals across versions of ${myapp.name}.`,
        keywords: `SDKs, history, changes, versions, trackers`
    };
};
