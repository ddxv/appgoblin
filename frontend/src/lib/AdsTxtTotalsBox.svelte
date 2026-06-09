<script lang="ts">
	import { formatNumberLocale } from '$lib/utils/formatNumber';
	import type { CompanyTrendSummary, CompanyTrendsSummary } from '../types';

	const titleFont = 'text-xl  tracking-wide';

	const rowTitleFont = 'text-sm -200 tracking-wide';

	const greyFont = 'text-xs text-surface-500';

	let { myTotals, trendsSummary = null, showDirect = true, showReseller = true } = $props();

	const formatTrimmed = (value: number, digits: number): string =>
		value.toFixed(digits).replace(/\.0+$|(?<=\.[0-9]*[1-9])0+$/, '');

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

	const directAndroidTrend = $derived(getTrendSource(trendsSummary, 'android', 'app_ads_direct'));
	const directIosTrend = $derived(getTrendSource(trendsSummary, 'ios', 'app_ads_direct'));
</script>

{#if showDirect}
	<div class="table-container p-4">
		<div class={titleFont}>Ads.txt (direct)</div>
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
					<td class="py-2 px-1 {rowTitleFont}">Pub IDs</td>
					<td class="py-2 px-1">
						{#if myTotals?.google?.direct?.publisher_id_count}
							{formatNumberLocale(myTotals.google.direct.publisher_id_count)}
						{:else}
							<p class={greyFont}>No Direct Pub IDs</p>
						{/if}
					</td>
					<td class="py-2 px-1">
						{#if myTotals?.apple?.direct?.publisher_id_count}
							{formatNumberLocale(myTotals.apple.direct.publisher_id_count)}
						{:else}
							<p class={greyFont}>No Direct Pub IDs</p>
						{/if}
					</td>
				</tr>
				<tr>
					<td class="py-2 px-1 {rowTitleFont}">Developers</td>
					<td class="py-2 px-1">
						{#if myTotals?.google?.direct?.developer_count}
							{formatNumberLocale(myTotals.google.direct.developer_count)}
						{:else}
							<p class={greyFont}>No Direct Developers</p>
						{/if}
					</td>
					<td class="py-2 px-1">
						{#if myTotals?.apple?.direct?.developer_count}
							{formatNumberLocale(myTotals.apple.direct.developer_count)}
						{:else}
							<p class={greyFont}>No Direct Developers</p>
						{/if}
					</td>
				</tr>
				<tr>
					<td class="py-2 px-1 {rowTitleFont}">Related Apps</td>
					<td class="py-2 px-1">
						{#if myTotals?.google?.direct?.app_count}
							{formatNumberLocale(myTotals.google.direct.app_count)}
						{:else}
							<p class={greyFont}>No Direct Apps</p>
						{/if}
					</td>
					<td class="py-2 px-1">
						{#if myTotals?.apple?.direct?.app_count}
							{formatNumberLocale(myTotals.apple.direct.app_count)}
						{:else}
							<p class={greyFont}>No Direct Apps</p>
						{/if}
					</td>
				</tr>
				{#if trendsSummary}
					<tr>
						<td class="py-2 px-1 {rowTitleFont}">Latest Change in Market Share</td>
						<td
							class={`py-2 px-1 ${toneClass(directAndroidTrend?.latest_pct_market_share_change_pct)}`}
						>
							{formatRelativeChange(directAndroidTrend?.latest_pct_market_share_change_pct)}
						</td>
						<td
							class={`py-2 px-1 ${toneClass(directIosTrend?.latest_pct_market_share_change_pct)}`}
						>
							{formatRelativeChange(directIosTrend?.latest_pct_market_share_change_pct)}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
{/if}
{#if showReseller}
	<div class="table-container p-4">
		<div class={titleFont}>Ads.txt (reseller)</div>
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
					<td class="py-2 px-1 {rowTitleFont}">Related Apps</td>
					<td class="py-2 px-1">
						{#if myTotals?.google?.reseller?.app_count}
							{formatNumberLocale(myTotals.google.reseller.app_count)}
						{:else}
							<p class={greyFont}>No Reseller Apps</p>
						{/if}
					</td>
					<td class="py-2 px-1">
						{#if myTotals?.apple?.reseller?.app_count}
							{formatNumberLocale(myTotals.apple.reseller.app_count)}
						{:else}
							<p class={greyFont}>No Reseller Apps</p>
						{/if}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
{/if}
