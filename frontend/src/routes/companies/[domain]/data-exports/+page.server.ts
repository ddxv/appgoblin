import { db } from '$lib/server/auth/db';
import { buildAppAdsTxtUrl, buildCompanyVerifiedAppsUrl } from '$lib/server/downloads';

import type { PageServerLoad } from './$types';

type CompanyTotals = {
	sdk_android_total_apps?: number | null;
	sdk_ios_total_apps?: number | null;
	adstxt_direct_android_total_apps?: number | null;
	adstxt_direct_ios_total_apps?: number | null;
	adstxt_reseller_android_total_apps?: number | null;
	adstxt_reseller_ios_total_apps?: number | null;
};

type CompanyDetailsForExports = {
	categories?: {
		all?: CompanyTotals;
	};
	adstxt_ad_domain_overview?: {
		google?: { direct?: unknown | null; reseller?: unknown | null } | null;
		apple?: { direct?: unknown | null; reseller?: unknown | null } | null;
	} | null;
};

export const load: PageServerLoad = async ({ locals, params, parent }) => {
	const user = locals.user;
	let canDownload = false;

	if (user) {
		const row = await db.queryOne<{ status: string }>(
			`SELECT status FROM subscriptions
			 WHERE user_id = $1 AND status IN ('active', 'trialing')
			 ORDER BY created_at DESC LIMIT 1`,
			[user.id]
		);
		canDownload = !!row;
	}

	const parentData = await parent();
	const tree = parentData.companyTree as { queried_company_name?: string } | undefined;
	const companyDetails = parentData.companyDetails as CompanyDetailsForExports | undefined;
	const companyName = tree?.queried_company_name ?? params.domain ?? '';
	const domain = params.domain ?? '';
	const totals = companyDetails?.categories?.all;

	const adstxtRowEstimate =
		Number(totals?.adstxt_direct_android_total_apps ?? 0) +
		Number(totals?.adstxt_direct_ios_total_apps ?? 0) +
		Number(totals?.adstxt_reseller_android_total_apps ?? 0) +
		Number(totals?.adstxt_reseller_ios_total_apps ?? 0);
	const androidRowEstimate = Number(totals?.sdk_android_total_apps ?? 0);
	const iosRowEstimate = Number(totals?.sdk_ios_total_apps ?? 0);

	const adstxtOverview = companyDetails?.adstxt_ad_domain_overview;
	const hasAdstxtDirectOrReseller = Boolean(
		adstxtOverview?.google?.direct ||
		adstxtOverview?.google?.reseller ||
		adstxtOverview?.apple?.direct ||
		adstxtOverview?.apple?.reseller
	);

	const hasAppAdsTxtData = hasAdstxtDirectOrReseller || adstxtRowEstimate > 0;
	const hasAndroidTrafficData = androidRowEstimate > 0;
	const hasIosTrafficData = iosRowEstimate > 0;

	const downloadUrls = canDownload
		? {
				appAdsTxt: hasAppAdsTxtData ? buildAppAdsTxtUrl(domain) : null,
				companyVerifiedAndroid: hasAndroidTrafficData
					? buildCompanyVerifiedAppsUrl(domain, 'android')
					: null,
				companyVerifiedIos: hasIosTrafficData ? buildCompanyVerifiedAppsUrl(domain, 'ios') : null
			}
		: null;

	return {
		canDownload,
		companyName,
		downloadUrls,
		exportStats: {
			appAdsTxt: {
				available: hasAppAdsTxtData,
				estimatedRows: adstxtRowEstimate
			},
			companyVerifiedAndroid: {
				available: hasAndroidTrafficData,
				estimatedRows: androidRowEstimate
			},
			companyVerifiedIos: {
				available: hasIosTrafficData,
				estimatedRows: iosRowEstimate
			}
		}
	};
};
