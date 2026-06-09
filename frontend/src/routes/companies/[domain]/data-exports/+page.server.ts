import { db } from '$lib/server/auth/db';
import { buildAppAdsTxtUrl, buildCompanyVerifiedAppsUrl } from '$lib/server/downloads';

import type { PageServerLoad } from './$types';

type CompanyTotals = {
	sdk_android_total_apps?: number | null;
	sdk_ios_total_apps?: number | null;
};

type CompanyDetailsForExports = {
	categories?: {
		all?: CompanyTotals;
	};
	adstxt_ad_domain_overview?: Record<string, unknown> | null;
};

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const user = locals.user;
	let canDownload = false;

	if (user) {
		const row = await db.queryOne<{ status: string }>(
			`SELECT status FROM subscriptions
			 WHERE user_id = $1
			 AND status IN ('active', 'trialing')
			 AND (cancel_at IS NULL OR cancel_at > NOW())
			 ORDER BY created_at DESC LIMIT 1`,
			[user.id]
		);
		canDownload = !!row;
	}

	const parentData = await parent();
	const tree = parentData.companyTree as
		| { company_name?: string | null; company_domain?: string | null; queried_domain?: string }
		| undefined;
	const companyDetails = parentData.companyDetails as CompanyDetailsForExports | undefined;
	const companyName =
		tree?.company_name ?? tree?.company_domain ?? tree?.queried_domain ?? params.domain ?? '';
	const domain = params.domain ?? '';
	const totals = companyDetails?.categories?.all;
	const hasAdstxtData = Boolean(companyDetails?.adstxt_ad_domain_overview);
	const hasAndroidData = Number(totals?.sdk_android_total_apps ?? 0) > 0;
	const hasIosData = Number(totals?.sdk_ios_total_apps ?? 0) > 0;

	const downloadUrls = canDownload
		? {
				appAdsTxt: hasAdstxtData ? buildAppAdsTxtUrl(domain) : null,
				companyVerifiedAndroid: hasAndroidData
					? buildCompanyVerifiedAppsUrl(domain, 'android')
					: null,
				companyVerifiedIos: hasIosData ? buildCompanyVerifiedAppsUrl(domain, 'ios') : null
			}
		: null;

	return {
		canDownload,
		companyName,
		downloadUrls,
		hasAdstxtData,
		hasAndroidData,
		hasIosData
	};
};
