<script lang="ts">
	import type { CompanyFullDetails } from '../../../../types';

	import AdsTxtPubIDsTable from '$lib/AdsTxtPubIDsTable.svelte';

	import TotalsBox from '$lib/TotalsBox.svelte';

	import CompanyCategoryPie from '$lib/CompanyCategoryPie.svelte';
	import AdsTxtTotalsBox from '$lib/AdsTxtTotalsBox.svelte';
	import CompanyTableGrid from '$lib/CompanyTableGrid.svelte';
	import CompanyTree from '$lib/CompanyTree.svelte';
	import CompanySDKs from '$lib/CompanySDKs.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompaniesLayout from '../../../../lib/CompaniesLayout.svelte';
	import CompanyCreativeRankingsTableTop from '$lib/CompanyCreativeRankingsTableTop.svelte';
	interface Props {
		data: CompanyFullDetails;
	}

	let { data }: Props = $props();

	function countryCodeToEmoji(code: string): string {
		if (!code) return '';
		return (
			code
				.toUpperCase()
				.split('')
				.map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
				.join('') || ''
		);
	}
</script>

<CompaniesLayout>
	{#snippet card1()}
		<WhiteCard>
			{#await data.companyParentCategories}
				<span class="text-lg">Loading...</span>
			{:then myData}
				{#if typeof myData == 'string'}
					<p class="text-red-500 text-center">Failed to load company details.</p>
				{:else if myData && myData.length > 0}
					<WhiteCard>
						{#snippet title()}
							<span>Company Apps</span>
						{/snippet}

						{#await data.companyDetails}
							<div><span>Loading...</span></div>
						{:then detailsData}
							<TotalsBox
								myTotals={detailsData.categories.all}
								myType={{ name: 'All Companies & Domains', url_slug: 'all-companies' }}
								hideAdstxtApps={true}
							/>
							{#if detailsData && detailsData.adstxt_ad_domain_overview && detailsData.adstxt_ad_domain_overview.google}
								<AdsTxtTotalsBox myTotals={detailsData.adstxt_ad_domain_overview} />
							{/if}
						{/await}
					</WhiteCard>
				{/if}
			{:catch error}
				<p class="text-red-500 text-center">{error.message}</p>
			{/await}
		</WhiteCard>
	{/snippet}

	{#snippet card2()}
		<WhiteCard>
			{#snippet title()}
				<span>Apps by Category</span>
			{/snippet}
			<div>
				{#await data.companyParentCategories}
					<span class="text-lg">Loading...</span>
				{:then myPieData}
					{#if typeof myPieData == 'string'}
						<p class="text-red-500 text-center">Failed to load parent categories.</p>
					{:else if myPieData}
						<CompanyCategoryPie plotData={myPieData} />
					{/if}
				{:catch error}
					<p class="text-red-500 text-center">{error.message}</p>
				{/await}
			</div>
		</WhiteCard>
	{/snippet}

	{#snippet card3()}
		<WhiteCard>
			{#snippet title()}
				<span>Subsidiary Companies</span>
			{/snippet}
			{#await data.companyTree}
				<span class="text-lg">Loading...</span>
			{:then myTree}
				{#if typeof myTree == 'string'}
					<p class="text-red-500 text-center">Failed to load company tree.</p>
				{:else if myTree && myTree.children_companies.length > 0}
					<CompanyTree {myTree} />
				{:else}
					<!-- Render nothing if there are no child companies -->
				{/if}
			{:catch error}
				<p class="text-red-500 text-center">{error.message}</p>
			{/await}

			{#await data.companyDomains}
				<span class="text-lg">Loading...</span>
			{:then myDomains}
				{#if typeof myDomains == 'string'}
					<p class="text-red-500">Failed to load company domains.</p>
				{:else if myDomains && myDomains.domains && myDomains.domains.length > 1}
					<h2 class="text-lg font-semibold mb-4">Associated Domains</h2>

					<div class="flex flex-col gap-2">
						{#each myDomains.domains as domain}
							<span
								class="text-md p-2"
								title={`IP addresses for this domain commonly resolve to: ${domain.country}`}
							>
								{countryCodeToEmoji(domain.country)}
								{domain.tld_url}
							</span>
						{/each}
					</div>
				{/if}
			{:catch error}
				<p class="text-red-500">{error.message}</p>
			{/await}
		</WhiteCard>
	{/snippet}
</CompaniesLayout>

{#await data.companyCreatives}
	<div><span>Loading...</span></div>
{:then myCreatives}
	{#if myCreatives && myCreatives.length > 0}
		<WhiteCard>
			{#snippet title()}
				<span>Recent Advertised Creatives</span>
			{/snippet}
			<div class="grid grid-cols-3 gap-2 p-2">
				{#each myCreatives as creative}
					<div class="flex flex-row gap-2 mt-8">
						<a href="/apps/{creative.advertiser_store_id}/ad-placements">
							<div class="col-1">
								<img
									src={creative.icon_url_512}
									alt={creative.advertiser_store_id}
									class="w-8 md:w-16 h-auto object-cover rounded"
									referrerpolicy="no-referrer"
								/>
							</div>
						</a>
						<div class="overvlow-y-auto">
							<div class="grid grid-cols-2 md:grid-cols-4 gap-1">
								<a href="/apps/{creative.advertiser_store_id}/ad-placements">
									<img
										src="https://appgoblin-data.sgp1.digitaloceanspaces.com/creatives/thumbs/{creative.md5_hash}.jpg"
										alt=""
										class="w-12 md:w-24 h-auto"
									/>
								</a>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</WhiteCard>
	{/if}
{/await}

{#await data.companyDetails}
	<div><span>Loading...</span></div>
{:then detailsData}
	{#await data.companyTopApps}
		<div><span>Loading...</span></div>
	{:then tableData}
		{#if typeof tableData == 'string'}
			Failed to load company's apps.
		{:else}
			<CompanyTableGrid {tableData} {detailsData} category="all" />
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
	{#if detailsData && detailsData.adstxt_publishers_overview && detailsData.adstxt_publishers_overview.google && detailsData.adstxt_publishers_overview.apple}
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<div class="grid md:grid-cols-2 gap-4">
				<div>
					<h2 class="text-lg font-semibold mb-4">ANDROID DIRECT PUBLISHER IDS</h2>
					<AdsTxtPubIDsTable entries_table={detailsData.adstxt_publishers_overview.google.direct} />
				</div>
				<div>
					<h2 class="text-lg font-semibold mb-4">IOS DIRECT PUBLISHER IDS</h2>
					<AdsTxtPubIDsTable entries_table={detailsData.adstxt_publishers_overview.apple.direct} />
				</div>
			</div>
		</div>
	{/if}
{/await}

<WhiteCard>
	{#snippet title()}
		<span>Company SDKs</span>
	{/snippet}
	{#await data.companySdks}
		<span class="text-lg">Loading...</span>
	{:then mySdks}
		{#if typeof mySdks == 'string'}
			<p class="text-red-500 text-center">Failed to load company SDKs.</p>
		{:else if mySdks}
			<CompanySDKs {mySdks} />
		{/if}
	{/await}
</WhiteCard>
