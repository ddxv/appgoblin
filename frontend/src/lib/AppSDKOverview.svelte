<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';

	import { page } from '$app/state';

	let { myPackageInfo, companyTypes } = $props();
</script>

<h4 class="h4 md:h3 p-2">Ad SDKs, Trackers & Permissions</h4>

{#await myPackageInfo}
	Loading permissions and tracker data...
{:then packageInfo}
	{#if typeof packageInfo == 'string'}
		<p>Permissions, SDKs and trackers info not yet available for this app.</p>
		<RequestSDKScanButton />
	{:else if packageInfo.sdk_categories && packageInfo.sdk_last_crawled}
		<div class="p-4 py-4">
			This app was last scanned for SDKs on {packageInfo.sdk_last_crawled}.
			<a href="/apps/{page.params.id}/sdks">
				<div class="btn preset-tonal hover:preset-tonal-primary">
					<span>Raw list of SDK parts detected.</span>
				</div>
			</a>
		</div>
		{#if Object.keys(packageInfo.sdk_categories).length > 0}
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
		{/if}
	{:else}
		<p>App not yet scanned for SDKs.</p>
		<RequestSDKScanButton />
	{/if}
{/await}
