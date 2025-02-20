<script lang="ts">
	import type { CompanyCategoryDetails } from '../../../../../types';
	import { page } from '$app/state';

	import CompaniesLayout from '$lib/CompaniesLayout.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	import CompanyTableGrid from '$lib/CompanyTableGrid.svelte';
	interface Props {
		data: CompanyCategoryDetails;
	}

	let { data }: Props = $props();

	let company_category = $derived(page.params.category);

	function formatNumber(num: number) {
		return new Intl.NumberFormat('en-US').format(num);
	}
</script>

<CompaniesLayout>
	{#snippet card1()}
		<WhiteCard>
			{#await data.companyDetails}
				<div class="p-6 rounded-lg shadow-md flex justify-center items-center h-40">
					<span class="text-lg">Loading company info...</span>
				</div>
			{:then myData}
				{#if typeof myData == 'string'}
					<p class="text-red-500 text-center">Failed to load company details.</p>
				{:else if myData}
					<div class="p-6 rounded-lg shadow-md">
						<h2 class="text-xl font-bold text-primary-900-100 mb-4">Total Apps</h2>
						<p class="text-lg">
							<span class="font-semibold text-primary-900-100"
								>{formatNumber(myData.categories[company_category]?.total_apps || 0)}</span
							>
						</p>
					</div>
				{/if}
			{:catch error}
				<p class="text-red-500 text-center">{error.message}</p>
			{/await}
		</WhiteCard>
	{/snippet}
</CompaniesLayout>

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
