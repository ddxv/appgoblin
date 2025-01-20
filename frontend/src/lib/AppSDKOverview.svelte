<script lang="ts">
	import ManifestItemList from '$lib/ManifestItemList.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';

	import { page } from '$app/state';

	let { myPackageInfo, companyTypes } = $props();
</script>

<h4 class="h4 md:h3 p-2">Ad SDKs, Trackers & Permissions</h4>
<div class="p-2 md:py-2">
	<a href="/apps/{page.params.id}/sdks">
		<div class="btn preset-tonal hover:preset-tonal-primary">
			<span> Full list of individual SDK parts detected.</span>
		</div>
	</a>
</div>

{#await myPackageInfo}
	Loading permissions and tracker data...
{:then packageInfo}
	{#if typeof packageInfo == 'string'}
		<p>Permissions, SDKs and trackers info not yet available for this app.</p>
	{:else}
		{#if packageInfo.sdk_categories && Object.keys(packageInfo.sdk_categories).length > 0}
			{#await companyTypes}
				Loading company types...
			{:then myCompanyTypes}
				{#each Object.keys(packageInfo.sdk_categories) as category}
					<WhiteCard>
						{#snippet title()}
							{myCompanyTypes.types.find((x: { url_slug: string }) => x.url_slug === category)
								?.name || category}
						{/snippet}
						<div class="p-2">
							<ManifestItemList items={packageInfo.sdk_categories[category]}></ManifestItemList>
						</div>
					</WhiteCard>
				{/each}
			{/await}
		{:else}
			<p>
				No SDKs found for this app, <a href="/apps/{page.params.id}/sdks"
					>check the full list of SDKs
				</a> for untagged companies.
			</p>
		{/if}
		{#if packageInfo.permissions && packageInfo.permissions.length > 0}
			<h4 class="h4 md:h3 p-2 md:p-4 mt-4">Permissions</h4>
			<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
				{#each packageInfo.permissions as permission}
					<p>{permission}</p>
				{/each}
			</div>
		{/if}
		{#if packageInfo.leftovers && Object.keys(packageInfo.leftovers).length > 0}
			<h4 class="h4 md:h3 p-2 md:p-4 mt-4">Unknown SDKs and Services</h4>
			<ManifestItemList items={packageInfo.leftovers}></ManifestItemList>
		{/if}
	{/if}
{/await}
<RequestSDKScanButton />
