<script lang="ts">
	function formatNumber(num: number) {
		if (num < 1000) {
			return num.toString();
		} else if (num < 1000000) {
			return (num / 1000).toFixed(1) + 'K';
		} else if (num < 1000000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else {
			return (num / 1000000000).toFixed(1) + 'B';
		}
	}

	let { myTotals, myType, hideAdstxtApps = false } = $props();

	const titleFont = 'text-xl text-primary-800-200 uppercase tracking-wide';
	const subTitleFont = 'text-large font-bold text-primary-800-200 uppercase tracking-wide';
	const subContentFont = 'text-sm text-primary-900 uppercase tracking-wide';
</script>

<div class={titleFont}>Apps Scanned for SDKs</div>
<div class="stat-container">
	<div class={subTitleFont}>Total Apps Scanned</div>
	<div class={subContentFont}>
		Apps: {formatNumber(myTotals.sdk_total_apps)}
	</div>
</div>
<div class="grid grid-cols-2 gap-4 p-4">
	<div class="stat-container">
		<div class={subTitleFont}>Android</div>
		<div class={subContentFont}>
			Apps: {formatNumber(myTotals.sdk_android_total_apps)}
		</div>
		<div class={subContentFont}>
			Monthly Installs: {formatNumber(myTotals.sdk_android_installs_d30)}
		</div>
	</div>

	<div class="stat-container">
		<div class={subTitleFont}>iOS</div>
		<div class={subContentFont}>
			Apps: {formatNumber(myTotals.sdk_ios_total_apps)}
		</div>
		<div class={subContentFont}>
			Monthly Installs: {formatNumber(myTotals.sdk_ios_rating_count_d30 * 100)}
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
					{formatNumber(myTotals.adstxt_direct_android_total_companies)}
				</div>
			</div>
			<div class="stat-container">
				<div class={subTitleFont}>iOS Adstxt companies</div>
				<div class="text-2xl font-bold text-primary-900">
					{formatNumber(myTotals.adstxt_direct_ios_total_companies)}
				</div>
			</div>

			<div class="stat-container">
				{#if myType}
					<div class={subTitleFont}>{myType.name}</div>
				{:else}
					<div class={subTitleFont}>All Companies</div>
				{/if}

				<div class="text-2xl font-bold text-primary-900">
					{formatNumber(myTotals.total_companies)}
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
					{formatNumber(myTotals.adstxt_direct_android_total_apps)}
				</div>
			</div>
			<div class="stat-container">
				<div class={subTitleFont}>iOS Adstxt apps</div>
				<div class="text-2xl font-bold text-primary-900">
					{formatNumber(myTotals.adstxt_direct_ios_total_apps)}
				</div>
			</div>
		</div>
	{:else}{/if}
{/if}
