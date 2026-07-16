import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { getAppCategories } from '$lib/server/appCategories';
import { requireAuthOr401 } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import { userHasTierAccess } from '$lib/server/subscription';
import { getCachedData } from '../../hooks.server';


interface CrossfilterPayload {
	include_domains: string[];
	exclude_domains: string[];
	require_sdk_api: boolean;
	require_iap: boolean;
	require_ads: boolean;
	ranking_country: string | null;
	mydate: string | null;
	category: string | null;
	store: number | null;
	min_installs: number | null;
	max_installs: number | null;
	min_rating_count: number | null;
	max_rating_count: number | null;
	min_installs_d30: number | null;
	max_installs_d30: number | null;
}

function parseJsonArrayField(value: FormDataEntryValue | null): string[] {
	if (value == null) return [];

	try {
		const parsed = JSON.parse(value.toString());
		return Array.isArray(parsed)
			? parsed.filter((entry): entry is string => typeof entry === 'string')
			: [];
	} catch {
		return [];
	}
}

function parseOptionalNumberField(value: FormDataEntryValue | null): number | null {
	if (value == null) return null;
	const stringValue = value.toString().trim();
	if (stringValue === '') return null;

	const parsed = Number.parseInt(stringValue, 10);
	return Number.isNaN(parsed) ? null : parsed;
}

function buildCrossfilterPayload(data: FormData, hasB2BSdkAccess: boolean): CrossfilterPayload {
	const parsedIncludeDomains = parseJsonArrayField(data.get('include_domains'));
	const parsedExcludeDomains = parseJsonArrayField(data.get('exclude_domains'));

	return {
		include_domains: hasB2BSdkAccess ? parsedIncludeDomains : [],
		exclude_domains: hasB2BSdkAccess ? parsedExcludeDomains : [],
		require_sdk_api: data.get('require_sdk_api') === 'true',
		require_iap: data.get('require_iap') === 'true',
		require_ads: data.get('require_ads') === 'true',
		ranking_country: data.get('ranking_country')?.toString() || null,
		mydate: data.get('mydate')?.toString() || null,
		category: data.get('category')?.toString() || null,
		store: parseOptionalNumberField(data.get('store')),
		min_installs: parseOptionalNumberField(data.get('min_installs')),
		max_installs: parseOptionalNumberField(data.get('max_installs')),
		min_rating_count: parseOptionalNumberField(data.get('min_rating_count')),
		max_rating_count: parseOptionalNumberField(data.get('max_rating_count')),
		min_installs_d30: parseOptionalNumberField(data.get('min_installs_d30')),
		max_installs_d30: parseOptionalNumberField(data.get('max_installs_d30'))
	};
}

function hasExportFilters(payload: CrossfilterPayload): boolean {
	return (
		payload.include_domains.length > 0 ||
		payload.exclude_domains.length > 0 ||
		payload.require_sdk_api ||
		payload.require_iap ||
		payload.require_ads ||
		payload.ranking_country != null ||
		payload.category != null ||
		payload.store != null ||
		payload.min_installs != null ||
		payload.max_installs != null ||
		payload.min_rating_count != null ||
		payload.max_rating_count != null ||
		payload.min_installs_d30 != null ||
		payload.max_installs_d30 != null
	);
}

async function getSubscriptionAccess(userId: number) {
	const row = await db.queryOne<{ id: number }>(
		`SELECT id FROM subscriptions
		 WHERE user_id = $1
		 AND status IN ('active', 'trialing')
		 AND (cancel_at IS NULL OR cancel_at > NOW())
		 LIMIT 1`,
		[userId]
	);
	const hasPaidAccess = !!row;
	const hasB2BSdkAccess = await userHasTierAccess(userId, 'b2b_sdk', 'b2b_premium');
	return { hasPaidAccess, hasB2BSdkAccess };
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const user = locals.user;
	let hasPaidAccess = false;
	let hasB2BSdkAccess = false;

	if (user) {
		const access = await getSubscriptionAccess(user.id);
		hasPaidAccess = access.hasPaidAccess;
		hasB2BSdkAccess = access.hasB2BSdkAccess;
	}

	// Load categories
	const { countries } = await getCachedData();
	const appCats = await getAppCategories();
	const categories = appCats || [];

	return {
		categories,
		countries,
		hasPaidAccess,
		hasB2BSdkAccess
	};
};

export const actions = {
	search: async ({ request, fetch, locals }) => {
		const data = await request.formData();
		const api = createApiClient(fetch);

		let hasB2BSdkAccess = false;
		if (locals.user) {
			const access = await getSubscriptionAccess(locals.user.id);
			hasB2BSdkAccess = access.hasB2BSdkAccess;
		}

		const payload = buildCrossfilterPayload(data, hasB2BSdkAccess);

		try {
			const response = await api.post('/apps/crossfilter', payload, 'Crossfilter Search');
			return { success: true, apps: response.apps };
		} catch (error) {
			console.error('Search Action Error:', error);
			return { success: false, error: 'Failed to fetch apps', apps: [] };
		}
	},
	emailCsv: async (event) => {
		const { user } = requireAuthOr401(event);
		const { request, fetch } = event;
		const data = await request.formData();
		const api = createApiClient(fetch);
		const access = await getSubscriptionAccess(user.id);

		if (!access.hasPaidAccess) {
			return {
				success: false,
				error: 'A paid subscription is required to email CSV exports.',
				apps: []
			};
		}

		const payload = buildCrossfilterPayload(data, access.hasB2BSdkAccess);

		if (!hasExportFilters(payload)) {
			return {
				success: false,
				error: 'Set at least one filter before exporting a CSV.',
				apps: []
			};
		}

		try {
			const exportResponse = await api.post(
				'/apps/crossfilter/export',
				{ ...payload, recipient_email: user.email },
				'Crossfilter Export'
			);

			return {
				success: true,
				exportQueued: true,
				exportMessage: `CSV export queued. A download link will be sent to ${user.email} within the next 15 minutes.`,
				reportId: exportResponse.report_id
			};
		} catch (error) {
			console.error('Email CSV Action Error:', error);
			return {
				success: false,
				error: 'Failed to queue CSV export',
				apps: []
			};
		}
	}
};
