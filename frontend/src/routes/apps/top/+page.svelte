<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';
	import Filter from 'lucide-svelte/icons/filter';
	import Search from 'lucide-svelte/icons/search';
	import Loader2 from 'lucide-svelte/icons/loader-2';
	import Download from 'lucide-svelte/icons/download';
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw';
	import { formatNumber } from '$lib/utils/formatNumber';

	interface Company {
		company_name: string;
		company_domain: string;
		total_apps: number;
	}

	interface App {
		id: number;
		store_id: string;
		name: string;
		installs: number;
		rating_count: number;
		in_app_purchases: boolean;
		ad_supported: boolean;
		store: number;
	}

	let { data } = $props();

	// Safely access companies with fallback to empty array
	let companies = $derived<Company[]>(data.companies ?? []);

	// Filter state
	let includeDomains = $state<string[]>([]);
	let excludeDomains = $state<string[]>([]);
	let requireSdkApi = $state(false);
	let requireIap = $state(false);
	let requireAds = $state(false);

	// Default to 6 months ago
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
	let myDate = $state(sixMonthsAgo.toISOString().split('T')[0]);

	// Search state for dropdowns
	let includeSearch = $state('');
	let excludeSearch = $state('');
	let includeDropdownOpen = $state(false);
	let excludeDropdownOpen = $state(false);

	// Results state
	let apps = $state<App[]>([]);
	let isLoading = $state(false);
	let hasSearched = $state(false);
	let errorMessage = $state('');

	// Filtered companies for dropdowns - with null safety
	let filteredIncludeCompanies = $derived(() => {
		if (!companies || companies.length === 0) return [];
		const searchLower = (includeSearch ?? '').toLowerCase();
		return companies
			.filter((c) => {
				if (!c?.company_name || !c?.company_domain) return false;
				return (
					c.company_name.toLowerCase().includes(searchLower) ||
					c.company_domain.toLowerCase().includes(searchLower)
				);
			})
			.filter((c) => !includeDomains.includes(c.company_domain))
			.slice(0, 25);
	});

	let filteredExcludeCompanies = $derived(() => {
		if (!companies || companies.length === 0) return [];
		const searchLower = (excludeSearch ?? '').toLowerCase();
		return companies
			.filter((c) => {
				if (!c?.company_name || !c?.company_domain) return false;
				return (
					c.company_name.toLowerCase().includes(searchLower) ||
					c.company_domain.toLowerCase().includes(searchLower)
				);
			})
			.filter((c) => !excludeDomains.includes(c.company_domain))
			.slice(0, 25);
	});

	function addIncludeDomain(domain: string) {
		if (domain && !includeDomains.includes(domain)) {
			includeDomains = [...includeDomains, domain];
		}
		includeSearch = '';
		includeDropdownOpen = false;
	}

	function removeIncludeDomain(domain: string) {
		includeDomains = includeDomains.filter((d) => d !== domain);
	}

	function addExcludeDomain(domain: string) {
		if (domain && !excludeDomains.includes(domain)) {
			excludeDomains = [...excludeDomains, domain];
		}
		excludeSearch = '';
		excludeDropdownOpen = false;
	}

	function removeExcludeDomain(domain: string) {
		excludeDomains = excludeDomains.filter((d) => d !== domain);
	}

	function resetFilters() {
		includeDomains = [];
		excludeDomains = [];
		requireSdkApi = false;
		requireIap = false;
		requireAds = false;
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
		myDate = sixMonthsAgo.toISOString().split('T')[0];
		apps = [];
		hasSearched = false;
		errorMessage = '';
	}

	async function searchApps() {
		if (includeDomains.length === 0) {
			errorMessage = 'Please select at least one company to include';
			return;
		}

		isLoading = true;
		hasSearched = true;
		errorMessage = '';

		try {
			const response = await fetch('/api/apps/crossfilter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					include_domains: includeDomains,
					exclude_domains: excludeDomains,
					require_sdk_api: requireSdkApi,
					require_iap: requireIap,
					require_ads: requireAds,
					mydate: myDate
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || `Server error: ${response.status}`);
			}

			const result = await response.json();
			apps = result.apps || [];

			if (apps.length === 0) {
				errorMessage = 'No apps found matching your criteria. Try broadening your filters.';
			}
		} catch (error) {
			console.error('Search error:', error);
			errorMessage =
				error instanceof Error ? error.message : 'Failed to load apps. Please try again.';
			apps = [];
		} finally {
			isLoading = false;
		}
	}

	function getCompanyName(domain: string): string {
		if (!domain) return 'Unknown';
		const company = companies.find((c) => c?.company_domain === domain);
		return company?.company_name || domain;
	}

	function getStoreName(store: number): string {
		return store === 1 ? 'Google Play' : store === 2 ? 'App Store' : 'Unknown';
	}

	function exportToCSV() {
		if (apps.length === 0) return;

		const headers = ['Rank', 'App Name', 'Store ID', 'Store', 'Installs', 'Ratings', 'IAP', 'Ads'];
		const rows = apps.map((app, i) => [
			i + 1,
			`"${(app.name || '').replace(/"/g, '""')}"`,
			app.store_id,
			getStoreName(app.store),
			app.installs || 0,
			app.rating_count || 0,
			app.in_app_purchases ? 'Yes' : 'No',
			app.ad_supported ? 'Yes' : 'No'
		]);

		const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `appgoblin-crossfilter-${new Date().toISOString().split('T')[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<svelte:head>
	<title>Top Apps Analytics - AppGoblin</title>
	<meta
		name="description"
		content="Find top apps by SDK usage, monetization, and more. Filter by companies, IAP, ads, and SDK presence."
	/>
</svelte:head>

<div class="container mx-auto px-2 md:px-4 py-4 md:py-8">
	<div class="mb-6">
		<h1 class="text-2xl md:text-3xl font-bold text-primary-900-100">Top Apps Analytics</h1>
		<p class="text-sm md:text-base text-surface-600-400 mt-2">
			Find apps using specific SDKs, ad networks, and monetization strategies. Filter by company
			presence, in-app purchases, and ad support.
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 md:gap-6">
		<!-- Sidebar Filters -->
		<aside class="card preset-tonal p-4 space-y-5 h-fit lg:sticky lg:top-20">
			<div class="flex items-center gap-2 pb-3 border-b border-surface-300-700">
				<Filter size={20} class="text-primary-500" />
				<h2 class="text-lg font-semibold">Filters</h2>
			</div>

			<!-- Include Companies -->
			<div class="space-y-2">
				<label class="label font-medium text-sm" for="include-search">Include Companies (Required)</label>
				<p class="text-xs text-surface-500">Apps must use ALL selected SDKs/companies</p>
				<div class="relative">
					<input
						type="text"
						id="include-search"
						class="input text-sm"
						placeholder="Search companies..."
						bind:value={includeSearch}
						onfocus={() => (includeDropdownOpen = true)}
						onblur={() => setTimeout(() => (includeDropdownOpen = false), 200)}
					/>
					{#if includeDropdownOpen && filteredIncludeCompanies().length > 0}
						<div
							class="absolute z-50 w-full mt-1 bg-surface-100-900 border border-surface-300-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
						>
							{#each filteredIncludeCompanies() as company (company.company_domain)}
								<button
									type="button"
									class="w-full px-3 py-2 text-left text-sm hover:bg-surface-200-800 flex justify-between items-center"
									onmousedown={() => addIncludeDomain(company.company_domain)}
								>
									<span>{company.company_name}</span>
									<span class="text-xs text-surface-500">{formatNumber(company.total_apps)} apps</span
									>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				{#if includeDomains.length > 0}
					<div class="flex flex-wrap gap-1 mt-2">
						{#each includeDomains as domain}
							<span
								class="badge preset-filled-primary-500 text-xs flex items-center gap-1 px-2 py-1"
							>
								{getCompanyName(domain)}
								<button type="button" onclick={() => removeIncludeDomain(domain)} class="ml-1">
									<X size={12} />
								</button>
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Exclude Companies -->
			<div class="space-y-2">
				<label class="label font-medium text-sm" for="exclude-search">Exclude Companies</label>
				<p class="text-xs text-surface-500">Apps must NOT use any of these</p>
				<div class="relative">
					<input
						type="text"
						id="exclude-search"
						class="input text-sm"
						placeholder="Search companies to exclude..."
						bind:value={excludeSearch}
						onfocus={() => (excludeDropdownOpen = true)}
						onblur={() => setTimeout(() => (excludeDropdownOpen = false), 200)}
					/>
					{#if excludeDropdownOpen && filteredExcludeCompanies().length > 0}
						<div
							class="absolute z-50 w-full mt-1 bg-surface-100-900 border border-surface-300-700 rounded-lg shadow-lg max-h-48 overflow-y-auto"
						>
							{#each filteredExcludeCompanies() as company (company.company_domain)}
								<button
									type="button"
									class="w-full px-3 py-2 text-left text-sm hover:bg-surface-200-800 flex justify-between items-center"
									onmousedown={() => addExcludeDomain(company.company_domain)}
								>
									<span>{company.company_name}</span>
									<span class="text-xs text-surface-500">{formatNumber(company.total_apps)} apps</span
									>
								</button>
							{/each}
						</div>
					{/if}
				</div>
				{#if excludeDomains.length > 0}
					<div class="flex flex-wrap gap-1 mt-2">
						{#each excludeDomains as domain}
							<span class="badge preset-filled-error-500 text-xs flex items-center gap-1 px-2 py-1">
								{getCompanyName(domain)}
								<button type="button" onclick={() => removeExcludeDomain(domain)} class="ml-1">
									<X size={12} />
								</button>
							</span>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Detection Type -->
			<div class="space-y-2">
				<span class="label font-medium text-sm">Detection Requirements</span>
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" class="checkbox" bind:checked={requireSdkApi} />
					<span class="text-sm">Require SDK or API detection</span>
				</label>
			</div>

			<!-- Monetization Filters -->
			<div class="space-y-2">
				<span class="label font-medium text-sm">Monetization</span>
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" class="checkbox" bind:checked={requireIap} />
					<span class="text-sm">Has In-App Purchases</span>
				</label>
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" class="checkbox" bind:checked={requireAds} />
					<span class="text-sm">Has Ads</span>
				</label>
			</div>

			<!-- Date Filter -->
			<div class="space-y-2">
				<label class="label font-medium text-sm" for="date-filter">Last Updated After</label>
				<input type="date" id="date-filter" class="input text-sm" bind:value={myDate} />
			</div>

			<!-- Action Buttons -->
			<div class="space-y-2">
				<button
					class="btn preset-filled-primary-500 w-full flex items-center justify-center gap-2"
					onclick={searchApps}
					disabled={isLoading || includeDomains.length === 0}
				>
					{#if isLoading}
						<Loader2 size={18} class="animate-spin" />
						Searching...
					{:else}
						<Search size={18} />
						Find Apps
					{/if}
				</button>

				<button
					class="btn preset-tonal w-full flex items-center justify-center gap-2 text-sm"
					onclick={resetFilters}
					disabled={isLoading}
				>
					<RotateCcw size={16} />
					Reset Filters
				</button>
			</div>

			{#if errorMessage}
				<p class="text-error-500 text-sm text-center">{errorMessage}</p>
			{/if}

			<!-- Filter Summary -->
			{#if includeDomains.length > 0}
				<div class="text-xs text-surface-500 pt-2 border-t border-surface-300-700">
					<p>
						<strong>Query:</strong> Apps using {includeDomains.length} selected SDK{includeDomains.length >
						1
							? 's'
							: ''}
						{excludeDomains.length > 0 ? `, excluding ${excludeDomains.length}` : ''}
					</p>
				</div>
			{/if}
		</aside>

		<!-- Results Table -->
		<main class="card preset-tonal p-4">
			{#if !hasSearched}
				<div class="text-center py-16 text-surface-500">
					<Filter size={48} class="mx-auto mb-4 opacity-50" />
					<p class="text-lg font-medium">Configure your filters</p>
					<p class="text-sm mt-2">
						Select companies to include, set your preferences, and click "Find Apps" to see results.
					</p>
				</div>
			{:else if isLoading}
				<div class="text-center py-16">
					<Loader2 size={48} class="mx-auto mb-4 animate-spin text-primary-500" />
					<p class="text-lg font-medium">Searching apps...</p>
				</div>
			{:else if apps.length === 0}
				<div class="text-center py-16 text-surface-500">
					<X size={48} class="mx-auto mb-4 opacity-50" />
					<p class="text-lg font-medium">No apps found</p>
					<p class="text-sm mt-2">Try adjusting your filters to find more apps.</p>
				</div>
			{:else}
				<div class="mb-4 flex items-center justify-between flex-wrap gap-2">
					<p class="text-sm text-surface-600-400">
						Found <strong>{apps.length}</strong> apps matching your criteria
					</p>
					<button
						class="btn preset-tonal text-sm flex items-center gap-1"
						onclick={exportToCSV}
					>
						<Download size={16} />
						Export CSV
					</button>
				</div>
				<div class="table-container overflow-x-auto">
					<table class="table table-hover table-auto w-full text-xs md:text-sm">
						<thead>
							<tr class="bg-surface-200-800">
								<th class="p-2 text-left">#</th>
								<th class="p-2 text-left">App</th>
								<th class="p-2 text-left">Store</th>
								<th class="p-2 text-right">Installs</th>
								<th class="p-2 text-right">Ratings</th>
								<th class="p-2 text-center">IAP</th>
								<th class="p-2 text-center">Ads</th>
							</tr>
						</thead>
						<tbody>
							{#each apps as app, index (app.store_id)}
								<tr class="hover:bg-surface-100-900">
									<td class="p-2 text-surface-500">{index + 1}</td>
									<td class="p-2">
										<a
											href="/apps/{app.store_id}"
											class="text-blue-600 hover:text-blue-800 hover:underline font-medium"
										>
											{app.name}
										</a>
									</td>
									<td class="p-2">
										<span
											class="badge text-xs {app.store === 1
												? 'preset-filled-success-500'
												: 'preset-filled-surface-500'}"
										>
											{getStoreName(app.store)}
										</span>
									</td>
									<td class="p-2 text-right font-mono">{formatNumber(app.installs)}</td>
									<td class="p-2 text-right font-mono">{formatNumber(app.rating_count)}</td>
									<td class="p-2 text-center">
										{#if app.in_app_purchases}
											<Check class="w-4 h-4 text-success-500 mx-auto" />
										{:else}
											<X class="w-4 h-4 text-error-500 mx-auto" />
										{/if}
									</td>
									<td class="p-2 text-center">
										{#if app.ad_supported}
											<Check class="w-4 h-4 text-success-500 mx-auto" />
										{:else}
											<X class="w-4 h-4 text-error-500 mx-auto" />
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</main>
	</div>
</div>
