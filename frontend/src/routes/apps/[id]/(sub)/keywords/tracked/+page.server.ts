import type { PageServerLoad } from './$types';
import { db } from '$lib/server/auth/db';

export const load: PageServerLoad = async ({ params, parent, locals }) => {
	const id = params.id;
	const { myapp } = await parent();

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

	return {
		toFollow: 'noindex, nofollow',
		title: `My Keywords for ${myapp.name}`,
		description: `Your tracked keywords for ${myapp.name}.`,
		keywords: 'keywords, aso, tracked',
		myapp,
		userTrackedKeywordsForApp
	};
};
