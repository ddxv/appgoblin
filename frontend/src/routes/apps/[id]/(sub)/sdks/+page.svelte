<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import ManifestItemList from '$lib/ManifestItemList.svelte';
	import ManifestItemUnknownsList from '$lib/ManifestItemUnknownsList.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';

	import type { AppSDKs } from '../../../../../types';

	let group = $state('sdks');

	let { data }: { data: AppSDKs } = $props();
</script>

<div class="card preset-tonal p-2 md:p-16 mt-2 md:mt-4">
	<h1 class="h1 md:h3 p-2">SDKs, Trackers & Permissions for {data.myapp.name || ''}</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<WhiteCard>
			{#snippet title()}
				SDK Scan Status
			{/snippet}
			<div class="space-y-2 p-2">
				{#if data.myapp.sdk_last_crawled}
					<div class="flex items-center gap-2">
						<span class="font-medium">Last Successful SDK Scan:</span>
						<span class="text-primary-900-100">{data.myapp.sdk_successful_last_crawled}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-medium">Lastest Attempt:</span>
						<span class="text-primary-900-100">{data.myapp.sdk_last_crawled}</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="font-medium">Last Attempt Status:</span>
						<span
							class={data.myapp.sdk_last_crawl_result == 1
								? 'text-success-900-100'
								: 'text-error-900-100'}
						>
							{data.myapp.sdk_last_crawl_result == 1 ? 'Success' : 'Failed'}
						</span>
					</div>
				{:else}
					App not yet analyzed for SDKs.
					<RequestSDKScanButton />
				{/if}
			</div>
		</WhiteCard>
		<RequestSDKScanButton />
	</div>

	<Tabs value={group} onValueChange={(e) => (group = e.value)}>
		{#snippet list()}
			<Tabs.Control value="sdks" labelClasses="p-0 md:p-8"
				><p class="text-xs md:text-base">SDKs</p></Tabs.Control
			>
			{console.log(data.myapp.store)}
			{#if data.myapp.store.startsWith('Apple')}
				<Tabs.Control value="SKAdNetwork" labelClasses="p-0 md:p-8"
					><p class="text-xs md:text-base">SKAdNetwork</p></Tabs.Control
				>
			{/if}
			{#if data.myapp.store.startsWith('Google')}
				<Tabs.Control value="permissions" labelClasses="p-0 md:p-8"
					><p class="text-xs md:text-base">Permissions</p></Tabs.Control
				>
				<Tabs.Control value="queries" labelClasses="p-0 md:p-8"
					><p class="text-xs md:text-base">App Queries</p></Tabs.Control
				>
			{/if}
		{/snippet}

		{#snippet content()}
			<Tabs.Panel value="sdks">
				{#if typeof data.myPackageInfo == 'string'}
					<p>Permissions, SDKs and trackers info not yet available for this app.</p>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						{#if data.myPackageInfo.company_categories && Object.keys(data.myPackageInfo.company_categories).length > 0}
							{#await data.companyTypes}
								Loading company types...
							{:then myCompanyTypes}
								{#each Object.keys(data.myPackageInfo.company_categories) as category}
									<WhiteCard>
										{#snippet title()}
											{myCompanyTypes.types.find(
												(x: { url_slug: string }) => x.url_slug === category
											)?.name || category}
										{/snippet}
										<div class="p-2 lg:p-4">
											<ManifestItemList items={data.myPackageInfo.company_categories[category]}
											></ManifestItemList>
										</div>
									</WhiteCard>
								{/each}
							{/await}
						{/if}
					</div>

					{#if data.myPackageInfo.leftovers && Object.keys(data.myPackageInfo.leftovers).length > 0}
						<ManifestItemUnknownsList items={data.myPackageInfo.leftovers}
						></ManifestItemUnknownsList>
					{/if}
				{/if}
			</Tabs.Panel>
			<Tabs.Panel value="queries">
				<div class="grid grid-cols-1">
					{#if data.myPackageInfo.app_queries && data.myPackageInfo.app_queries.length > 0}
						<h4 class="h4 md:h3 p-2 md:p-4 mt-4">App Queries</h4>
						<p>
							These are the other apps that {data.myapp.name} requests to know other apps are also installed:
						</p>
						<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
							{#each data.myPackageInfo.app_queries as app_query}
								<p><a href="/apps/{app_query}">{app_query}</a></p>
							{/each}
						</div>
					{/if}
				</div>
			</Tabs.Panel>

			<Tabs.Panel value="permissions">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#if data.myPackageInfo.permissions && data.myPackageInfo.permissions.length > 0}
						<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
							<h4 class="h4 md:h3 p-2 md:p-4 mt-4">Permissions</h4>
							{#each data.myPackageInfo.permissions as permission}
								<p>{permission}</p>
							{/each}
						</div>
					{/if}
				</div>
			</Tabs.Panel>

			<Tabs.Panel value="skadnetwork">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					{#if data.myPackageInfo.skadnetwork && data.myPackageInfo.skadnetwork.length > 0}
						<h4 class="h4 md:h3 p-2 md:p-4 mt-4">SKAdNetwork</h4>
						<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
							{#each data.myPackageInfo.skadnetwork as skadnetwork}
								<p>{skadnetwork}</p>
							{/each}
						</div>
					{/if}
				</div>
			</Tabs.Panel>
		{/snippet}
	</Tabs>
</div>
