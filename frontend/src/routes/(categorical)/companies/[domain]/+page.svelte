<script lang="ts">
	import type { CompanyFullDetails } from '../../../../types';

	import AdsTxtPubIDsTable from '$lib/AdsTxtPubIDsTable.svelte';

	import TotalsBox from '$lib/TotalsBox.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';
	import CompanyCategoryPie from '$lib/CompanyCategoryPie.svelte';
	import AdsTxtTotalsBox from '$lib/AdsTxtTotalsBox.svelte';
	import CompanyTableGrid from '$lib/CompanyTableGrid.svelte';
	import CompanyTree from '$lib/CompanyTree.svelte';
	import CompanySDKs from '$lib/CompanySDKs.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import CompaniesLayout from '../../../../lib/CompaniesLayout.svelte';
	import { countryCodeToEmoji } from '$lib/utils/countryCodeToEmoji';
	interface Props {
		data: CompanyFullDetails;
	}

	let { data }: Props = $props();
</script>

<CompaniesLayout>
	{#snippet card1()}
		{#if !data.companyTree.is_secondary_domain}
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
		{/if}
	{/snippet}

	{#snippet card2()}
		{#if !data.companyTree.is_secondary_domain}
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
		{/if}
	{/snippet}
	{#snippet card3()}
		<WhiteCard>
			{#snippet title()}
				<span>Related Entities</span>
			{/snippet}
			<div class="p-2">
				{#await data.companyTree}
					<span class="text-lg">Loading...</span>
				{:then myTree}
					{#if typeof myTree == 'string'}
						<p class="text-red-500 text-center">Failed to load company tree.</p>
					{:else if myTree && myTree.children_companies.length > 0}
						<CompanyTree {myTree} />
					{:else if myTree && myTree.parent_company_domain}
						Parent Company: <CompanyButton
							companyName={myTree.parent_company_name}
							companyDomain={myTree.parent_company_domain}
						/>
					{:else}
						<!-- Render nothing if there are no child companies -->
						{#if myTree.is_secondary_domain}
							<p class="text-red-200 text-center">
								This domain is not associated with any other companies yet. If you have information
								about this domain and related SDKs feel free to reach out. Or if you would like this
								domain and related SDKs mapped please contact us.
							</p>
						{/if}
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
						<div class="flex flex-col gap-1">
							{#each myDomains.domains as domain}
								<div class="">
									<!-- Domain URL -->
									<div
										class="font-semibold text-md"
										title={`IP addresses for this domain commonly resolve to: ${domain.country.join(', ')}`}
									>
										<span
											><a href="/companies/{domain.tld_url}">{domain.tld_url}</a>
											<!-- Countries as flags -->
											{#if domain.country.length > 0}
												<span class="gap-2 ml-2">
													{#each domain.country as country}
														<span class="text-lg">{countryCodeToEmoji(country)}</span>
													{/each}
												</span>
											{/if}
										</span>
									</div>
									<!-- Organizations -->
									{#if domain.org.length > 0}
										<div class="text-sm text-gray-600">
											<span class="text-gray-500">{domain.org.join(', ')}</span>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				{:catch error}
					<p class="text-red-500">{error.message}</p>
				{/await}
			</div>
		</WhiteCard>
	{/snippet}
</CompaniesLayout>

{#if !data.companyTree.is_secondary_domain}
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
											src="https://media.appgoblin.info/creatives/thumbs/{creative.md5_hash}.jpg"
											alt="Creative for {creative.advertiser_store_id}"
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
{/if}

{#await data.companyDetails}
	<div><span>Loading...</span></div>
{:then detailsData}
	{#await data.companyTopApps}
		<div><span>Loading...</span></div>
	{:then tableData}
		{#if typeof tableData == 'string'}
			Failed to load company's apps.
		{:else}
			<CompanyTableGrid
				{tableData}
				{detailsData}
				category="all"
				isSecondaryDomain={data.companyTree.is_secondary_domain}
			/>
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

{#if !data.companyTree.is_secondary_domain}
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
{/if}
