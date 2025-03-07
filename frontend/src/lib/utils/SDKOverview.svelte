<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';

	let { data } = $props();

	function formatNumber(num: number) {
		return num.toLocaleString();
	}
</script>

<WhiteCard>
	{#snippet title()}
		Apps Checked for SDKs
	{/snippet}
	<div class="table-wrap">
		{#await data.appsOverview}
			Loading SDKs Overview...
		{:then appsOverview}
			{#if appsOverview}
				<table class="table">
					<thead>
						<tr class="border-b">
							<th class="w-1/3">Total Apps</th>
							<th class="w-1/3">Android Apps Scanned This Week</th>
							<th class="w-1/3">iOS Apps Scanned This Week</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<span class="text-success-900-100">
									{formatNumber(
										appsOverview.sdk_success_android_apps + appsOverview.sdk_success_ios_apps
									)}
								</span>
								/ {formatNumber(appsOverview.sdk_android_apps + appsOverview.sdk_ios_apps)}
							</td>
							<td>
								<span class="text-success-900-100">
									{formatNumber(appsOverview.sdk_weekly_success_android_apps)}
								</span>
								/ {formatNumber(appsOverview.sdk_weekly_android_apps)}
							</td>
							<td>
								<span class="text-success-900-100">
									{formatNumber(appsOverview.sdk_weekly_success_ios_apps)}
								</span>
								/ {formatNumber(appsOverview.sdk_weekly_ios_apps)}
							</td>
						</tr>
					</tbody>
				</table>
			{/if}
		{/await}
	</div>
</WhiteCard>
