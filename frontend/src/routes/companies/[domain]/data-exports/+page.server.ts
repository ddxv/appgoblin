import { db } from '$lib/server/auth/db';
import type { PageServerLoad } from './$types';

type CompanyTotals = {
	sdk_android_total_apps?: number | null;
	sdk_ios_total_apps?: number | null;
	api_android_total_apps?: number | null;
	api_ios_total_apps?: number | null;
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
	const hasAndroidData =
		Number(totals?.sdk_android_total_apps ?? 0) > 0 ||
		Number(totals?.api_android_total_apps ?? 0) > 0;
	const hasIosData =
		Number(totals?.sdk_ios_total_apps ?? 0) > 0 ||
		Number(totals?.api_ios_total_apps ?? 0) > 0;

	const getSignedDownloadUrl = async (dataset: string, platform?: 'ios' | 'android') => {
		const query = new URLSearchParams({ dataset, domain });
		if (platform) query.set('platform', platform);
		const response = await fetch(
			`http://localhost:8000/api/public/exports/signed-url?${query.toString()}`
		);
		if (!response.ok) throw new Error(`Unable to sign ${dataset} download`);
		const body = (await response.json()) as { url: string };
		return body.url;
	};

	const downloadUrls = canDownload
		? {
			appAdsTxt: hasAdstxtData ? await getSignedDownloadUrl('app-ads-txt') : null,
			companyVerifiedAndroid: hasAndroidData
				? await getSignedDownloadUrl('company-verified-apps', 'android')
				: null,
			companyVerifiedIos: hasIosData
				? await getSignedDownloadUrl('company-verified-apps', 'ios')
				: null
		}
		: null;

	return {
		canDownload,
		companyName,
		downloadUrls,
		hasAdstxtData,
		hasAndroidData,
		hasIosData,
		userId: user?.id ?? null
	};
};
