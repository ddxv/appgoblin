<script lang="ts">
	import { goto } from '$app/navigation';
	import { LayoutGrid, RectangleHorizontal, RectangleVertical } from 'lucide-svelte';
	import AdCreativeCard from '$lib/AdCreativeCard.svelte';
	import {
		type AdCreativeCategoryOption,
		adCreativeFormats,
		buildAdCreativesUrl,
		getAdCreativeNetworkLabel
	} from '$lib/ad-creatives';

	interface CreativeCluster {
		vhash: string;
		file_extension: string;
		representative_md5: string;
		top_advertiser_store_id: string | null;
		top_adv_name: string | null;
		top_pub_name: string | null;
		top_host_domain: string | null;
		top_ad_domain_company: string | null;
		top_ad_domain_company_domain: string | null;
		top_host_domain_company: string | null;
		top_host_domain_company_domain: string | null;
		top_ad_domain: string | null;
		top_mmp_name: string | null;
		top_mmp_domain: string | null;
		adv_icon_url: string | null;
		pub_icon_url: string | null;
		company_logo_url_ad: string | null;
		company_logo_url_host: string | null;
		unique_publisher_apps: number;
		unique_advertisers: number;
		unique_adv_names: number;
		unique_pub_names: number;
		unique_ad_networks: number;
		unique_ad_domains: number;
		unique_mmps: number;
		first_seen_at: string;
		last_seen_at: string;
		creative_thumb_url: string;
	}

	interface NetworkFilter {
		key: string;
		label: string;
		filterValue: string;
		logoUrl: string | null;
		count: number;
	}

	interface CreativeSection {
		key: string;
		label: string;
		description: string;
		orientation: 'portrait' | 'landscape';
		items: CreativeCluster[];
	}

	interface AdCreativesPageData {
		creativeClusters?: CreativeCluster[];
		networkFilterSourceClusters?: CreativeCluster[];
		categoryOptions?: AdCreativeCategoryOption[];
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

	let selectedCategory = $derived(data.selectedCategory || 'overall');
	let selectedFormat = $derived(data.selectedFormat || 'all');
	let selectedSearchCompany = $derived(data.searchCompany || '');
	let categoryOptions = $derived(
		data.categoryOptions || [{ value: 'overall', label: 'Overall (All Apps)' }]
	);
	let creativeClusters = $derived(data.creativeClusters || []);
	let networkFilterSourceClusters = $derived(data.networkFilterSourceClusters || creativeClusters);
	let detectedAdvertiserCount = $derived(
		new Set(
			creativeClusters
				.map((cluster) => cluster.top_advertiser_store_id)
				.filter((storeId): storeId is string => Boolean(storeId))
		).size
	);
	let undetectedAdvertiserCount = $derived(
		creativeClusters.filter((cluster) => !cluster.top_advertiser_store_id).length
	);
	let networkFilters = $derived(getNetworkFilters(networkFilterSourceClusters));
	let activeNetworkFilter = $derived(normalizeFilterValue(selectedSearchCompany));
	let orientationLookup = $state<Record<string, 'portrait' | 'landscape'>>({});
	let selectedOrientationFilter = $state<'all' | 'portrait' | 'landscape'>('all');
	let creativeSections = $derived(
		getCreativeSections(creativeClusters, orientationLookup, selectedOrientationFilter)
	);

	$effect(() => {
		void populateOrientations(creativeClusters);
	});

	function handleFilterChange() {
		const catSelect = document.getElementById('category-select') as HTMLSelectElement | null;
		const fmtSelect = document.getElementById('format-select') as HTMLSelectElement | null;
		const cmpSelect = document.getElementById('company-search') as HTMLInputElement | null;

		const category = catSelect ? catSelect.value : selectedCategory;
		const format = fmtSelect ? fmtSelect.value : selectedFormat;
		const network = cmpSelect ? cmpSelect.value.trim() : selectedSearchCompany;

		goto(buildAdCreativesUrl({ category, format, network }), {
			keepFocus: true,
			noScroll: true
		});
	}

	function handleNetworkFilter(network: string) {
		goto(
			buildAdCreativesUrl({
				category: selectedCategory,
				format: selectedFormat,
				network
			}),
			{
				keepFocus: true,
				noScroll: true
			}
		);
	}

	function clearAllFilters() {
		selectedOrientationFilter = 'all';
		goto(buildAdCreativesUrl({ category: 'overall', format: 'all', network: '' }), {
			keepFocus: true,
			noScroll: true
		});
	}

	function setOrientationFilter(value: 'all' | 'portrait' | 'landscape') {
		selectedOrientationFilter = value;
	}

	function getNetworkButtonClass(isActive: boolean): string {
		return isActive
			? 'border-primary-500 text-primary-500'
			: 'border-surface-200-700-token bg-surface-100-800-token hover:border-surface-400-500-token';
	}

	function getOrientationButtonClass(isActive: boolean): string {
		return isActive
			? 'border border-primary-500 text-primary-500'
			: 'text-surface-700-200-token hover:bg-surface-50-950-token';
	}

	function getNetworkFilters(clusters: CreativeCluster[]): NetworkFilter[] {
		const networkMap = new Map<string, NetworkFilter>();

		for (const cluster of clusters) {
			const companyDomain =
				cluster.top_ad_domain_company_domain || cluster.top_host_domain_company_domain || null;
			const companyName = cluster.top_ad_domain_company || cluster.top_host_domain_company || null;
			const logoUrl = cluster.company_logo_url_ad || cluster.company_logo_url_host || null;
			const filterValue = getNetworkFilterValue(companyDomain, companyName);

			if (!filterValue) {
				continue;
			}

			const key = normalizeFilterValue(filterValue);
			const existing = networkMap.get(key);
			if (existing) {
				existing.count += 1;
				if (!existing.logoUrl && logoUrl) {
					existing.logoUrl = logoUrl;
				}
				continue;
			}

			networkMap.set(key, {
				key,
				label: companyName || getAdCreativeNetworkLabel(filterValue),
				filterValue,
				logoUrl,
				count: 1
			});
		}

		return Array.from(networkMap.values())
			.sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
			.slice(0, 12);
	}

	async function populateOrientations(clusters: CreativeCluster[]) {
		const unresolved = clusters.filter((cluster) => !orientationLookup[getClusterKey(cluster)]);
		if (unresolved.length === 0) {
			return;
		}

		const nextEntries = await Promise.all(
			unresolved.map(async (cluster) => {
				const orientation = await detectCreativeOrientation(cluster.creative_thumb_url);
				return [getClusterKey(cluster), orientation] as const;
			})
		);

		orientationLookup = {
			...orientationLookup,
			...Object.fromEntries(nextEntries)
		};
	}

	function getCreativeSections(
		clusters: CreativeCluster[],
		lookup: Record<string, 'portrait' | 'landscape'>,
		orientationFilter: 'all' | 'portrait' | 'landscape'
	): CreativeSection[] {
		const portraitItems: CreativeCluster[] = [];
		const landscapeItems: CreativeCluster[] = [];

		for (const cluster of clusters) {
			const orientation = lookup[getClusterKey(cluster)] || 'landscape';
			if (orientation === 'portrait') {
				portraitItems.push(cluster);
			} else {
				landscapeItems.push(cluster);
			}
		}

		const sections: CreativeSection[] = [];
		if (orientationFilter !== 'portrait' && landscapeItems.length > 0) {
			sections.push({
				key: 'landscape',
				label: 'Landscape Ad Creatives',
				description: 'Wider creatives grouped together to keep rows even and compact.',
				orientation: 'landscape',
				items: landscapeItems
			});
		}
		if (orientationFilter !== 'landscape' && portraitItems.length > 0) {
			sections.push({
				key: 'portrait',
				label: 'Portrait Ad Creatives',
				description:
					'Taller creatives grouped separately so they do not disrupt the landscape grid.',
				orientation: 'portrait',
				items: portraitItems
			});
		}

		return sections;
	}

	function getClusterKey(cluster: CreativeCluster): string {
		return `${cluster.representative_md5}:${cluster.file_extension}`;
	}

	function detectCreativeOrientation(url: string): Promise<'portrait' | 'landscape'> {
		return new Promise((resolve) => {
			const image = new Image();
			image.onload = () => {
				resolve(image.naturalHeight > image.naturalWidth ? 'portrait' : 'landscape');
			};
			image.onerror = () => resolve('landscape');
			image.src = url;
		});
	}

	function getNetworkFilterValue(
		companyDomain: string | null,
		companyName: string | null
	): string | null {
		if (companyDomain) {
			return companyDomain.split('.')[0];
		}

		if (!companyName) {
			return null;
		}

		return companyName
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, ' ')
			.trim()
			.replace(/\s+/g, '-');
	}

	function normalizeFilterValue(value: string): string {
		return value.toLowerCase().trim();
	}
