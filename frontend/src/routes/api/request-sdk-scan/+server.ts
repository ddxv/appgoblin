import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const { appId } = await request.json();

	if (!appId) {
		return json({ success: false, error: 'appId is required' }, { status: 400 });
	}

	const userId = locals.user?.id ?? null;

	console.log('requestSDKScan', appId, 'userId', userId);

	const response = await fetch(`http://localhost:8000/api/apps/${appId}/requestSDKScan`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ user_id: userId })
	});

	if (response.status === 200) {
		return json({ success: true });
	} else {
		return json({ success: false }, { status: response.status });
	}
};
