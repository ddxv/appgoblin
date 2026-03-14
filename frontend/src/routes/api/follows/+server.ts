import { json } from '@sveltejs/kit';
import { db } from '$lib/server/auth/db';
import type { RequestHandler } from './$types';

type FollowEntity = 'app' | 'keyword' | 'company';

type FollowRequest = {
	entity: FollowEntity;
	follow: boolean;
	storeId?: string;
	keywordText?: string;
	companyId?: number;
};

function badRequest(error: string) {
	return json({ success: false, error }, { status: 400 });
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Authentication required' }, { status: 401 });
	}

	const body = (await request.json()) as FollowRequest;
	const { entity, follow } = body;

	if (!entity || typeof follow !== 'boolean') {
		return badRequest('entity and follow are required');
	}

	if (entity === 'app') {
		const storeId = body.storeId?.trim();
		if (!storeId) {
			return badRequest('storeId is required for app follows');
		}

		if (follow) {
			await db.execute(
				`INSERT INTO public.user_followed_apps (user_id, store_id)
				 VALUES ($1, $2)
				 ON CONFLICT (user_id, store_id) DO NOTHING`,
				[locals.user.id, storeId]
			);
		} else {
			await db.execute(
				'DELETE FROM public.user_followed_apps WHERE user_id = $1 AND store_id = $2',
				[locals.user.id, storeId]
			);
		}

		return json({ success: true, following: follow });
	}

	if (entity === 'keyword') {
		const storeId = body.storeId?.trim();
		const keywordText = body.keywordText?.trim();
		if (!storeId || !keywordText) {
			return badRequest('storeId and keywordText are required for keyword follows');
		}

		if (follow) {
			await db.execute(
				`INSERT INTO public.user_tracked_keywords (user_id, store_id, keyword_text)
				 VALUES ($1, $2, $3)
				 ON CONFLICT DO NOTHING`,
				[locals.user.id, storeId, keywordText]
			);
		} else {
			await db.execute(
				`DELETE FROM public.user_tracked_keywords
				 WHERE user_id = $1
				   AND store_id = $2
				   AND lower(btrim(keyword_text)) = lower(btrim($3))`,
				[locals.user.id, storeId, keywordText]
			);
		}

		return json({ success: true, following: follow });
	}

	if (entity === 'company') {
		const companyId = body.companyId;
		if (!Number.isInteger(companyId) || !companyId || companyId <= 0) {
			return badRequest('companyId must be a positive integer for company follows');
		}

		if (follow) {
			await db.execute(
				`INSERT INTO public.user_followed_companies (user_id, company_id)
				 VALUES ($1, $2)
				 ON CONFLICT (user_id, company_id) DO NOTHING`,
				[locals.user.id, companyId]
			);
		} else {
			await db.execute(
				'DELETE FROM public.user_followed_companies WHERE user_id = $1 AND company_id = $2',
				[locals.user.id, companyId]
			);
		}

		return json({ success: true, following: follow });
	}

	return badRequest('Unsupported follow entity');
};
