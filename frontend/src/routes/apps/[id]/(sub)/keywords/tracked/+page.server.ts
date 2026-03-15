import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { requireAuth } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';

export const load: PageServerLoad = async (event) => {
	const { fetch, params, parent } = event;
	const { user } = requireAuth(event);
	const api = createApiClient(fetch);
	const id = params.id;
	const { myapp } = await parent();

	const userTrackedKeywordsForApp = await db.query<{
		id: number;
		keyword_text: string;
		created_at: Date;
	}>(
		`SELECT id, keyword_text, created_at
		 FROM public.user_tracked_keywords
		 WHERE user_id = $1 AND store_id = $2
		 ORDER BY created_at DESC`,
		[user.id, id]
	);

	const keywordTexts = [...new Set(userTrackedKeywordsForApp.map((row) => row.keyword_text.trim()))]
		.filter(Boolean)
		.map((text) => text.toLowerCase());

	let myKeywords = 'No Keywords Result';
	if (myapp.description && myapp.description.length > 100) {
		const keywordTextsQuery = keywordTexts
			.map((keywordText) => `keyword_text=${encodeURIComponent(keywordText)}`)
			.join('&');
		const keywordsPath = keywordTextsQuery
			? `/apps/${id}/keywords?${keywordTextsQuery}`
			: `/apps/${id}/keywords`;
		myKeywords = await api.get(keywordsPath, 'App Keywords');
	}

	return {
		toFollow: 'noindex, nofollow',
		title: `My Keywords for ${myapp.name}`,
		description: `Your tracked keywords for ${myapp.name}.`,
		keywords: 'keywords, aso, tracked',
		myKeywords,
		myapp,
		userTrackedKeywordsForApp
	};
};
