<script lang="ts">
	import WhiteCard from './WhiteCard.svelte';
	import CompanyOverviewTable from './CompanyOverviewTable.svelte';

	let { detailsData, tableData, category } = $props();

	function formatNumber(num: number) {
		return new Intl.NumberFormat('en-US').format(num);
	}
	function hasAppAdsTxt(tableData: any) {
		return tableData.android.apps.length > 0 || tableData.ios.apps.length > 0;
	}
</script>

<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 my-6">
	<!-- SDK Section -->
	<WhiteCard>
		{#snippet title()}
			SDK
		{/snippet}
		<p class="text-sm md:text-lg mb-2">
			SDK data is derived by downloading the app's Android APK or iOS IPA file and unzipped. We then
			check the app's data for SDK signatures in paths, AndroidManifest.xml and the Info.plist. Many
			apps are unable to be zipped. Downloading and opening the APK or IPA takes time and resources
			thus the smaller totals.
		</p>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Android SDK -->
			<div class="card preset-tonal">
				<p class="text-lg">
					Total Android Apps: {formatNumber(
						detailsData.categories[category]?.sdk_android_total_apps || 0
					)}
				</p>
			</div>
			<div class="card preset-tonal">
				<p class="text-lg">
					Total iOS Apps: {formatNumber(detailsData.categories[category]?.sdk_ios_total_apps || 0)}
				</p>
			</div>
		</div>
	</WhiteCard>

	<!-- App Ads.txt Section -->
	{#if tableData.android.apps.length > 0 || tableData.ios.apps.length > 0}
		<WhiteCard>
			{#snippet title()}
				App Ads.txt
			{/snippet}
			<p class="text-sm md:text-lg font-bold text-primary-900-100 mb-4">('DIRECT')</p>
			<p class="text-sm md:text-lg mb-2">
				App-ads.txt files are an open standard by the IAB to help combat ad fraud. This data was
				crawled from the URLs on the app's developer pages. Not all apps have app-ads.txt, many do
				not.
			</p>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<!-- Android App Ads.txt -->
				<div class="card preset-tonal">
					<div class="card-header">
						<p class="text-sm md:text-lg">
							Total Android Apps: {formatNumber(
								detailsData.categories[category]?.adstxt_direct_android_total_apps || 0
							)}
						</p>
					</div>
					<div class="card-content"></div>
				</div>
				<!-- iOS App Ads.txt -->
				<div class="card preset-tonal">
					<div class="card-header">
						<p class="text-sm md:text-lg">
							Total iOS Apps: {formatNumber(
								detailsData.categories[category]?.adstxt_direct_ios_total_apps || 0
							)}
						</p>
					</div>
					<div class="card-content"></div>
				</div>
			</div>
		</WhiteCard>
	{/if}
</div>

<div class="grid grid-cols-1">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<WhiteCard>
			{#snippet title()}
				Android SDK
			{/snippet}
			<CompanyOverviewTable entries_table={tableData.android.apps} />
		</WhiteCard>
		<WhiteCard>
			{#snippet title()}
				iOS SDK
			{/snippet}
			<CompanyOverviewTable entries_table={tableData.ios.apps} isiOS={true} />
		</WhiteCard>
	</div>
</div>