</script>

<div class="px-4 py-8 md:px-10 lg:px-14 xl:px-16">
	<div class="mx-auto max-w-[1440px] space-y-8">
		<div
			class="rounded-2xl border border-surface-200-700-token bg-surface-50-900-token p-4 shadow-sm md:p-5"
		>
			<div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,440px)] xl:items-start">
				<div class="min-w-0">
					<div class="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
						<div class="min-w-0">
							<h1 class="text-2xl font-bold md:text-3xl">
								{data.pageHeading || 'Ad Creative Explorer'}
							</h1>
							<p class="mt-2 max-w-3xl text-sm leading-6 opacity-75">
								{data.pageIntro ||
									'Browse actual videos and images used by top advertisers across ad networks.'}
							</p>
						</div>
						<div class="flex flex-wrap gap-2 text-sm lg:justify-end">
							<span class="rounded-full bg-surface-100-800-token px-3 py-1.5 font-medium"
								>{creativeClusters.length} clusters</span
							>
							<span class="rounded-full bg-surface-100-800-token px-3 py-1.5 font-medium"
								>{detectedAdvertiserCount} detected advertisers</span
							>
							{#if undetectedAdvertiserCount > 0}
								<span class="rounded-full bg-surface-100-800-token px-3 py-1.5 font-medium"
									>{undetectedAdvertiserCount} not yet detected</span
								>
							{/if}
						</div>
					</div>
				</div>

				<div class="rounded-2xl border border-surface-200-700-token bg-surface-100-800-token p-4">
					<div class="flex flex-wrap items-start gap-3">
						<div class="min-w-[120px] flex-1 rounded-xl bg-surface-50-950-token px-3 py-2.5">
							<div class="text-[11px] uppercase tracking-[0.16em] opacity-55">
								Detected App Advertisers
							</div>
							<div class="mt-1 text-lg font-bold">{detectedAdvertiserCount}</div>
						</div>
						<div class="min-w-[120px] flex-1 rounded-xl bg-surface-50-950-token px-3 py-2.5">
							<div class="text-[11px] uppercase tracking-[0.16em] opacity-55">Not Yet Detected</div>
							<div class="mt-1 text-lg font-bold">{undetectedAdvertiserCount}</div>
						</div>
						<div class="min-w-[120px] flex-1 rounded-xl bg-surface-50-950-token px-3 py-2.5">
							<div class="text-[11px] uppercase tracking-[0.16em] opacity-55">Networks In View</div>
							<div class="mt-1 text-lg font-bold">{networkFilters.length}</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="space-y-6">
			<div
				class="rounded-2xl border border-surface-200-700-token bg-surface-50-900-token p-4 shadow-sm md:p-5 lg:p-6"
			>
				<div class="flex flex-col gap-5">
					<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
						<div>
							<h2 class="text-lg font-semibold">Filters</h2>
							<p class="mt-1 text-sm opacity-70">
								Refine by network, advertiser search, category, or format in one place.
							</p>
						</div>
						<div class="text-sm opacity-60">{networkFilters.length} networks shown</div>
					</div>

					<div class="grid grid-cols-4 gap-1 md:grid-cols-6 md:gap-3 xl:grid-cols-8">
						<button
							type="button"
							class={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-center transition md:gap-2 md:px-3 md:py-3 ${getNetworkButtonClass(!selectedSearchCompany)}`}
							onclick={() => handleNetworkFilter('')}
						>
							<div
								class="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-50-950-token text-xs font-semibold md:h-11 md:w-11 md:text-sm"
							>
								All
							</div>
							<div class="line-clamp-2 text-xs font-medium leading-4 md:text-sm md:leading-5">
								All Networks
							</div>
						</button>

						{#each networkFilters as network}
							<button
								type="button"
								class={`flex min-w-0 flex-col items-center gap-1.5 rounded-xl border px-2 py-2 text-center transition md:gap-2 md:px-3 md:py-3 ${getNetworkButtonClass(activeNetworkFilter === network.key)}`}
								onclick={() => handleNetworkFilter(network.filterValue)}
								aria-pressed={activeNetworkFilter === network.key}
							>
								<div
									class="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-surface-50-950-token md:h-11 md:w-11 md:rounded-xl"
								>
									{#if network.logoUrl}
										<img
											src={`https://media.appgoblin.info/${network.logoUrl}`}
											alt={network.label}
											class="h-7 w-7 rounded object-contain md:h-9 md:w-9 md:rounded-lg"
											loading="lazy"
										/>
									{:else}
										<span class="text-xs font-semibold md:text-sm"
											>{network.label.slice(0, 2).toUpperCase()}</span
										>
									{/if}
								</div>
								<div class="line-clamp-2 text-xs font-medium leading-4 md:text-sm md:leading-5">
									{network.label}
								</div>
								<div class="text-xs opacity-60">({network.count})</div>
							</button>
						{/each}
					</div>

					<div
						class="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_200px_minmax(240px,300px)_auto] xl:items-end"
					>
						<div class="relative min-w-0">
							<label
								class="mb-2 block text-xs font-medium uppercase tracking-[0.14em] opacity-60"
								for="company-search"
							>
								Advertiser or network search
							</label>
							<input
								id="company-search"
								class="input variant-glass h-11 rounded-xl border-surface-300 px-4 py-2 w-full"
								type="search"
								placeholder="Search advertiser or network..."
								value={data.searchCompany || ''}
								onkeydown={(e) => e.key === 'Enter' && handleFilterChange()}
							/>
						</div>

						<div>
							<label
								class="mb-2 block text-xs font-medium uppercase tracking-[0.14em] opacity-60"
								for="category-select"
							>
								Category
							</label>
							<select
								id="category-select"
								class="select variant-glass h-11 rounded-xl border-surface-300 focus:ring-primary-500 focus:border-primary-500 w-full"
								value={data.selectedCategory || 'overall'}
								onchange={handleFilterChange}
							>
								{#each categoryOptions as cat}
									<option value={cat.value}>{cat.label}</option>
								{/each}
							</select>
						</div>

						<div>
							<label
								class="mb-2 block text-xs font-medium uppercase tracking-[0.14em] opacity-60"
								for="format-select"
							>
								Format
							</label>
							<select
								id="format-select"
								class="select variant-glass h-11 rounded-xl border-surface-300 focus:ring-primary-500 focus:border-primary-500 w-full"
								value={data.selectedFormat || 'all'}
								onchange={handleFilterChange}
							>
								{#each adCreativeFormats as fm}
									<option value={fm.value}>{fm.label}</option>
								{/each}
							</select>
						</div>

						<div>
							<div class="mb-2 block text-xs font-medium uppercase tracking-[0.14em] opacity-60">
								Orientation
							</div>
							<div
								class="flex h-11 w-full rounded-xl border border-surface-300 bg-surface-100-800-token p-1"
								role="radiogroup"
								aria-label="Creative orientation"
							>
								<button
									type="button"
									class={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm transition ${getOrientationButtonClass(selectedOrientationFilter === 'all')}`}
									role="radio"
									aria-checked={selectedOrientationFilter === 'all'}
									onclick={() => setOrientationFilter('all')}
								>
									<LayoutGrid size={16} />
									<span>All</span>
								</button>
								<button
									type="button"
									class={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm transition ${getOrientationButtonClass(selectedOrientationFilter === 'landscape')}`}
									role="radio"
									aria-checked={selectedOrientationFilter === 'landscape'}
									onclick={() => setOrientationFilter('landscape')}
								>
									<RectangleHorizontal size={16} />
									<span>Landscape</span>
								</button>
								<button
									type="button"
									class={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm transition ${getOrientationButtonClass(selectedOrientationFilter === 'portrait')}`}
									role="radio"
									aria-checked={selectedOrientationFilter === 'portrait'}
									onclick={() => setOrientationFilter('portrait')}
								>
									<RectangleVertical size={16} />
									<span>Portrait</span>
								</button>
							</div>
						</div>

						<div class="flex flex-wrap gap-2 lg:justify-end">
							{#if selectedCategory !== 'overall' || selectedFormat !== 'all' || selectedSearchCompany || selectedOrientationFilter !== 'all'}
								<button
									type="button"
									class="rounded-full border border-surface-300 px-3 py-2 text-sm transition hover:bg-surface-100-800-token"
									onclick={clearAllFilters}
								>
									Clear all
								</button>
							{/if}
						</div>
					</div>

					<div class="flex flex-wrap items-center gap-2 text-xs md:text-sm">
						<span class="opacity-60">Current view:</span>
						<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
							>{creativeClusters.length} creatives</span
						>
						{#if selectedCategory !== 'overall'}
							<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
								>{categoryOptions.find((cat) => cat.value === selectedCategory)?.label ||
									selectedCategory}</span
							>
						{/if}
						{#if selectedFormat !== 'all'}
							<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
								>{adCreativeFormats.find((format) => format.value === selectedFormat)?.label ||
									selectedFormat}</span
							>
						{/if}
						{#if selectedOrientationFilter !== 'all'}
							<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
								>{selectedOrientationFilter === 'portrait'
									? 'Portrait only'
									: 'Landscape only'}</span
							>
						{/if}
						{#if selectedSearchCompany}
							<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
								>{getAdCreativeNetworkLabel(selectedSearchCompany)}</span
							>
						{/if}
					</div>
				</div>
			</div>

			{#if creativeClusters.length > 0}
				<div class="space-y-8">
					{#each creativeSections as section}
						<section class="space-y-5">
							<div
								class="flex flex-col gap-1 border-b border-surface-200-700-token pb-3 md:flex-row md:items-end md:justify-between"
							>
								<div>
									<h2 class="text-xl font-semibold">{section.label}</h2>
									<p class="mt-1 text-sm opacity-68">{section.description}</p>
								</div>
								<div class="text-sm opacity-60">{section.items.length} creatives</div>
							</div>

							<div
								class={`grid grid-cols-2 gap-x-3 gap-y-5 md:gap-y-6 ${section.orientation === 'portrait' ? 'md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 2xl:grid-cols-5 2xl:gap-x-8' : 'md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-6 2xl:grid-cols-4 2xl:gap-x-8'} 2xl:gap-y-8`}
							>
								{#each section.items as cluster}
									<div class="min-w-0">
										<AdCreativeCard data={cluster} orientation={section.orientation} />
									</div>
								{/each}
							</div>
						</section>
					{/each}
				</div>
			{:else}
				<div
					class="rounded-2xl border-2 border-dashed border-surface-300-600-token py-16 text-center"
				>
					<h3 class="text-xl font-medium opacity-70">No ad creatives found</h3>
					<p class="mt-2 text-sm opacity-60">
						Try selecting a different category or adjusting filters.
					</p>
				</div>
			{/if}
		</div>
	</div>
</div>
