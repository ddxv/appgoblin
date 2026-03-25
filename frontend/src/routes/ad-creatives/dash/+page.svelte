<script lang="ts">
	import type { PageData } from './$types';
	import AdCreativeCard from '$lib/AdCreativeCard.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data }: { data: PageData } = $props();

	let pageTitle = 'Creative Clusters Explorer';
	let pageDescription = 'Browse top mobile advertising videos and images for inspiration and competitor analysis.';

	const categories = [
		{ value: 'overall', label: 'Overall (All Apps)' },
		{ value: 'game%', label: 'All Games' },
		{ value: 'game_action', label: 'Game: Action' },
		{ value: 'game_puzzle', label: 'Game: Puzzle' },
		{ value: 'game_strategy', label: 'Game: Strategy' },
		{ value: 'game_simulation', label: 'Game: Simulation' },
		{ value: 'lifestyle', label: 'Lifestyle' },
		{ value: 'finance', label: 'Finance' },
		{ value: 'shopping', label: 'Shopping' },
		{ value: 'social', label: 'Social' }
	];

	const formats = [
		{ value: 'all', label: 'All Formats' },
		{ value: 'video', label: 'Videos (MP4, WebM)' },
		{ value: 'image', label: 'Images (JPG, PNG)' },
		{ value: 'html', label: 'Interactive (HTML)' }
	];

	let creativeClusters = $derived(data.creativeClusters || []);
	
	function handleFilterChange(e: Event) {
		const target = e.target as HTMLSelectElement;
		const { id, value } = target;
		
		const params = new URLSearchParams();
		const catSelect = document.getElementById('category-select') as HTMLSelectElement;
		const fmtSelect = document.getElementById('format-select') as HTMLSelectElement;
		const cmpSelect = document.getElementById('company-search') as HTMLInputElement;
		
		const cat = catSelect ? catSelect.value : (data.selectedCategory || 'overall');
		const fmt = fmtSelect ? fmtSelect.value : (data.selectedFormat || 'all');
		const cmp = cmpSelect ? cmpSelect.value : (data.searchCompany || '');
		
		if (cat && cat !== 'overall') {
			params.set('category', cat);
		}
		if (fmt && fmt !== 'all') {
			params.set('format', fmt);
		}
		if (cmp) {
			params.set('company', cmp);
		}
		
		const queryString = params.toString();
		const navUrl = queryString ? `?${queryString}` : '?';
		goto(navUrl, { keepFocus: true, noScroll: true });
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
</svelte:head>

<div class="px-4 py-8 md:px-16 lg:px-32">
	<div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold">Ad Creative Explorer</h1>
			<p class="mt-2 opacity-70">
				Browse actual videos and images used by top advertisers across ad networks.
			</p>
		</div>

		<div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
			<div class="relative w-full sm:w-64">
				<input
					id="company-search"
					class="input variant-glass rounded-lg border-surface-300 px-4 py-2 w-full"
					type="search"
					placeholder="Search advertiser or network..."
					value={data.searchCompany || ''}
					onkeydown={(e) => e.key === 'Enter' && handleFilterChange(e)}
				/>
			</div>

			<select
				id="format-select"
				class="select variant-glass rounded-lg border-surface-300 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto"
				value={data.selectedFormat || 'all'}
				onchange={handleFilterChange}
			>
				{#each formats as fm}
					<option value={fm.value}>{fm.label}</option>
				{/each}
			</select>
			
			<select
				id="category-select"
				class="select variant-glass rounded-lg border-surface-300 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto"
				value={data.selectedCategory || 'overall'}
				onchange={handleFilterChange}
			>
				{#each categories as cat}
					<option value={cat.value}>{cat.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Summary Cards -->
	<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="rounded-lg border bg-surface-100-800-token p-5 shadow-sm">
			<div class="text-sm font-medium opacity-70">Ad Creatives</div>
			<div class="my-2 text-3xl font-bold">{(data.creativeClusters || []).length}</div>
			<div class="text-xs opacity-60">Distinct visual concepts seen recently</div>
		</div>
		<div class="rounded-lg border bg-surface-100-800-token p-5 shadow-sm">
			<div class="text-sm font-medium opacity-70">Competitors</div>
			<div class="my-2 text-3xl font-bold">{new Set((data.creativeClusters || []).map((c: any) => c.top_advertiser_store_id)).size}</div>
			<div class="text-xs opacity-60">Advertisers running these specific creatives</div>
		</div>
	</div>

	<!-- Creatives Grid -->
	{#if (data.creativeClusters || []).length > 0}
		<div class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6">
			{#each data.creativeClusters || [] as cluster}
				<div class="break-inside-avoid">
					<AdCreativeCard data={cluster} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center rounded-xl border-dashed border-2 border-surface-300-600-token">
			<h3 class="text-xl font-medium opacity-70">No ad creatives found</h3>
			<p class="mt-2 opacity-60 text-sm">Try selecting a different category or adjusting filters.</p>
		</div>
	{/if}
</div>

