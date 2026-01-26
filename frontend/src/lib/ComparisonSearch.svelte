<script lang="ts">
	import IconSearch from '$lib/svg/IconSearch.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let {
		onSelect,
		slotId,
		searchResult
	}: {
		onSelect: (app: any) => void;
		slotId: string;
		searchResult: any;
	} = $props();

	// Get current search query from URL
	let currentSearch = $derived($page.url.searchParams.get(`search${slotId}`) || '');

	// Initialize state - will be set from URL in effect
	let searchQuery = $state('');
	let lastSyncedUrlValue = $state('');
	let isUserTyping = $state(false);
	let isInitialized = $state(false);

	// Initialize and sync from URL when URL changes externally (not while user is typing)
	$effect(() => {
		const urlSearch = $page.url.searchParams.get(`search${slotId}`) || '';

		// Initialize on first run
		if (!isInitialized) {
			searchQuery = urlSearch;
			lastSyncedUrlValue = urlSearch;
			isInitialized = true;
			return;
		}

		// If URL changed and user is not typing, sync from URL
		if (urlSearch !== lastSyncedUrlValue && !isUserTyping) {
			searchQuery = urlSearch;
			lastSyncedUrlValue = urlSearch;
		} else if (urlSearch !== lastSyncedUrlValue) {
			// URL changed but user is typing - update tracking but don't overwrite input
			lastSyncedUrlValue = urlSearch;
		}
	});

	let hasSearched = $derived(!!currentSearch && currentSearch.length >= 3);

	// Extract apps from search result
	let googleApps = $derived(searchResult?.google?.apps || []);
	let appleApps = $derived(searchResult?.apple?.apps || []);

	let searchTimeout: NodeJS.Timeout;

	function onInput() {
		isUserTyping = true;
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			isUserTyping = false;
			handleSearch();
		}, 500);
	}

	function handleSearch() {
		if (!searchQuery || searchQuery.length < 3) {
			// Clear search param if query is too short
			const url = new URL($page.url);
			url.searchParams.delete(`search${slotId}`);
			goto(url.pathname + url.search, { noScroll: true, keepFocus: true });
			return;
		}

		// Update URL with search param to trigger server-side search
		const url = new URL($page.url);
		url.searchParams.set(`search${slotId}`, searchQuery);
		goto(url.pathname + url.search, { noScroll: true, keepFocus: true });
	}

	function selectApp(app: any) {
		onSelect(app);
	}
</script>

<div class="flex flex-col h-full">
	<div class="relative mb-4">
		<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
			<IconSearch />
		</div>
		<input
			type="text"
			bind:value={searchQuery}
			oninput={onInput}
			placeholder="Search app to compare..."
			class="block w-full rounded-lg border border-gray-300 bg-white p-4 pl-10 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
		/>
	</div>

	{#if hasSearched}
		<div class="grid grid-cols-2 gap-4 overflow-y-auto h-full pr-2">
			<!-- Android Results -->
			<div>
				<h3 class="mb-2 text-sm uppercase tracking-wider flex items-center gap-2">
					<span>Android</span>
					<span class="text-xs font-normal opacity-70">({googleApps.length})</span>
				</h3>
				{#if googleApps.length > 0}
					<div class="space-y-2">
						{#each googleApps as app}
							<button
								class="flex w-full items-start gap-3 rounded-md border p-2 text-left hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
								onclick={() => selectApp(app)}
							>
								<img
									src={app.app_icon_url}
									alt={app.name}
									class="h-8 w-8 rounded bg-gray-200 shrink-0"
								/>
								<div class="min-w-0">
									<div class="font-bold text-xs truncate">{app.name}</div>
									<div class="text-[10px] opacity-70 truncate">{app.developer_name}</div>
								</div>
							</button>
						{/each}
					</div>
				{:else}
					<div class="text-xs opacity-50 italic">No Android results</div>
				{/if}
			</div>

			<!-- iOS Results -->
			<div>
				<h3 class="mb-2 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
					<span>iOS</span>
					<span class="text-xs font-normal opacity-70">({appleApps.length})</span>
				</h3>
				{#if appleApps.length > 0}
					<div class="space-y-2">
						{#each appleApps as app}
							<button
								class="flex w-full items-start gap-3 rounded-md border p-2 text-left"
								onclick={() => selectApp(app)}
							>
								<img
									src={app.app_icon_url}
									alt={app.name}
									class="h-8 w-8 rounded bg-gray-200 shrink-0"
								/>
								<div class="min-w-0">
									<div class="font-bold text-xs truncate">{app.name}</div>
									<div class="text-[10px] opacity-70 truncate">{app.developer_name}</div>
								</div>
							</button>
						{/each}
					</div>
				{:else}
					<div class="text-xs opacity-50 italic">No iOS results</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="flex-1 flex items-center justify-center text-center opacity-50 text-sm p-4">
			Type to search for apps across Google Play and App Store.
		</div>
	{/if}
</div>
