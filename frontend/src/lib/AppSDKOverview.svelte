<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';

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
		<RequestSDKScanButton />
	{:else if packageInfo.sdk_categories && Object.keys(packageInfo.sdk_categories).length > 0}
		{#await companyTypes}
			Loading company types...
		{:then myCompanyTypes}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
				{#each Object.keys(packageInfo.sdk_categories) as category}
					<WhiteCard>
						{#snippet title()}
							{myCompanyTypes.types.find((x: { url_slug: string }) => x.url_slug === category)
								?.name || category}
						{/snippet}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
							{#each packageInfo.sdk_categories[category] as company}
								<CompanyButton
									companyName={company.company_name}
									companyDomain={company.company_domain}
								/>
							{/each}
						</div>
					</WhiteCard>
				{/each}
			</div>
		{/await}
	{:else}
		<p>
			No SDKs found for this app, <a href="/apps/{page.params.id}/sdks"
				>check the full list of SDKs
			</a> for untagged companies.
		</p>
	{/if}
{/await}
