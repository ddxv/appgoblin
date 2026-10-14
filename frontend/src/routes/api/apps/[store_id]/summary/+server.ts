import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const response = await fetch(
		`http://localhost:8000/api/apps/${encodeURIComponent(params.store_id)}/summary`
	);

	if (!response.ok) {
		return json(
			{ error: response.status === 404 ? 'App not found' : 'Unable to load app' },
			{
				status: response.status
			}
		);
	}

	return json(await response.json());
};
