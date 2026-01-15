import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/reports/mobile-apps-growth-sdks-2025/AppGoblin App SDKs Growth 2025.csv'
		}
	});
};
