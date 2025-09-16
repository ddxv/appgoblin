<script lang="ts">
	import { formatNumber, formatNumberLocale } from '$lib/utils/formatNumber';

	let { myTotals, myType, hideAdstxtApps = false } = $props();

	const titleFont = 'text-xl text-primary-900-100 tracking-wide';
	const subTitleFont = 'text-large text-primary-800-200 tracking-wide';
	const rowTitleFont = 'text-sm text-primary-800-200 tracking-wide';
</script>

<div class="table-container p-4">
	{#if myType.url_slug === 'ad-networks' || myType.url_slug === 'all-companies'}
		<div class={titleFont}>SDKs</div>
	{:else}
		<div class={titleFont}>Apps with SDK</div>
	{/if}
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
				<td class="py-2 px-1">{formatNumberLocale(myTotals.sdk_android_total_apps)}</td>
				<td class="py-2 px-1">{formatNumberLocale(myTotals.sdk_ios_total_apps)}</td>
			</tr>
			<tr>
				<td class="py-2 px-1 {rowTitleFont}">Monthly Installs</td>
				<td class="py-2 px-1">{formatNumber(myTotals.sdk_android_installs_d30)}</td>
				<td class="py-2 px-1">{formatNumber(myTotals.sdk_ios_rating_count_d30 * 100)}</td>
			</tr>
		</tbody>
	</table>
</div>
{#if myType.url_slug === 'ad-networks' || myType.url_slug === 'all-companies'}
	{#if myTotals.total_companies}
		<div class="grid p-4">
			<div class={titleFont}>Advertising Domains Tracked</div>
			<div class="stat-container">
				<div class="text-2xl font-bold text-primary-900">
					{formatNumberLocale(myTotals.total_companies)}
				</div>
			</div>
		</div>
	{:else if !hideAdstxtApps && myTotals.adstxt_direct_android_total_apps}
		<hr />
		<div class={titleFont}>App-Ads.txt DIRECT apps</div>
		<div class="grid grid-cols-2 gap-4 p-4">
			<div class="stat-container">
				<div class={subTitleFont}>Android Adstxt apps</div>
				<div class="text-2xl font-bold text-primary-900">
					{formatNumberLocale(myTotals.adstxt_direct_android_total_apps)}
				</div>
			</div>
			<div class="stat-container">
				<div class={subTitleFont}>iOS Adstxt apps</div>
				<div class="text-2xl font-bold text-primary-900">
					{formatNumberLocale(myTotals.adstxt_direct_ios_total_apps)}
				</div>
			</div>
		</div>
	{:else}{/if}
{/if}
