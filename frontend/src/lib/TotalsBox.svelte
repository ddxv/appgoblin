<script lang="ts">
	import { formatNumberLocale } from '$lib/utils/formatNumber';

	let { myTotals, myType, hideAdstxtApps = false } = $props();

	const titleFont = 'text-xl text-primary-800-200 uppercase tracking-wide';
	const subTitleFont = 'text-large font-bold text-primary-800-200 uppercase tracking-wide';
	const subContentFont = 'text-sm text-primary-900 uppercase tracking-wide';
</script>

<div class={titleFont}>Apps Scanned for SDKs</div>
<div class="stat-container">
	<div class={subTitleFont}>Total Apps Scanned</div>
	<div class={subContentFont}>
		Apps: {formatNumberLocale(myTotals.sdk_total_apps)}
	</div>
</div>
<div class="grid grid-cols-2 gap-4 p-4">
	<div class="stat-container">
		<div class={subTitleFont}>Android</div>
		<div class={subContentFont}>
			Apps: {formatNumberLocale(myTotals.sdk_android_total_apps)}
		</div>
		<div class={subContentFont}>
			Monthly Installs: {formatNumberLocale(myTotals.sdk_android_installs_d30)}
		</div>
	</div>

	<div class="stat-container">
		<div class={subTitleFont}>iOS</div>
		<div class={subContentFont}>
			Apps: {formatNumberLocale(myTotals.sdk_ios_total_apps)}
		</div>
		<div class={subContentFont}>
			Monthly Installs: {formatNumberLocale(myTotals.sdk_ios_rating_count_d30 * 100)}
		</div>
	</div>
</div>
{#if myType.url_slug === 'ad-networks' || myType.url_slug === 'all-companies'}
	{#if myTotals.total_companies}
		<hr />
		<div class={titleFont}>App-Ads.txt DIRECT Domains</div>
		<div class="grid grid-cols-2 gap-4 p-4">
			<div class="stat-container">
				<div class={subTitleFont}>Android Adstxt companies</div>
				<div class="text-2xl font-bold text-primary-900">
					{formatNumberLocale(myTotals.adstxt_direct_android_total_companies)}
				</div>
			</div>
			<div class="stat-container">
				<div class={subTitleFont}>iOS Adstxt companies</div>
				<div class="text-2xl font-bold text-primary-900">
					{formatNumberLocale(myTotals.adstxt_direct_ios_total_companies)}
				</div>
			</div>

			<div class="stat-container">
				{#if myType}
					<div class={subTitleFont}>{myType.name}</div>
				{:else}
					<div class={subTitleFont}>All Companies</div>
				{/if}

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
