<script lang="ts">
	import { formatNumberLocale } from '$lib/utils/formatNumber';
	import type { CompanyTrendSummary, CompanyTrendsSummary } from '../types';

	const titleFont = 'text-xl  tracking-wide';
	const rowTitleFont = 'text-sm -200 tracking-wide';
	const greyFont = 'text-xs text-surface-500';

	let {
		myTotals,
		companyName,
		trendsSummary = null
	}: {
		myTotals: any;
		companyName: string;
		trendsSummary?: CompanyTrendsSummary | null;
	} = $props();

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

	const apiAndroidTrend = $derived(getTrendSource(trendsSummary, 'android', 'api_call'));
	const apiIosTrend = $derived(getTrendSource(trendsSummary, 'ios', 'api_call'));

	const apiAndroidPenetration = $derived(
		myTotals?.api_android_universe_apps > 0
			? myTotals.api_android_total_apps / myTotals.api_android_universe_apps
			: 0
	);

	const apiAndroidShareInstalls = $derived(
		myTotals?.api_android_universe_installs_d30 > 0
			? myTotals.api_android_installs_d30 / myTotals.api_android_universe_installs_d30
			: 0
	);
</script>

<div class="table-container p-4">
	<div class={titleFont}>
		App API Call Activity
		<p class="text-xs text-surface-500">
			Apps detected making API calls associated with {companyName}.
		</p>
	</div>
	{#if (myTotals?.api_android_total_apps ?? 0) === 0 && (myTotals?.api_ios_total_apps ?? 0) === 0}
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
					<td class="py-2 px-1">{formatNumberLocale(myTotals.api_android_total_apps ?? 0)}</td>
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
				{#if trendsSummary}
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
