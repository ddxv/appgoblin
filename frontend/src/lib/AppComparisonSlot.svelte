<script lang="ts">
	import AppComparisonColumn from '$lib/AppComparisonColumn.svelte';
	import ComparisonSearch from '$lib/ComparisonSearch.svelte';

	let {
		app = null,
		history = null,
		histogram = null,
		sdks = null,
		companyTypes = null,
		onAppSelected,
		slotId = '1',
		searchResult = null
	}: {
		app?: any;
		history?: any;
		histogram?: any;
		sdks?: any;
		companyTypes?: any;
		onAppSelected: (app: any) => void;
		slotId?: string;
		searchResult?: any;
	} = $props();

	let isSearching = $state(!app);
	let isLoading = $state(false);

	$effect(() => {
		// Reset search state when app prop changes (e.g. navigation)
		// If app is present, show it (isSearching = false). If null, show search.
		// Note: This allows manual toggling (isSearching=true) while app stays same,
		// as effect only runs when app dependency changes.
		if (app) {
			isSearching = false;
			isLoading = false;
		} else {
			isSearching = true;
			isLoading = false;
		}
	});

	function handleSelect(app: any) {
		isLoading = true; // Show loading state while navigating
		onAppSelected(app);
		isSearching = false;
	}

	function toggleSearch() {
		isSearching = !isSearching;
	}
</script>

<div
	class="h-full flex flex-col rounded-lg bg-white p-1 md:p-4 shadow-sm dark:bg-surface-800 border dark:border-gray-700"
>
	{#if isLoading}
		<div class="flex-1 flex flex-col items-center justify-center p-8">
			<div
				class="h-10 w-10 animate-spin rounded-full border-4 border-surface-200 border-t-primary-500"
			></div>
			<p class="mt-4 text-surface-600-400 font-medium">Loading app...</p>
		</div>
	{:else if app && !isSearching}
		<div class="mb-4 flex justify-end">
			<button
				class="text-xs font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 underline"
				onclick={toggleSearch}
			>
				Change App
			</button>
		</div>
		<AppComparisonColumn {app} {history} {histogram} {sdks} {companyTypes} />
	{:else}
		<div class="flex-1 flex flex-col">
			<div class="mb-4 flex justify-between items-center">
				<h3 class="font-bold text-lg">Select App</h3>
				{#if app}
					<button class="text-xs text-red-500 hover:underline" onclick={toggleSearch}>Cancel</button
					>
				{/if}
			</div>
			<div class="flex-1 min-h-[400px]">
				<ComparisonSearch onSelect={handleSelect} {slotId} {searchResult} />
			</div>
		</div>
	{/if}
</div>
