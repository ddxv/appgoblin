<script lang="ts">
	import CompaniesLayout from '$lib/CompaniesLayout.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompaniesBarChart from '$lib/CompaniesBarChart.svelte';
	import TotalsBox from '$lib/TotalsBox.svelte';
	import { page } from '$app/state';

	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let currentType = $derived(
		page.data.companyTypes.types.find(
			(type: { url_slug: string }) => type.url_slug === page.params.type
		) || { name: 'All Companies & Domains', url_slug: 'all-companies' }
	);

	let currentCategoryName = $derived(getCategoryName(page.params.category));

	function getCategoryName(category: string | undefined) {
		return (
			page.data?.appCats?.categories?.find((cat: { id: string }) => cat.id == category)?.name ||
			category ||
			'All'
		);
	}
</script>

<div class="flex items-center mb-2">
	<h1 class="h1 text-3xl font-bold text-primary-900-100">
		<span class="text-primary-700-300">{currentType ? currentType.name : ''}</span>
		for
		<span class="text-primary-700-300">{currentCategoryName ? currentCategoryName : 'All'}</span>
		Apps
	</h1>
</div>

<CompaniesLayout>
	{#snippet card1()}
		<WhiteCard>
			{#snippet title()}
				Totals
			{/snippet}
			{#if typeof page.data.companiesOverview == 'string'}
				<p class="text-red-500 text-center">Failed to load company details.</p>
			{:else}
				<TotalsBox
					myTotals={page.data.companiesOverview.categories.categories.all}
					myType={currentType}
				/>
			{/if}
		</WhiteCard>
	{/snippet}

	{#snippet card2()}
		<WhiteCard>
			{#snippet title()}
				Top Companies (Android SDKs)
			{/snippet}
			<CompaniesBarChart plotData={page.data.companiesOverview.top.sdk_android} />
		</WhiteCard>
	{/snippet}
	{#snippet card3()}
		<WhiteCard>
			{#snippet title()}
				Top Companies (iOS SDKs)
			{/snippet}
			<CompaniesBarChart plotData={page.data.companiesOverview.top.sdk_ios} />
		</WhiteCard>
	{/snippet}
</CompaniesLayout>

<main>
	<!-- +page.svelte is `@render`ed here -->
	{@render children()}
</main>
