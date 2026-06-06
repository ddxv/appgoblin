<script lang="ts">
	import type { CompanyFullDetails, CompanyOverviewScope } from '../../../../types';

	import CompanyCategoryControls from '$lib/CompanyCategoryControls.svelte';
	import TotalsBox from '$lib/TotalsBox.svelte';
	import CompanyCategoryPie from '$lib/CompanyCategoryPie.svelte';
	import AdsTxtTotalsBox from '$lib/AdsTxtTotalsBox.svelte';
	import CompanyTableGrid from '$lib/CompanyTableGrid.svelte';
	import HierarchyTree from '$lib/HierarchyTree.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompaniesLayout from '$lib/CompaniesLayout.svelte';
	interface Props {
		data: CompanyFullDetails;
	}

	let { data }: Props = $props();
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
	let hasHierarchyContext = $derived(
		Boolean(data.companyTree.company_domain || data.companyTree.parent)
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
	let categoryControlOverview = $derived(parentOverview ?? domainOverview);
	let activeOverview = $derived(
		selectedOverview === 'parent' ? (parentOverview ?? domainOverview) : domainOverview
	);
	let activeCategoryPromise = $derived(
		selectedOverview === 'parent' && data.parentAppCategories
			? data.parentAppCategories
			: data.companyAppCategories
	);

	const numberFormatter = new Intl.NumberFormat('en-US');
	function formatCount(value: number | null | undefined): string {
		return numberFormatter.format(Math.max(0, Math.round(value ?? 0)));
	}

	function joinWithAnd(items: string[]): string {
		if (items.length === 0) return '';
		if (items.length === 1) return items[0];
		if (items.length === 2) return `${items[0]} and ${items[1]}`;
		return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
	}

	// Human-readable label for the company's primary classification (ad network, analytics, etc.).
	const companyTypeLabels: Record<string, string> = {
		'ad-networks': 'ad network',
		'ad-network': 'ad network',
		attribution: 'attribution provider',
		analytics: 'analytics provider',
		mediation: 'mediation platform',
		'product-analytics': 'product analytics provider'
	};
	let primaryCompanyType = $derived(data.companyDetails?.company_types?.[0] ?? null);
	let companyTypeLabel = $derived(
		primaryCompanyType
			? (companyTypeLabels[primaryCompanyType] ??
					primaryCompanyType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
			: null
	);

	let overviewStats = $derived(activeOverview.categories.all);
	let totalApps = $derived(overviewStats?.total_apps ?? 0);
	let sdkApps = $derived(overviewStats?.sdk_total_apps ?? 0);
	let apiApps = $derived(overviewStats?.api_total_apps ?? 0);
	let adstxtApps = $derived(
		(overviewStats?.adstxt_direct_ios_total_apps ?? 0) +
			(overviewStats?.adstxt_direct_android_total_apps ?? 0) +
			(overviewStats?.adstxt_reseller_ios_total_apps ?? 0) +
			(overviewStats?.adstxt_reseller_android_total_apps ?? 0)
	);

	// Pull a few notable client app names from the top Android/iOS lists for richer, SEO-friendly copy.
	let topApps = $derived(typeof data.companyTopApps === 'string' ? null : data.companyTopApps);
	let notableApps = $derived.by(() => {
		if (!topApps) return [] as string[];
		const androidApps =
			(topApps as { android?: { apps?: { app_name?: string }[] } }).android?.apps ?? [];
		const iosApps = (topApps as { ios?: { apps?: { app_name?: string }[] } }).ios?.apps ?? [];
		const names: string[] = [];
		const seen = new Set<string>();
		for (const app of [...androidApps, ...iosApps]) {
			const name = app?.app_name?.trim();
			if (name && !seen.has(name.toLowerCase())) {
				seen.add(name.toLowerCase());
				names.push(name);
			}
			if (names.length >= 3) break;
		}
		return names;
	});

	let dynamicDescription = $derived.by(() => {
		const subject = companyTypeLabel
			? `${companyName}, a mobile ${companyTypeLabel},`
			: companyName;

		const dataPoints: string[] = [];
		if (sdkApps > 0) dataPoints.push(`${formatCount(sdkApps)} apps with detected SDKs`);
		if (apiApps > 0) dataPoints.push(`${formatCount(apiApps)} apps making API calls`);
		if (adstxtApps > 0) dataPoints.push(`${formatCount(adstxtApps)} app-ads.txt listings`);

		const sentences: string[] = [];

		if (totalApps > 0) {
			const detail = dataPoints.length ? `, including ${joinWithAnd(dataPoints)}` : '';
			sentences.push(`${subject} is tied to ${formatCount(totalApps)} mobile apps${detail}.`);
		} else {
			sentences.push(
				`AppGoblin tracks ${subject} across SDKs, API calls, and app-ads.txt records.`
			);
		}

		if (notableApps.length > 0) {
			sentences.push(`Top apps using ${companyName} include ${joinWithAnd(notableApps)}.`);
		}

		return sentences.join(' ');
	});
</script>

<section class="mb-6 space-y-2">
	<h2 class="text-xl font-semibold">About {companyName}</h2>
	<p class="text-sm">{dynamicDescription}</p>
	<p class="text-sm mb-4">
		AppGoblin intelligence for {companyName} maps SDK integrations, API calls, and app-ads.txt records
		to real mobile app IDs. Explore {companyName} creatives and mediation relationships to evaluate technical
		footprint and competitive position quickly.
	</p>
</section>

{#snippet androidPieContent()}
	{#await activeCategoryPromise}
		<span class="text-lg">Loading...</span>
	{:then myPieData}
		{#if myPieData && 'error' in myPieData}
			<p class="text-red-500 text-center">Failed to load categories.</p>
		{:else if myPieData}
			<CompanyCategoryPie plotData={myPieData.android ?? []} storeLabel="Google Play" />
		{/if}
	{:catch error}
		<p class="text-red-500 text-center">{error.message}</p>
	{/await}
{/snippet}

{#snippet iosPieContent()}
	{#await activeCategoryPromise}
		<span class="text-lg">Loading...</span>
	{:then myPieData}
		{#if myPieData && 'error' in myPieData}
			<p class="text-red-500 text-center">Failed to load categories.</p>
		{:else if myPieData}
			<CompanyCategoryPie plotData={myPieData.ios ?? []} storeLabel="Apple App Store" />
		{/if}
	{:catch error}
		<p class="text-red-500 text-center">{error.message}</p>
	{/await}
{/snippet}

<div class="mb-4 md:mb-6">
	<WhiteCard>
		{#snippet title()}
			<span>{companyName} Apps Overview</span>
		{/snippet}
		<div class="px-4 pt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
			{#if parentOverview}
				<div>
					<span
						class="mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] opacity-60"
						>Scope</span
					>
					<div
						class="inline-flex rounded-md border border-surface-300-700 p-1"
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
			<CompanyCategoryControls overview={categoryControlOverview} compact={true} />
		</div>
		{#if data.companyTree.is_secondary_domain}
			<p class="px-4 pt-4 text-sm text-gray-600">
				This queried domain maps to {data.companyTree.company_name ||
					data.companyTree.company_domain}.
				{#if hasHigherLevelParent}
					The larger parent company is {data.companyTree.parent?.company_name ||
						data.companyTree.parent?.company_domain}.
				{/if}
			</p>
		{/if}
		<div class="grid gap-4 p-4 lg:grid-cols-3">
			<div class="rounded border border-surface-200-800/70">
				<TotalsBox
					{companyName}
					myTotals={activeOverview.categories.all}
					myType={{ name: 'All Companies & Domains', url_slug: 'all-companies' }}
					hideAdstxtApps={true}
					isSecondaryDomain={data.companyTree.is_secondary_domain}
					trendsSummary={activeOverview.trends_summary}
				/>
			</div>
			<div class="rounded border border-surface-200-800/70">
				<AdsTxtTotalsBox
					myTotals={activeOverview.adstxt_ad_domain_overview}
					trendsSummary={activeOverview.trends_summary}
					showReseller={false}
				/>
			</div>
			<div class="rounded border border-surface-200-800/70">
				<AdsTxtTotalsBox myTotals={activeOverview.adstxt_ad_domain_overview} showDirect={false} />
			</div>
		</div>
	</WhiteCard>
</div>

<CompaniesLayout>
	{#snippet card1()}
		{#if !data.companyTree.is_secondary_domain}
			<WhiteCard>
				{#snippet title()}
					<span>{companyName}'s Android Apps by Category</span>
				{/snippet}
				<div>
					{@render androidPieContent()}
				</div>
			</WhiteCard>
		{/if}
	{/snippet}

	{#snippet card2()}
		{#if !data.companyTree.is_secondary_domain}
			<WhiteCard>
				{#snippet title()}
					<span>{companyName}'s iOS Apps by Category</span>
				{/snippet}
				<div>
					{@render iosPieContent()}
				</div>
			</WhiteCard>
		{/if}
	{/snippet}
	{#snippet card3()}
		<WhiteCard>
			{#snippet title()}
				<span>{companyName}'s Related Entities</span>
			{/snippet}
			<div class="p-2">
				{#if hasHierarchyContext}
					<HierarchyTree
						companyTree={data.companyTree}
						{hasHigherLevelParent}
						{queriedIsMappedCompany}
						{associatedDomains}
						showTruncated={true}
					/>
				{/if}

				{#if typeof data.companyTree == 'string'}
					<p class="text-red-500 text-center">Failed to load company tree.</p>
				{:else if data.companyTree.is_orphan}
					<p class="text-sm text-gray-500 text-center">
						This domain has not been mapped to a company yet. If you would like it added, please <a
							href="/contact"
							class="underline hover:text-gray-700">reach out</a
						>.
					</p>
				{:else}
					<!-- REGULAR COMPANY (no child or parent companies) -->
				{/if}
			</div>
		</WhiteCard>
	{/snippet}
</CompaniesLayout>

{#if typeof data.companyTopApps == 'string'}
	Failed to load company's apps.
{:else}
	<CompanyTableGrid tableData={data.companyTopApps} companyName={companyName || ''} />
{/if}
{#if data.companyTree && (associatedDomains.length > 0 || data.companyTree.children.length > 0)}
	<section class="mt-6">
		<h3 class="text-xl font-semibold mb-2">Full Hierarchy</h3>
		<p class="text-sm text-gray-600 mb-3">
			Complete company ownership structure and all associated domains.
		</p>
		<HierarchyTree
			companyTree={data.companyTree}
			{hasHigherLevelParent}
			{queriedIsMappedCompany}
			{associatedDomains}
			showTruncated={false}
		/>
	</section>
{/if}
