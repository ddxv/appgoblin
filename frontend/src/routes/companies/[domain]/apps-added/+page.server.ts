import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';
import { STRIPE_PRICES } from '$lib/server/stripe';
import type { CompanyAppChangesOverview } from '../../../../types';

type ActiveSubscriptionRow = {
	provider_price_id: string;
};

type CompanyDetailsWithTrends = {
	trends_summary?: {
		latest_period?: string | null;
	} | null;
};

type QuarterAppChangesEntry = {
	label: string;
	appChanges: CompanyAppChangesOverview;
};

function isNotFoundError(errorValue: unknown): errorValue is { status: number } {
	return (
		typeof errorValue === 'object' &&
		errorValue !== null &&
		'status' in errorValue &&
		typeof errorValue.status === 'number'
	);
}

function getPreviousQuarter(year: number, quarter: number) {
	if (quarter === 1) {
		return { year: year - 1, quarter: 4 };
	}

	return { year, quarter: quarter - 1 };
}

function getFallbackCurrentQuarter() {
	const now = new Date();
	return {
		year: now.getUTCFullYear(),
		quarter: Math.floor(now.getUTCMonth() / 3) + 1
	};
}

function parseLatestPeriod(latestPeriod: string | null | undefined) {
	if (!latestPeriod) {
		return getFallbackCurrentQuarter();
	}

	const match = latestPeriod.match(/(\d{4})-?Q([1-4])/i);
	if (!match) {
		return getFallbackCurrentQuarter();
	}

	return {
		year: Number.parseInt(match[1], 10),
		quarter: Number.parseInt(match[2], 10)
	};
}

function buildPreviewQuarterlyEntries(
	latestPeriod: string | null | undefined
): QuarterAppChangesEntry[] {
	const currentQuarter = parseLatestPeriod(latestPeriod);
	const previousQuarter = getPreviousQuarter(currentQuarter.year, currentQuarter.quarter);

	function makeEmptyOverview(year: number, quarter: number): CompanyAppChangesOverview {
		return {
			status: 'preview',
			year,
			quarter,
			android: { apps: [] },
			ios: { apps: [] }
		};
	}

	return [
		{
			label: 'Latest quarter',
			appChanges: makeEmptyOverview(currentQuarter.year, currentQuarter.quarter)
		},
		{
			label: 'Previous quarter',
			appChanges: makeEmptyOverview(previousQuarter.year, previousQuarter.quarter)
		}
	];
}

async function getSubscriptionAccess(userId: number) {
	const row = await db.queryOne<ActiveSubscriptionRow>(
		`SELECT provider_price_id FROM subscriptions
		 WHERE user_id = $1
		 AND status IN ('active', 'trialing')
		 AND (cancel_at IS NULL OR cancel_at > NOW())
		 ORDER BY created_at DESC LIMIT 1`,
		[userId]
	);

	const hasB2BSdkAccess =
		!!row && [STRIPE_PRICES.b2b_sdk, STRIPE_PRICES.b2b_premium].includes(row.provider_price_id);

	return { hasB2BSdkAccess };
}

async function loadCompanyAppChanges(
	api: ReturnType<typeof createApiClient>,
	endpoint: string,
	name: string
) {
	try {
		return (await api.get(endpoint, name)) as CompanyAppChangesOverview;
	} catch (errorValue) {
		if (!isNotFoundError(errorValue) || errorValue.status !== 404) {
			throw errorValue;
		}

		return null;
	}
}

export const load: PageServerLoad = async ({ fetch, locals, params, parent }) => {
	const api = createApiClient(fetch);
	const parentData = await parent();
	const companyDetails = parentData.companyDetails as CompanyDetailsWithTrends | undefined;

	let hasB2BSdkAccess = false;
	if (locals.user) {
		const access = await getSubscriptionAccess(locals.user.id);
		hasB2BSdkAccess = access.hasB2BSdkAccess;
	}
	const quarterlyAppChanges: QuarterAppChangesEntry[] = [];

	if (!hasB2BSdkAccess) {
		return {
			quarterlyAppChanges: buildPreviewQuarterlyEntries(
				companyDetails?.trends_summary?.latest_period
			),
			companyName:
				(
					parentData.companyTree as
						| {
								queried_domain?: string;
								company_name?: string;
								company_domain?: string;
						  }
						| undefined
				)?.company_name ??
				(
					parentData.companyTree as
						| {
								queried_domain?: string;
								company_name?: string;
								company_domain?: string;
						  }
						| undefined
				)?.company_domain ??
				(
					parentData.companyTree as
						| {
								queried_domain?: string;
								company_name?: string;
								company_domain?: string;
						  }
						| undefined
				)?.queried_domain ??
				params.domain ??
				'',
			hasB2BSdkAccess
		};
	}

	const currentQuarterAppChanges = await loadCompanyAppChanges(
		api,
		`/companies/${params.domain}/apps-added`,
		'Company apps added'
	);

	let previousQuarterAppChanges: CompanyAppChangesOverview | null = null;
	if (currentQuarterAppChanges) {
		const previousQuarter = getPreviousQuarter(
			currentQuarterAppChanges.year,
			currentQuarterAppChanges.quarter
		);
		previousQuarterAppChanges = await loadCompanyAppChanges(
			api,
			`/companies/${params.domain}/apps-added?year=${previousQuarter.year}&quarter=${previousQuarter.quarter}`,
			'Company apps added previous quarter'
		);
	}

	const tree = parentData.companyTree as
		| { queried_domain?: string; company_name?: string; company_domain?: string }
		| undefined;
	const companyName =
		tree?.company_name ?? tree?.company_domain ?? tree?.queried_domain ?? params.domain ?? '';

	if (currentQuarterAppChanges) {
		quarterlyAppChanges.push({
			label: 'Latest quarter',
			appChanges: currentQuarterAppChanges
		});
	}

	if (previousQuarterAppChanges) {
		quarterlyAppChanges.push({
			label: 'Previous quarter',
			appChanges: previousQuarterAppChanges
		});
	}

	return {
		quarterlyAppChanges,
		companyName,
		hasB2BSdkAccess
	};
};
