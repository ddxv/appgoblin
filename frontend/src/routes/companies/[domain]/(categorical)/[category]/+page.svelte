<script lang="ts">
	import type { CompanyCategoryDetails, CompanyOverviewScope } from '../../../../../types';
	import { page } from '$app/state';

	import CompanyCategoryControls from '$lib/CompanyCategoryControls.svelte';
	import TotalsBox from '$lib/TotalsBox.svelte';
	import CompaniesLayout from '$lib/CompaniesLayout.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompanyTableGrid from '$lib/CompanyTableGrid.svelte';
	import HierarchyTree from '$lib/HierarchyTree.svelte';
	interface Props {
		data: CompanyCategoryDetails;
	}

	let { data }: Props = $props();

	let company_category = $derived(page.params.category!);
	let companyName = $derived(
		data.companyTree.is_secondary_domain
			? data.companyTree.queried_domain
			: data.companyTree.company_name ||
					data.companyTree.company_domain ||
					data.companyTree.queried_domain
	);
	let hasHigherLevelParent = $derived(
		Boolean(
			data.companyTree.parent &&
			data.companyTree.parent.company_domain !== data.companyTree.company_domain
		)
	);
	let queriedIsMappedCompany = $derived(
		data.companyTree.queried_domain === data.companyTree.company_domain
	);
	let associatedDomains = $derived(data.companyTree?.domains ?? []);
	type OverviewTab = 'domain' | 'parent';
	let selectedOverview = $state<OverviewTab>('domain');
	$effect(() => {
		data.companyTree.queried_domain;
		selectedOverview = data.companyDetails.parent_overview ? 'parent' : 'domain';
	});
	let fallbackOverview = $derived({
		categories: data.companyDetails.categories,
		adstxt_ad_domain_overview: data.companyDetails.adstxt_ad_domain_overview,
		adstxt_publishers_overview: data.companyDetails.adstxt_publishers_overview,
		trends_summary: data.companyDetails.trends_summary ?? null
	} as CompanyOverviewScope);
	let domainOverview = $derived(data.companyDetails.domain_overview ?? fallbackOverview);
	let parentOverview = $derived(data.companyDetails.parent_overview ?? null);
	let activeOverview = $derived(
		selectedOverview === 'parent' ? (parentOverview ?? domainOverview) : domainOverview
	);
</script>

<section class="mb-6 space-y-2">
	<h2 class="text-xl font-semibold">Category Breakdown</h2>
	<p class="text-sm text-gray-600">
		Review totals, related entities, and app-level records for the selected company category.
	</p>
</section>

<CompaniesLayout>
	{#snippet card1()}
		<WhiteCard>
			{#snippet title()}
				{companyName}'s Totals
			{/snippet}
			<div class="px-4 pt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
				{#if parentOverview}
					<div>
						<span
							class="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] opacity-60"
							>Scope</span
						>
						<div
							class="inline-flex rounded-lg border border-surface-300-700 p-1"
							role="radiogroup"
							aria-label="Overview scope"
						>
							<button
								type="button"
								class={`flex items-center justify-center gap-1 rounded-md px-2.5 py-1 text-sm transition ${selectedOverview === 'parent' ? 'border border-secondary-700-300 text-secondary-700-300' : 'border border-transparent hover:border-secondary-800-200 hover:text-secondary-800-200'}`}
								role="radio"
								aria-checked={selectedOverview === 'parent'}
								onclick={() => (selectedOverview = 'parent')}
							>
								Parent
							</button>
							<button
								type="button"
								class={`flex items-center justify-center gap-1 rounded-md px-2.5 py-1 text-sm transition ${selectedOverview === 'domain' ? 'border border-secondary-700-300 text-secondary-700-300' : 'border border-transparent hover:border-secondary-800-200 hover:text-secondary-800-200'}`}
								role="radio"
								aria-checked={selectedOverview === 'domain'}
								onclick={() => (selectedOverview = 'domain')}
							>
								Domain
							</button>
						</div>
					</div>
				{/if}
				<CompanyCategoryControls overview={parentOverview ?? domainOverview} compact={true} />
			</div>
			{#if activeOverview.categories[company_category]}
				<TotalsBox
					{companyName}
					myTotals={activeOverview.categories[company_category]}
					myType={{ name: 'All Companies & Domains', url_slug: 'all-companies' }}
					isSecondaryDomain={data.companyTree.is_secondary_domain}
					trendsSummary={activeOverview.trends_summary}
				/>
			{:else}
				<p>
					No apps found for
					<span class=" font-bold">{company_category}</span>
					category
				</p>
			{/if}
		</WhiteCard>
	{/snippet}
	{#snippet card3()}
		{#if data.companyTree.company_domain || data.companyTree.parent}
			<WhiteCard>
				{#snippet title()}
					<span>{companyName}'s Related Entities</span>
				{/snippet}
				<div class="p-2">
					<p class="text-xs font-semibold uppercase tracking-wide mb-2">Hierarchy</p>
					<div class="rounded border border-surface-200-800 p-3">
						<HierarchyTree
							companyTree={data.companyTree}
							{hasHigherLevelParent}
							{queriedIsMappedCompany}
							{associatedDomains}
							showTruncated={true}
						/>
					</div>
				</div>
			</WhiteCard>
		{/if}
	{/snippet}
</CompaniesLayout>

<CompanyTableGrid tableData={data.companyCategoryApps} companyName={companyName || ''} />

{#if associatedDomains.length > 0 || data.companyTree.children.length > 0}
	<section class="mt-6">
		<h3 class="text-xl font-semibold mb-2">Full Hierarchy</h3>
		<p class="text-sm text-gray-600 mb-3">
			Complete company ownership structure and all associated domains.
		</p>
		<div class="p-4 rounded-md border border-surface-200-800">
			<HierarchyTree
				companyTree={data.companyTree}
				{hasHigherLevelParent}
				{queriedIsMappedCompany}
				{associatedDomains}
				showTruncated={false}
			/>
		</div>
	</section>
{/if}
