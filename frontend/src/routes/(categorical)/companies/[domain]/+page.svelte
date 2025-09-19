<script lang="ts">
	import type { CompanyFullDetails } from '../../../../types';

	import AdsTxtPubIDsTable from '$lib/AdsTxtPubIDsTable.svelte';
	import AppCard from '$lib/AppCard.svelte';

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
				{#if typeof data.companyParentCategories == 'string'}
					<p class="text-red-500 text-center">Failed to load company details.</p>
				{:else if data.companyParentCategories && data.companyParentCategories.length > 0}
					<WhiteCard>
						{#snippet title()}
							<span>Company Apps</span>
						{/snippet}

						<TotalsBox
							myTotals={data.companyDetails.categories.all}
							myType={{ name: 'All Companies & Domains', url_slug: 'all-companies' }}
							hideAdstxtApps={true}
						/>
						{#if data.companyDetails && data.companyDetails.adstxt_ad_domain_overview && data.companyDetails.adstxt_ad_domain_overview.google}
							<AdsTxtTotalsBox myTotals={data.companyDetails.adstxt_ad_domain_overview} />
						{/if}
					</WhiteCard>
				{/if}
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
				{#if typeof data.companyTree == 'string'}
					<p class="text-red-500 text-center">Failed to load company tree.</p>
				{:else if data.companyTree && data.companyTree.children_companies.length > 0}
					<CompanyTree myTree={data.companyTree} />
				{:else if data.companyTree && data.companyTree.parent_company_domain}
					<p class="text-lg font-semibold mb-4">Parent Company:</p>
					<CompanyButton
						companyName={data.companyTree.parent_company_name}
						companyDomain={data.companyTree.parent_company_domain}
						companyLogoUrl={data.companyTree.parent_company_logo_url}
					/>
				{:else}
					<!-- Render nothing if there are no child companies -->
					{#if data.companyTree.is_secondary_domain}
						<p class="text-red-200 text-center">
							This domain is not associated with any other companies yet. If you have information
							about this domain and related SDKs feel free to reach out. Or if you would like this
							domain and related SDKs mapped please contact us.
						</p>
					{/if}
				{/if}
				{#if data.companyTree && data.companyTree.domains && data.companyTree.domains.length > 1}
					<h2 class="text-lg font-semibold mb-4">Associated Domains</h2>
					<div class="flex flex-col gap-1">
						{#each data.companyTree.domains as domain}
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
			</div>
		</WhiteCard>
	{/snippet}
</CompaniesLayout>

{#if !data.companyTree.is_secondary_domain}
	{#if data.companyCreatives && data.companyCreatives.length > 0}
		<WhiteCard>
			{#snippet title()}
				<span>Recent Ads Run by {data.companyTree.queried_company_name}</span>
			{/snippet}
			<div class="grid grid-cols-3 gap-2 p-2">
				{#each data.companyCreatives as creative}
					<card class="card bg-surface-100-900 p-2">
						<AppCard app={creative} showHeader={true} />
						<div class="flex flex-row gap-1">
							<p class="text-primary-600-400">Last Seen:</p>
							{creative.last_seen}
							<p class="text-primary-600-400 ml-2">Creative Type:</p>
							{creative.file_extension}
						</div>
					</card>
				{/each}
			</div>
		</WhiteCard>
	{/if}
{/if}

{#if typeof data.companyTopApps == 'string'}
	Failed to load company's apps.
{:else}
	<CompanyTableGrid
		tableData={data.companyTopApps}
		detailsData={data.companyDetails}
		category="all"
		isSecondaryDomain={data.companyTree.is_secondary_domain}
	/>
{/if}

{#if data.companyDetails && data.companyDetails.adstxt_publishers_overview && data.companyDetails.adstxt_publishers_overview.google.direct && data.companyDetails.adstxt_publishers_overview.apple.direct}
	<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
		<div class="grid md:grid-cols-2 gap-4">
			{#if data.companyDetails.adstxt_publishers_overview.google && data.companyDetails.adstxt_publishers_overview.google.direct}
				<div>
					<h2 class="text-lg font-semibold mb-4">ANDROID DIRECT PUBLISHER IDS</h2>
					<AdsTxtPubIDsTable
						entries_table={data.companyDetails.adstxt_publishers_overview.google.direct}
					/>
				</div>
			{/if}
			{#if data.companyDetails.adstxt_publishers_overview.apple && data.companyDetails.adstxt_publishers_overview.apple.direct}
				<div>
					<h2 class="text-lg font-semibold mb-4">IOS DIRECT PUBLISHER IDS</h2>
					<AdsTxtPubIDsTable
						entries_table={data.companyDetails.adstxt_publishers_overview.apple.direct}
					/>
				</div>
			{/if}
		</div>
	</div>
{/if}

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
