<script lang="ts">
	import { formatNumberLocale } from '$lib/utils/formatNumber';
	import type { CompanyTrendSummary, CompanyTrendsSummary } from '../types';

	import { page } from '$app/state';

	let {
		myTotals,
		myType,
		hideAdstxtApps = false,
		companyName,
		isSecondaryDomain = false,
		trendsSummary = null
	} = $props();

	let safeTotals = $derived(myTotals ?? {});

	let categoryTitle = $derived(
		page.params.category
			? (page.data?.appCats?.categories?.find((c: { id: string }) => c.id === page.params.category)
					?.name ?? 'All')
			: null
	);

	const titleFont = 'text-xl  tracking-wide';
	const subTitleFont = 'text-large -200 tracking-wide';
	const rowTitleFont = 'text-sm -200 tracking-wide';
	const greyFont = 'text-xs text-surface-500';

	const formatTrimmed = (value: number, digits: number): string =>
		value.toFixed(digits).replace(/\.0+$|(?<=\.[0-9]*[1-9])0+$/, '');

	const formatPct = (value: number): string => {
		if (value === 0) return '0%';
		if (value < 0.001) return '<0.1%';
		const pct = value * 100;
		const digits = pct < 5 ? 2 : 1;
		return `${formatTrimmed(pct, digits)}%`;
	};

	const formatRelativeChange = (value: number | null | undefined): string => {
		if (typeof value !== 'number' || Number.isNaN(value)) return 'n/a';
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${formatTrimmed(value, 2)}%`;
	};

	const toneClass = (value: number | null | undefined): string => {
		const normalized = Number(value ?? 0);
		if (normalized === 0) return 'text-surface-500';
		return normalized > 0 ? 'text-success-700-300' : 'text-error-700-300';
	};

	const getTrendSource = (
		summary: CompanyTrendsSummary | null | undefined,
		platform: string,
		tagSource: string
	): CompanyTrendSummary | undefined =>
		Object.values(summary?.sources ?? {}).find(
			(source) => source.platform === platform && source.tag_source === tagSource
		);

	const sdkAndroidTrend = $derived(getTrendSource(trendsSummary, 'android', 'sdk'));
	const sdkIosTrend = $derived(getTrendSource(trendsSummary, 'ios', 'sdk'));
	const apiAndroidTrend = $derived(getTrendSource(trendsSummary, 'android', 'api_call'));
	const apiIosTrend = $derived(getTrendSource(trendsSummary, 'ios', 'api_call'));

	// --- Computed penetration & share metrics ---

	const sdkAndroidPenetration = $derived(
		safeTotals.sdk_android_universe_apps > 0
			? safeTotals.sdk_android_total_apps / safeTotals.sdk_android_universe_apps
			: 0
	);
	const sdkIosPenetration = $derived(
		safeTotals.sdk_ios_universe_apps > 0
			? safeTotals.sdk_ios_total_apps / safeTotals.sdk_ios_universe_apps
			: 0
	);

	const sdkAndroidShareInstalls = $derived(
		safeTotals.sdk_android_universe_installs_d30 > 0
			? safeTotals.sdk_android_installs_d30 / safeTotals.sdk_android_universe_installs_d30
			: 0
	);
	const sdkIosShareInstalls = $derived(
		safeTotals.sdk_ios_universe_installs_d30 > 0
			? safeTotals.sdk_ios_installs_d30 / safeTotals.sdk_ios_universe_installs_d30
			: 0
	);

	const apiAndroidPenetration = $derived(
		safeTotals.api_android_universe_apps > 0
			? safeTotals.api_android_total_apps / safeTotals.api_android_universe_apps
			: 0
	);

	const apiAndroidShareInstalls = $derived(
		safeTotals.api_android_universe_installs_d30 > 0
			? safeTotals.api_android_installs_d30 / safeTotals.api_android_universe_installs_d30
			: 0
	);
</script>

{#if !isSecondaryDomain}
	<!-- === SDK SECTION === -->
	<div class="table-container p-4">
		<div class={titleFont}>
			{categoryTitle ? `${categoryTitle} Apps` : 'Apps'} with {companyName} SDKs
			<p class="text-xs text-surface-500">
				Verified SDK counts are based on apps decompiled by AppGoblin.
			</p>
		</div>
		{#if (safeTotals.sdk_android_total_apps ?? 0) === 0 && (safeTotals.sdk_ios_total_apps ?? 0) === 0}
			<p class={greyFont}>
				No apps with {companyName} SDKs found. Please feel free to contact if you would like this mapped.
			</p>
		{:else}
			<p class="text-xs text-surface-500 mb-2">
				Apps using {companyName} SDKs based on static analysis by AppGoblin:
				{formatNumberLocale(safeTotals.sdk_android_total_apps ?? 0)} Android apps and
				{formatNumberLocale(safeTotals.sdk_ios_total_apps ?? 0)} iOS apps.
			</p>
			<table class="table w-full">
				<thead>
					<tr>
						<th class="text-left py-2 px-1"></th>
						<th class="text-left py-2 px-1">Android</th>
						<th class="text-left py-2 px-1">iOS</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="py-2 px-1 {rowTitleFont}">SDK Penetration</td>
						<td class="py-2 px-1">{formatPct(sdkAndroidPenetration)}</td>
						<td class="py-2 px-1">{formatPct(sdkIosPenetration)}</td>
					</tr>
					<tr>
						<td class="py-2 px-1 {rowTitleFont}">Monthly Share of Installs</td>
						<td class="py-2 px-1">{formatPct(sdkAndroidShareInstalls)}</td>
						<td class="py-2 px-1">{formatPct(sdkIosShareInstalls)}</td>
					</tr>
					{#if trendsSummary}
						<tr>
							<td class="py-2 px-1 {rowTitleFont}">SDK Market Share Change</td>
							<td
								class={`py-2 px-1 ${toneClass(sdkAndroidTrend?.latest_pct_market_share_change_pct)}`}
							>
								{formatRelativeChange(sdkAndroidTrend?.latest_pct_market_share_change_pct)}
							</td>
							<td class={`py-2 px-1 ${toneClass(sdkIosTrend?.latest_pct_market_share_change_pct)}`}>
								{formatRelativeChange(sdkIosTrend?.latest_pct_market_share_change_pct)}
							</td>
						</tr>
						<tr>
							<td class="py-2 px-1 {rowTitleFont}">API Call Market Share Change</td>
							<td
								class={`py-2 px-1 ${toneClass(apiAndroidTrend?.latest_pct_market_share_change_pct)}`}
							>
								{formatRelativeChange(apiAndroidTrend?.latest_pct_market_share_change_pct)}
							</td>
							<td class={`py-2 px-1 ${toneClass(apiIosTrend?.latest_pct_market_share_change_pct)}`}>
								{formatRelativeChange(apiIosTrend?.latest_pct_market_share_change_pct)}
							</td>
						</tr>
					{/if}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- === API CALLS SECTION === -->
	<div class="table-container p-4 border-t border-surface-200-800/50">
		<div class={titleFont}>
			{categoryTitle ? `${categoryTitle} App` : 'App'} API Call Activity
			<p class="text-xs text-surface-500">
				Apps detected making API calls associated with {companyName}.
			</p>
		</div>
		{#if (safeTotals.api_android_total_apps ?? 0) === 0 && (safeTotals.api_ios_total_apps ?? 0) === 0}
			<p class={greyFont}>
				No apps with API calls for {companyName} found.
			</p>
		{:else}
			<table class="table w-full">
				<thead>
					<tr>
						<th class="text-left py-2 px-1"></th>
						<th class="text-left py-2 px-1">Android</th>
						<th class="text-left py-2 px-1">iOS</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="py-2 px-1 {rowTitleFont}">Apps</td>
						<td class="py-2 px-1">{formatNumberLocale(safeTotals.api_android_total_apps ?? 0)}</td>
						<td class="py-2 px-1">—</td>
					</tr>
					<tr>
						<td class="py-2 px-1 {rowTitleFont}">API Call Penetration</td>
						<td class="py-2 px-1">{formatPct(apiAndroidPenetration)}</td>
						<td class="py-2 px-1">—</td>
					</tr>
					<tr>
						<td class="py-2 px-1 {rowTitleFont}">Monthly Share of Installs</td>
						<td class="py-2 px-1">{formatPct(apiAndroidShareInstalls)}</td>
						<td class="py-2 px-1">—</td>
					</tr>
				</tbody>
			</table>
		{/if}
	</div>
{/if}

{#if myType.url_slug === 'ad-networks' || myType.url_slug === 'all-companies'}
	{#if safeTotals.total_companies}
		<div class="grid p-4">
			<div class={titleFont}>Company Domains</div>
			<div class="stat-container">
				<div class="text-2xl font-bold">
					{formatNumberLocale(safeTotals.total_companies)}
				</div>
			</div>
		</div>
	{:else if !hideAdstxtApps && safeTotals.adstxt_direct_android_total_apps}
		<hr />
		<div class={titleFont}>App-Ads.txt DIRECT apps</div>
		<div class="grid grid-cols-2 gap-4 p-4">
			<div class="stat-container">
				<div class={subTitleFont}>Android Adstxt apps</div>
				<div class="text-2xl font-bold">
					{formatNumberLocale(safeTotals.adstxt_direct_android_total_apps)}
				</div>
			</div>
			<div class="stat-container">
				<div class={subTitleFont}>iOS Adstxt apps</div>
				<div class="text-2xl font-bold">
					{formatNumberLocale(safeTotals.adstxt_direct_ios_total_apps)}
				</div>
			</div>
		</div>
	{:else}{/if}
{/if}
