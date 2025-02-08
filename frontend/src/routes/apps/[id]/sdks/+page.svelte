<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import ManifestItemList from '$lib/ManifestItemList.svelte';
	import ManifestItemUnknownsList from '$lib/ManifestItemUnknownsList.svelte';

	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';
	import AppTitle from '$lib/AppTitle.svelte';

	import { page } from '$app/state';

	let { data } = $props();
</script>

{#await data.myapp}
	Loading app details...
{:then myapp}
	<AppTitle {myapp} />
{/await}

<div class="p-2 md:py-2">
	<a href="/apps/{page.params.id}">
		<div class="btn preset-tonal hover:preset-tonal-primary">
			<span>Back to App Main Page</span>
		</div>
	</a>
</div>

<div class="card preset-tonal p-2 md:p-16 mt-2 md:mt-4">
	<h4 class="h4 md:h3 p-2">Ad SDKs, Trackers & Permissions</h4>
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
	<RequestSDKScanButton />
</div>
