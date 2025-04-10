<script lang="ts">
	import type { CompaniesOverview } from '../../../types';
	import CompaniesOverviewTable from '$lib/CompaniesOverviewTable.svelte';
	import CompaniesBarChart from '$lib/CompaniesBarChart.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompaniesLayout from '$lib/CompaniesLayout.svelte';
	import CompaniesTableGrid from '$lib/CompaniesTableGrid.svelte';
	import TotalsBox from '$lib/TotalsBox.svelte';
	interface Props {
		data: CompaniesOverview;
	}

	let { data }: Props = $props();

	function formatNumber(num: number) {
		return new Intl.NumberFormat('en-US').format(num);
	}
	const title = 'Top Mobile Ad Networks, Development Tools & MMPs | AppGoblin Free Marketing Tools';
	const description =
		'Explore top mobile adtech advertising networks, data trackers, MMPs, and programmatic networks based on SDK data and app-ads.txt files. Covering hundreds of companies and millions of apps all for free.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="mobile, development tools, ad networks, data trackers, MMPs, programmatic networks, app-ads.txt, mobile advertising, ad tech analytics, app marketing, AppGoblin"
	/>
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta property="og:image" content="https://appgoblin.info/adtech-companies-banner.png" />
	<meta property="og:url" content="https://appgoblin.info/companies" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://appgoblin.info/adtech-companies-banner.png" />
	<link rel="canonical" href="https://appgoblin.info/companies" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="flex items-center mb-2">
	<h1 class="h1 text-3xl font-bold text-primary-900-100">Companies Overview</h1>
	<div class="h-8 w-px bg-gray-300 mx-2"></div>
</div>
{#await data.companiesOverview}
	<div class="card preset-tonal p-6 rounded-lg shadow-md flex justify-center items-center h-40">
		<span class="text-lg">Loading...</span>
	</div>
{:then myData}
	{#if typeof myData == 'string'}
		<p class="text-red-500 text-center">Failed to load companies details.</p>
	{:else if myData && myData.categories}
		<CompaniesLayout>
			{#snippet card1()}
				<WhiteCard>
					{#snippet title()}
						Totals
					{/snippet}
					<TotalsBox
						myTotals={myData.categories.categories.all}
						myType={{ name: 'All Companies & Domains', url_slug: 'all-companies' }}
					/>
				</WhiteCard>
			{/snippet}

			{#snippet card2()}
				<WhiteCard>
					{#snippet title()}
						Top Companies (Android SDKs)
					{/snippet}

					<CompaniesBarChart plotData={myData.top.sdk_android} />
				</WhiteCard>
			{/snippet}
			{#snippet card3()}
				<WhiteCard>
					{#snippet title()}
						Top Companies (iOS SDKs)
					{/snippet}
					<CompaniesBarChart plotData={myData.top.sdk_ios} />
				</WhiteCard>
			{/snippet}
		</CompaniesLayout>
	{/if}
{:catch error}
	<p class="text-red-500 text-center">{error.message}</p>
{/await}

{#await data.companiesOverview}
	<div><span>Loading...</span></div>
{:then tableData}
	{#if typeof tableData == 'string'}
		Failed to load companies.
	{:else if tableData.categories}
		<CompaniesTableGrid>
			{#snippet mainTable()}
				{#if tableData && tableData.companies_overview.length > 0}
					<CompaniesOverviewTable data={tableData.companies_overview} />
				{/if}
			{/snippet}

			{#snippet sdkAndroidTotalApps()}
				Android Companies: {formatNumber(
					tableData.categories.categories.all.sdk_android_total_companies
				)}
			{/snippet}
			{#snippet sdkIosTotalApps()}
				iOS Companies: {formatNumber(tableData.categories.categories.all.sdk_ios_total_companies)}
			{/snippet}
			{#snippet adstxtAndroidTotalApps()}
				Android Companies: {formatNumber(
					tableData.categories.categories.all.adstxt_direct_android_total_companies
				)}
			{/snippet}
			{#snippet adstxtIosTotalApps()}
				iOS Companies: {formatNumber(
					tableData.categories.categories.all.adstxt_direct_ios_total_companies
				)}
			{/snippet}
		</CompaniesTableGrid>
	{/if}
{/await}
