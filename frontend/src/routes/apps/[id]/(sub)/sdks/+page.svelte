<script lang="ts">
	import ManifestItemList from '$lib/ManifestItemList.svelte';

	let { data }: { data: any } = $props();
</script>

<div class="p-2 md:p-16 mt-2 md:mt-4">
	<section class="space-y-6">
		<h2 class="h1 md:h3 p-2">SDKs in {data.myapp.name || ''}</h2>

		{#if typeof data.myPackageInfo == 'string'}
			<p>Permissions, SDKs and trackers info not yet available for this app.</p>
		{:else}
			<section class="grid grid-cols-1 gap-4">
				{#if data.myPackageInfo.company_categories && Object.keys(data.myPackageInfo.company_categories).length > 0}
					{#await data.companyTypes}
						Loading company types...
					{:then myCompanyTypes}
						{#each Object.keys(data.myPackageInfo.company_categories) as category}
							<h3 class="h3">
								{myCompanyTypes.types.find((x: { url_slug: string }) => x.url_slug === category)
									?.name || category}
							</h3>
							<div class="p-2 lg:p-4">
								<ManifestItemList items={data.myPackageInfo.company_categories[category]}
								></ManifestItemList>
							</div>
						{/each}
					{/await}
				{/if}
			</section>
		{/if}
	</section>
</div>
