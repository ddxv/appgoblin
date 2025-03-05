<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';

	import { page } from '$app/state';

	let { myAdsTxt } = $props();
</script>

<h4 class="h4 md:h3 p-2">App-Ads.txt Overview</h4>

{#await myAdsTxt}
	Loading permissions and tracker data...
{:then adsTxt}
	{#if typeof adsTxt == 'string'}
		<p>App-Ads.txt data not found on the developer's website.</p>
	{:else if adsTxt && (adsTxt.direct_entries || adsTxt.reseller_entries)}
		<div class="p-2 md:py-2">
			These are the publisher IDs and networks found for this app in the app-ads.txt file hosted on
			the developer's website.
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
			<WhiteCard>
				{#snippet title()}
					DIRECT
				{/snippet}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
					{#if adsTxt.direct_entries && adsTxt.direct_entries.length > 0}
						{#each adsTxt.direct_entries as company}
							<CompanyButton
								companyName={company.company_name}
								companyDomain={company.company_domain}
							/>
						{/each}
					{:else}
						<p>No Direct entries found.</p>
					{/if}
				</div>
			</WhiteCard>
			<WhiteCard>
				{#snippet title()}
					RESELLER
				{/snippet}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
					{#if adsTxt.reseller_entries && adsTxt.reseller_entries.length > 0}
						{#each adsTxt.reseller_entries as company}
							<CompanyButton
								companyName={company.name ? company.name : company.company_domain}
								companyDomain={company.company_domain}
							/>
						{/each}
					{:else}
						<p>No Reseller entries found.</p>
					{/if}
				</div>
			</WhiteCard>
		</div>

		<div class="p-2 md:py-2">
			<a href="/apps/{page.params.id}/ads-txt">
				<div class="btn preset-tonal hover:preset-tonal-primary">
					<span>View full publisher IDs and networks for this app.</span>
				</div>
			</a>
		</div>
	{:else}
		<p>No App-Ads.txt found for this app.</p>
	{/if}
{/await}
