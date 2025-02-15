import type { RequestHandler } from '@sveltejs/kit';
import loadConfig from '$lib/loadConfig.js';

export const GET: RequestHandler = async ({ params }) => {
	const domain = params.domain || '';
	const adstxtEndpoint = loadConfig();

	return new Response(null, {
		status: 302,
		headers: {
			Location: `${adstxtEndpoint}${domain}/latest.csv`
		}
	});
};
