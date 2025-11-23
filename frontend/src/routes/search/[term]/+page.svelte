<script lang="ts">
	import { page } from '$app/state';
	import type { SearchResponse } from '../../../types';
	import AppGroupCard from '$lib/AppGroupCard.svelte';
	import CompaniesSearchTable from '$lib/CompaniesSearchTable.svelte';

	interface Props {
		data: SearchResponse;
	}

	let { data }: Props = $props();
	let searchTerm: string | null = $state(page.params.term || '');

	// Tab state
	type MainTab = 'apps' | 'companies';
	let activeTab = $state<MainTab>('apps');

	// App store filter state
	type AppStore = 'apple' | 'google';
	let selectedStore = $state<AppStore>('apple');

	// Computed values
	const appleAppCount = $derived(
		typeof data.appGroupByStore !== 'string' ? data.appGroupByStore.apple.apps.length : 0
	);
	const googleAppCount = $derived(
		typeof data.appGroupByStore !== 'string' ? data.appGroupByStore.google.apps.length : 0
	);
	const totalAppCount = $derived(appleAppCount + googleAppCount);
	const companiesCount = $derived(
		typeof data.companiesResults !== 'string' ? data.companiesResults.length : 0
	);

	// Determine initial tab based on results
	$effect(() => {
		if (totalAppCount === 0 && companiesCount > 0) {
			activeTab = 'companies';
		} else if (totalAppCount > 0 && companiesCount === 0) {
			activeTab = 'apps';
		}
		// If both have results, default to apps (or could default to whichever has more)
	});

	// Auto-select store with results
	$effect(() => {
		if (activeTab === 'apps') {
			if (selectedStore === 'apple' && appleAppCount === 0 && googleAppCount > 0) {
				selectedStore = 'google';
			} else if (selectedStore === 'google' && googleAppCount === 0 && appleAppCount > 0) {
				selectedStore = 'apple';
			}
		}
	});

	function getCurrentAppGroup() {
		if (typeof data.appGroupByStore === 'string') return null;
		return selectedStore === 'apple' ? data.appGroupByStore.apple : data.appGroupByStore.google;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="card p-4 md:p-6">
		<h1 class="text-2xl md:text-3xl text-primary-900-100 mb-4">
			Search Results for: <span class="font-bold">'{searchTerm}'</span>
		</h1>

		<!-- Summary Stats -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
			<div class="card preset-tonal p-3">
				<div class="text-sm text-surface-600-400">Apps Found</div>
				<div class="text-2xl font-bold text-primary-900-100">{totalAppCount}</div>
				<div class="text-xs text-surface-600-400 mt-1">
					{appleAppCount} Apple • {googleAppCount} Google Play
				</div>
			</div>
			<div class="card preset-tonal p-3">
				<div class="text-sm text-surface-600-400">Companies Found</div>
				<div class="text-2xl font-bold text-primary-900-100">{companiesCount}</div>
				<div class="text-xs text-surface-600-400 mt-1">Adtech/Business/Development Tools</div>
			</div>
		</div>
	</div>

	<!-- Main Tabs: Apps vs Companies -->
	<div class="card p-0">
		<!-- Tab Navigation -->
		<div class="flex border-b border-surface-200-800">
			<button
				type="button"
				class="flex-1 px-4 py-3 font-medium transition-colors duration-200 {activeTab === 'apps'
					? 'text-primary-900-100 border-b-2 border-primary-900-100 bg-surface-100-900'
					: 'text-surface-600-400 hover:text-primary-900-100 hover:bg-surface-100-900'}"
				onclick={() => {
					activeTab = 'apps';
				}}
			>
				Apps
				{#if totalAppCount > 0}
					<span
						class="ml-2 px-2 py-0.5 text-xs rounded-full {activeTab === 'apps'
							? 'bg-primary-900-100 text-surface-50-950'
							: 'bg-surface-200-800 text-surface-600-400'}"
					>
						{totalAppCount}
					</span>
				{/if}
			</button>
			<button
				type="button"
				class="flex-1 px-4 py-3 font-medium transition-colors duration-200 {activeTab ===
				'companies'
					? 'text-primary-900-100 border-b-2 border-primary-900-100 bg-surface-100-900'
					: 'text-surface-600-400 hover:text-primary-900-100 hover:bg-surface-100-900'}"
				onclick={() => {
					activeTab = 'companies';
				}}
			>
				Companies
				{#if companiesCount > 0}
					<span
						class="ml-2 px-2 py-0.5 text-xs rounded-full {activeTab === 'companies'
							? 'bg-primary-900-100 text-surface-50-950'
							: 'bg-surface-200-800 text-surface-600-400'}"
					>
						{companiesCount}
					</span>
				{/if}
			</button>
		</div>

		<!-- Tab Content -->
		<div class="p-4 md:p-6">
			{#if activeTab === 'apps'}
				{#if typeof data.appGroupByStore === 'string'}
					<div class="card preset-tonal p-4">
						<p class="text-error-500">Search failed. Please try again.</p>
					</div>
				{:else if totalAppCount === 0}
					<div class="card preset-tonal p-6 text-center">
						<h2 class="h3 mb-4">No Apps Found</h2>
						<p class="text-surface-600-400 mb-4">
							No apps found for <span class="font-semibold">'{searchTerm}'</span>, but a search has
							been queued. Full data from app stores, if it exists, should be available in the
							coming days.
						</p>
						<p class="text-sm text-surface-600-400">
							Reach out on Discord or GitHub if you have any questions.
						</p>
					</div>
				{:else}
					<!-- Store Filter (iOS vs Google) -->
					{#if appleAppCount > 0 && googleAppCount > 0}
						<div class="mb-6 flex gap-2">
							<button
								type="button"
								class="px-4 py-2 rounded-md font-medium transition-colors {selectedStore === 'apple'
									? 'bg-primary-900-100 text-surface-50-950'
									: 'bg-surface-200-800 text-surface-600-400 hover:bg-surface-300-700'}"
								onclick={() => {
									selectedStore = 'apple';
								}}
							>
								App Store ({appleAppCount})
							</button>
							<button
								type="button"
								class="px-4 py-2 rounded-md font-medium transition-colors {selectedStore ===
								'google'
									? 'bg-primary-900-100 text-surface-50-950'
									: 'bg-surface-200-800 text-surface-600-400 hover:bg-surface-300-700'}"
								onclick={() => {
									selectedStore = 'google';
								}}
							>
								Google Play ({googleAppCount})
							</button>
						</div>
					{/if}

					<!-- App Results -->
					{#if selectedStore === 'apple' && appleAppCount > 0}
						<AppGroupCard apps={data.appGroupByStore.apple} />
					{:else if selectedStore === 'google' && googleAppCount > 0}
						<AppGroupCard apps={data.appGroupByStore.google} />
					{:else}
						<div class="card preset-tonal p-4">
							<p class="text-surface-600-400">
								No apps found for {selectedStore === 'apple' ? 'App Store' : 'Google Play'}.
							</p>
						</div>
					{/if}

					<!-- Help Text -->
					<div class="card preset-tonal p-4 mt-6">
						<h3 class="h4 mb-2">Didn't see the app you're looking for?</h3>
						<p class="text-sm text-surface-600-400">
							This search checks both Google Play and App Store. If an app exists but isn't showing
							up, it may be queued for indexing and should appear within the next day. Reach out on
							Discord or GitHub if you have questions or need support.
						</p>
					</div>
				{/if}
			{:else if activeTab === 'companies'}
				{#if typeof data.companiesResults === 'string'}
					<div class="card preset-tonal p-4">
						<p class="text-error-500">Search failed. Please try again.</p>
					</div>
				{:else if companiesCount === 0}
					<div class="card preset-tonal p-6 text-center">
						<h2 class="h3 mb-4">No Companies Found</h2>
						<p class="text-surface-600-400 mb-4">
							No adtech/business/development tool companies found matching
							<span class="font-semibold"> '{searchTerm}'</span>.
						</p>
						<p class="text-sm text-surface-600-400">
							If you expected to see something, please let us know by sending a note on Discord or
							GitHub and we can add it.
						</p>
					</div>
				{:else}
					<div>
						<h3 class="h4 mb-4">Companies and Domains Matching: '{searchTerm}'</h3>
						<CompaniesSearchTable data={data.companiesResults} />
					</div>
				{/if}
			{/if}
		</div>
	</div>
</div>
