import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response(null, {
		status: 302,
		headers: {
			Location: '/reports/mobile-apps-growth-sdks-q2-2026/AppGoblin Mobile Ecosystem 2026 Q2.csv'
		}
	});
};
