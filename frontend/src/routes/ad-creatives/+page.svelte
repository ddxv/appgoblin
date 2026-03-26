<script lang="ts">
	import { goto } from '$app/navigation';
	import AdCreativeCard from '$lib/AdCreativeCard.svelte';
	import { adCreativeCategories, adCreativeFormats, buildAdCreativesUrl } from '$lib/ad-creatives';

	interface AdCreativesPageData {
		creativeClusters?: any[];
		selectedCategory?: string;
		selectedFormat?: string;
		searchCompany?: string;
		pageTitle?: string;
		pageDescription?: string;
		pageHeading?: string;
		pageIntro?: string;
		canonicalUrl?: string;
	}

	let { data }: { data: AdCreativesPageData } = $props();

	let pageTitle = $derived(data.pageTitle || 'Creative Clusters Explorer | AppGoblin');
	let pageDescription = $derived(
		data.pageDescription ||
			'Browse top mobile advertising videos and images for inspiration and competitor analysis.'
	);
	let pageHeading = $derived(data.pageHeading || 'Ad Creative Explorer');
	let pageIntro = $derived(
		data.pageIntro || 'Browse actual videos and images used by top advertisers across ad networks.'
	);
	let canonicalUrl = $derived(data.canonicalUrl || 'https://appgoblin.info/ad-creatives');
	let creativeClusters = $derived(data.creativeClusters || []);

	function handleFilterChange() {
		const catSelect = document.getElementById('category-select') as HTMLSelectElement | null;
		const fmtSelect = document.getElementById('format-select') as HTMLSelectElement | null;
		const cmpSelect = document.getElementById('company-search') as HTMLInputElement | null;

		const category = catSelect ? catSelect.value : data.selectedCategory || 'overall';
		const format = fmtSelect ? fmtSelect.value : data.selectedFormat || 'all';
		const network = cmpSelect ? cmpSelect.value.trim() : data.searchCompany || '';

		goto(buildAdCreativesUrl({ category, format, network }), {
			keepFocus: true,
			noScroll: true
		});
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={canonicalUrl} />
</svelte:head>

<div class="px-4 py-8 md:px-16 lg:px-32">
	<div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
		<div>
			<h1 class="text-3xl font-bold">{pageHeading}</h1>
			<p class="mt-2 opacity-70">
				{pageIntro}
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
					onkeydown={(e) => e.key === 'Enter' && handleFilterChange()}
				/>
			</div>

			<select
				id="format-select"
				class="select variant-glass rounded-lg border-surface-300 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto"
				value={data.selectedFormat || 'all'}
				onchange={handleFilterChange}
			>
				{#each adCreativeFormats as fm}
					<option value={fm.value}>{fm.label}</option>
				{/each}
			</select>

			<select
				id="category-select"
				class="select variant-glass rounded-lg border-surface-300 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto"
				value={data.selectedCategory || 'overall'}
				onchange={handleFilterChange}
			>
				{#each adCreativeCategories as cat}
					<option value={cat.value}>{cat.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Summary Cards -->
	<div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
		<div class="rounded-lg border bg-surface-100-800-token p-5 shadow-sm">
			<div class="text-sm font-medium opacity-70">Ad Creatives</div>
			<div class="my-2 text-3xl font-bold">{creativeClusters.length}</div>
			<div class="text-xs opacity-60">Distinct visual concepts seen recently</div>
		</div>
		<div class="rounded-lg border bg-surface-100-800-token p-5 shadow-sm">
			<div class="text-sm font-medium opacity-70">Competitors</div>
			<div class="my-2 text-3xl font-bold">
				{new Set(creativeClusters.map((c: any) => c.top_advertiser_store_id)).size}
			</div>
			<div class="text-xs opacity-60">Advertisers running these specific creatives</div>
		</div>
	</div>

	<!-- Creatives Grid -->
	{#if creativeClusters.length > 0}
		<div
			class="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-6 space-y-4 md:space-y-6"
		>
			{#each creativeClusters as cluster}
				<div class="break-inside-avoid">
					<AdCreativeCard data={cluster} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="py-16 text-center rounded-xl border-dashed border-2 border-surface-300-600-token">
			<h3 class="text-xl font-medium opacity-70">No ad creatives found</h3>
			<p class="mt-2 opacity-60 text-sm">
				Try selecting a different category or adjusting filters.
			</p>
		</div>
	{/if}
</div>
