import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';

export const load: PageServerLoad = async ({ fetch, params, parent, locals }) => {
	const api = createApiClient(fetch);
	const id = params.id;
	// Load parent data first because it is cached
	const { myapp } = await parent();

	// Conditionally create myKeywords based on description length
	let myKeywords = 'No Keywords Result';
	if (myapp.description && myapp.description.length > 100) {
		myKeywords = await api.get(`/apps/${id}/keywords`, 'App Keywords');
	}

	let userTrackedKeywordsForApp: { id: number; keyword_text: string; created_at: Date }[] = [];
	if (locals.user) {
		userTrackedKeywordsForApp = await db.query<{
			id: number;
			keyword_text: string;
			created_at: Date;
		}>(
			`SELECT id, keyword_text, created_at
			 FROM public.user_tracked_keywords
			 WHERE user_id = $1 AND store_id = $2
			 ORDER BY created_at DESC`,
			[locals.user.id, id]
		);
	}

	let keywordHistory: any[] = [];
	if (
		userTrackedKeywordsForApp.length > 0 &&
		myKeywords &&
		typeof myKeywords === 'object' &&
		'keyword_scores' in myKeywords
	) {
		const scores = (myKeywords as any).keyword_scores as any[];
		const trackedTexts = userTrackedKeywordsForApp.map((k) => k.keyword_text.toLowerCase());
		const keywordIds = scores
			.filter((s) => trackedTexts.includes(s.keyword_text.toLowerCase()))
			.map((s) => s.keyword_id)
			.filter((id) => typeof id === 'number' && Number.isInteger(id))
			.slice(0, 5);

		if (keywordIds.length > 0) {
			const queryParams = keywordIds.map((id) => `myid=${id}`).join('&');
			// myapp.id is the internal numeric ID for the app, needed by the new endpoint
			keywordHistory = await api.get(`/keywords/app/${myapp.id}?${queryParams}`, 'Keyword History');
		}
	}

	return {
		// Meta Tags
		toFollow: 'noindex, nofollow',
		title: `Keywords for ${myapp.name}`,
		description: `Keywords used for ${myapp.name}. Browse the keyword rankings for ${myapp.name}.`,
		keywords: `keywords, aso`,
		// Data
		myKeywords,
		myapp,
		userTrackedKeywordsForApp,
		keywordHistory
	};
};
