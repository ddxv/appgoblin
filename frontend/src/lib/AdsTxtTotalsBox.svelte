<script lang="ts">
	function formatNumber(num: number) {
		return new Intl.NumberFormat('en-US').format(num);
	}

	let { myTotals } = $props();
</script>

<hr />

<div class="text-md text-primary-800-200 uppercase tracking-wide">Ads.txt DIRECT Totals</div>
<div class="grid grid-cols-2 gap-4 p-4">
	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">Android Pub IDs</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.google.direct.publisher_id_count)}
		</div>
	</div>

	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">iOS Pub IDs</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.apple.direct.publisher_id_count)}
		</div>
	</div>

	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">Android Developers</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.google.direct.developer_count)}
		</div>
	</div>

	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">iOS Developers</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.apple.direct.developer_count)}
		</div>
	</div>

	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">Android Apps</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.google.direct.app_count)}
		</div>
	</div>

	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">iOS Apps</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.apple.direct.app_count)}
		</div>
	</div>
</div>
<hr />
<div class="text-md text-primary-800-200 uppercase tracking-wide">Ads.txt RESELLER Totals</div>
<div class="grid grid-cols-2 gap-4 p-4">
	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">Android Apps</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.google.reseller.app_count)}
		</div>
	</div>
	<div class="stat-container">
		<div class="text-sm text-primary-800-200 uppercase tracking-wide">iOS Apps</div>
		<div class="text-2xl font-bold text-primary-900">
			{formatNumber(myTotals.apple.reseller.app_count)}
		</div>
	</div>
</div>
