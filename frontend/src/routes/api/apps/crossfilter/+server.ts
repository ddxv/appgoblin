import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		// Validate required fields
		if (
			!body.include_domains ||
			!Array.isArray(body.include_domains) ||
			body.include_domains.length === 0
		) {
			return json({ error: 'At least one company must be selected to include' }, { status: 400 });
		}

		const response = await fetch('http://localhost:8000/api/apps/crossfilter', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				include_domains: body.include_domains,
				exclude_domains: body.exclude_domains || [],
				require_sdk_api: Boolean(body.require_sdk_api),
				require_iap: Boolean(body.require_iap),
				require_ads: Boolean(body.require_ads),
				mydate: body.mydate || '2024-01-01'
			})
		});

		if (!response.ok) {
			console.error('Backend crossfilter error:', response.status, response.statusText);
			return json({ error: 'Failed to fetch apps from backend' }, { status: response.status });
		}

		const data = await response.json();
		return json(data);
	} catch (error) {
		console.error('Crossfilter API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
