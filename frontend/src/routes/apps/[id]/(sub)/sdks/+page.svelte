<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import ManifestItemList from '$lib/ManifestItemList.svelte';
	import ManifestItemUnknownsList from '$lib/ManifestItemUnknownsList.svelte';

	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';

	import type { AppSDKs } from '../../../../../types';

	let { data }: { data: AppSDKs } = $props();
</script>

<div class="card preset-tonal p-2 md:p-16 mt-2 md:mt-4">
	<div class="grid grid-cols-1 md:grid-cols-2 justify-between items-center mb-4">
		<h1 class="h1 md:h3 p-2">Ad SDKs, Trackers & Permissions for {data.myapp.name || ''}</h1>
		<RequestSDKScanButton />
	</div>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<WhiteCard>
			{#snippet title()}
				SDK Tracking Status
			{/snippet}
			{#await data.myapp}
				Loading app data...
			{:then myapp}
				<div class="space-y-2 p-2">
					{#if myapp.sdk_last_crawled}
						<div class="flex items-center gap-2">
							<span class="font-medium">Successful Last Crawled:</span>
							<span class="text-primary-900-100">{myapp.sdk_successful_last_crawled}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-medium">Last Crawled:</span>
							<span class="text-primary-900-100">{myapp.sdk_last_crawled}</span>
						</div>
						<div class="flex items-center gap-2">
							<span class="font-medium">Last Crawl Status:</span>
							<span
								class={myapp.sdk_last_crawl_result == 1
									? 'text-success-900-100'
									: 'text-error-900-100'}
							>
								{myapp.sdk_last_crawl_result == 1 ? 'Success' : 'Failed'}
							</span>
						</div>
					{:else}
						App not yet analyzed for SDKs.
						<RequestSDKScanButton />
					{/if}
				</div>
			{/await}
		</WhiteCard>

		{#await data.myPackageInfo}
			Loading permissions and tracker data...
		{:then packageInfo}
			{#if typeof packageInfo == 'string'}
				<p>Permissions, SDKs and trackers info not yet available for this app.</p>
			{:else}
				{#if packageInfo.company_categories && Object.keys(packageInfo.company_categories).length > 0}
					{#await data.companyTypes}
						Loading company types...
					{:then myCompanyTypes}
						{#each Object.keys(packageInfo.company_categories) as category}
							<WhiteCard>
								{#snippet title()}
									{myCompanyTypes.types.find((x: { url_slug: string }) => x.url_slug === category)
										?.name || category}
								{/snippet}
								<div class="p-2 lg:p-16">
									<ManifestItemList items={packageInfo.company_categories[category]}
									></ManifestItemList>
								</div>
							</WhiteCard>
						{/each}
					{/await}
				{/if}
				{#if packageInfo.app_queries && packageInfo.app_queries.length > 0}
					<h4 class="h4 md:h3 p-2 md:p-4 mt-4">App Queries</h4>
					This app requests to know which of these apps are also installed:
					<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
						{#each packageInfo.app_queries as app_query}
							<p><a href="/apps/{app_query}">{app_query}</a></p>
						{/each}
					</div>
				{/if}
				{#if packageInfo.leftovers && Object.keys(packageInfo.leftovers).length > 0}
					<h4 class="h4 md:h3 p-2 md:p-4 mt-4">Unknown SDKs and Services</h4>
					<ManifestItemUnknownsList items={packageInfo.leftovers}></ManifestItemUnknownsList>
				{/if}
				{#if packageInfo.skadnetwork && packageInfo.skadnetwork.length > 0}
					<h4 class="h4 md:h3 p-2 md:p-4 mt-4">SKAdNetwork</h4>
					<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
						{#each packageInfo.skadnetwork as skadnetwork}
							<p>{skadnetwork}</p>
						{/each}
					</div>
				{/if}
				{#if packageInfo.permissions && packageInfo.permissions.length > 0}
					<h4 class="h4 md:h3 p-2 md:p-4 mt-4">Permissions</h4>
					<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
						{#each packageInfo.permissions as permission}
							<p>{permission}</p>
						{/each}
					</div>
				{/if}
			{/if}
		{/await}
	</div>
</div>
