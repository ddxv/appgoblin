<script lang="ts">
	import type { CompanyCategoryDetails } from '../../../../../types';
	import { page } from '$app/state';

	import TotalsBox from '$lib/TotalsBox.svelte';
	import CompaniesLayout from '$lib/CompaniesLayout.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompanyTableGrid from '$lib/CompanyTableGrid.svelte';
	interface Props {
		data: CompanyCategoryDetails;
	}

	let { data }: Props = $props();

	let company_category = $derived(page.params.category!);
</script>

{#await data.companyDetails}
	<div class="p-6 rounded-lg shadow-md flex justify-center items-center h-40">
		<span class="text-lg">Loading company info...</span>
	</div>
{:then myData}
	<CompaniesLayout>
		{#snippet card1()}
			<WhiteCard>
				{#snippet title()}
					Totals
				{/snippet}
				{#if myData.categories[company_category]}
					<TotalsBox
						myTotals={myData.categories[company_category]}
						myType={{ name: 'All Companies & Domains', url_slug: 'all-companies' }}
					/>
				{:else}
					<p>
						No apps found for
						<span class="text-primary-900-100 font-bold">{company_category}</span>
						category
					</p>
				{/if}
			</WhiteCard>
		{/snippet}
	</CompaniesLayout>
{:catch error}
	<p class="text-red-500 text-center">{error.message}</p>
{/await}

{#await data.companyDetails}
	<div><span>Loading company apps...</span></div>
{:then detailsData}
	{#await data.companyCategoryApps}
		<div><span>Loading apps ...</span></div>
	{:then tableData}
		{#if typeof tableData == 'string'}
			Failed to load company's apps.
		{:else}
			<CompanyTableGrid {tableData} {detailsData} category={company_category} />
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
{/await}
