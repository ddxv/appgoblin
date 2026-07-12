import type { PageServerLoad } from './$types';
import { createApiClient } from '$lib/server/api';
import { db } from '$lib/server/auth/db';
import { getStripePriceIds } from '$lib/server/stripe';
import type { CompanyAppChangesOverview, CompanyOverviewApps } from '../../../../types';

type ActiveSubscriptionRow = {
	provider_price_id: string;
};

type CompanyDetailsWithTrends = {
	trends_summary?: {
		latest_period?: string | null;
	} | null;
};

type MergedAppChanges = {
	android: CompanyOverviewApps[];
	ios: CompanyOverviewApps[];
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

function buildPreviewMerged(latestPeriod: string | null | undefined): MergedAppChanges {
	return { android: [], ios: [] };
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
		!!row && getStripePriceIds('b2b_sdk', 'b2b_premium').includes(row.provider_price_id);

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

function mergeQuadrantAppChanges(
	current: CompanyAppChangesOverview | null,
	previous: CompanyAppChangesOverview | null
): MergedAppChanges {
	const addQuarter = (apps: CompanyOverviewApps[], year: number, quarter: number) =>
		apps.map((app) => ({ ...app, year, quarter }));

	const allAndroid: CompanyOverviewApps[] = [];
	const allIos: CompanyOverviewApps[] = [];

	if (current) {
		allAndroid.push(...addQuarter(current.android.apps ?? [], current.year, current.quarter));
		allIos.push(...addQuarter(current.ios.apps ?? [], current.year, current.quarter));
	}
	if (previous) {
		allAndroid.push(...addQuarter(previous.android.apps ?? [], previous.year, previous.quarter));
		allIos.push(...addQuarter(previous.ios.apps ?? [], previous.year, previous.quarter));
	}

	const sortFn = (a: CompanyOverviewApps, b: CompanyOverviewApps) => {
		const yearDiff = (b.year ?? 0) - (a.year ?? 0);
		if (yearDiff !== 0) return yearDiff;
		const quarterDiff = (b.quarter ?? 0) - (a.quarter ?? 0);
		if (quarterDiff !== 0) return quarterDiff;
		return (b.installs_d30 ?? 0) - (a.installs_d30 ?? 0);
	};

	return {
		android: allAndroid.sort(sortFn).slice(0, 50),
		ios: allIos.sort(sortFn).slice(0, 50)
	};
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

	const tree = parentData.companyTree as
		{ queried_domain?: string; company_name?: string; company_domain?: string } | undefined;
	const companyName =
		tree?.company_name ?? tree?.company_domain ?? tree?.queried_domain ?? params.domain ?? '';

	let appChanges: MergedAppChanges;

	if (!hasB2BSdkAccess) {
		appChanges = buildPreviewMerged(companyDetails?.trends_summary?.latest_period);
	} else {
		const currentQuarterAppChanges = await loadCompanyAppChanges(
			api,
			`/companies/${params.domain}/apps-lost-adstxt`,
			'Company apps lost (adstxt)'
		);

		let previousQuarterAppChanges: CompanyAppChangesOverview | null = null;
		if (currentQuarterAppChanges) {
			const previousQuarter = getPreviousQuarter(
				currentQuarterAppChanges.year,
				currentQuarterAppChanges.quarter
			);
			previousQuarterAppChanges = await loadCompanyAppChanges(
				api,
				`/companies/${params.domain}/apps-lost-adstxt?year=${previousQuarter.year}&quarter=${previousQuarter.quarter}`,
				'Company apps lost adstxt previous quarter'
			);
		}

		appChanges = mergeQuadrantAppChanges(currentQuarterAppChanges, previousQuarterAppChanges);
	}

	return {
		appChanges,
		companyName,
		hasB2BSdkAccess
	};
};
