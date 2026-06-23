<script lang="ts">
	import { page } from '$app/state';
	import CompaniesOverviewTable from '$lib/CompaniesOverviewTable.svelte';
	import CompaniesTableGrid from '$lib/CompaniesTableGrid.svelte';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let typeName = $derived(
		page.data.companyTypes?.types?.find((t: any) => t.url_slug === page.params.type)?.name ||
			page.params.type ||
			'Companies'
	);
</script>

<svelte:head>
	<title>{typeName} Companies & Domains | AppGoblin</title>
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

{#if typeof data.companiesOverview == 'string'}
	Failed to load companies.
{:else if data.companiesOverview.categories}
	<CompaniesTableGrid>
		{#snippet mainTable()}
			{#if data.companiesOverview && data.companiesOverview.companies_overview.length > 0}
				<CompaniesOverviewTable data={data.companiesOverview.companies_overview} />
			{/if}
		{/snippet}
	</CompaniesTableGrid>
{/if}
