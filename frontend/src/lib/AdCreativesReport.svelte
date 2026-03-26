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
		isSignedIn?: boolean;
		allowAdvancedFilters?: boolean;
		anonymousCreativeLimit?: number;
		signInUrl?: string;
		pageTitle?: string;
		pageDescription?: string;
		pageHeading?: string;
		pageIntro?: string;
		canonicalUrl?: string;
	}

	let { data = {} as AdCreativesPageData }: { data?: AdCreativesPageData } = $props();

	let selectedCategory = $derived(data.selectedCategory || 'overall');
	let selectedFormat = $derived(data.selectedFormat || 'all');
	let selectedSearchCompany = $derived(data.searchCompany || '');
	let categoryOptions = $derived(
		data.categoryOptions || [{ value: 'overall', label: 'Overall (All Apps)' }]
	);
	let creativeClusters = $derived(data.creativeClusters || []);
	let isSignedIn = $derived(Boolean(data.isSignedIn));
	let allowAdvancedFilters = $derived(Boolean(data.allowAdvancedFilters));
	let anonymousCreativeLimit = $derived(data.anonymousCreativeLimit || 8);
	let signInUrl = $derived(data.signInUrl || '/auth/login');
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

		const category = catSelect ? catSelect.value : selectedCategory;
		const format = fmtSelect ? fmtSelect.value : selectedFormat;
		const network = selectedSearchCompany;

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
		if (!allowAdvancedFilters) {
			return;
		}

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
			.sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
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

<div class="px-4 py-5 md:px-8 lg:px-10 xl:px-12">
	<div class="mx-auto max-w-[1440px] space-y-6">
		<div
			class="rounded-2xl border border-surface-200-700-token bg-surface-50-900-token p-4 shadow-sm md:p-5"
		>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
					<div class="min-w-0">
						<div class="flex flex-col gap-2 xl:flex-row xl:items-end xl:justify-between">
							<div class="min-w-0">
								<h1 class="text-xl font-bold md:text-2xl">
									{data.pageHeading || 'Ad Creative Explorer'}
								</h1>
								<p class="mt-1 max-w-3xl text-sm leading-5 opacity-75">
									{data.pageIntro ||
										'Browse actual videos and images used by top advertisers across ad networks.'}
								</p>
							</div>
							<div class="flex flex-wrap gap-2 text-xs font-medium md:text-sm xl:justify-end">
								{#if !isSignedIn}
									<span class="rounded-full border border-primary-300/60 bg-primary-50/60 px-3 py-1.5 text-primary-700">
										Preview
									</span>
								{/if}
								<span class="rounded-full bg-surface-100-800-token px-3 py-1.5">
									{creativeClusters.length} creatives
								</span>
								<span class="rounded-full bg-surface-100-800-token px-3 py-1.5">
									{detectedAdvertiserCount} advertisers
								</span>
								<span class="rounded-full bg-surface-100-800-token px-3 py-1.5">
									{networkFilters.length} networks
								</span>
								{#if undetectedAdvertiserCount > 0}
									<span class="rounded-full bg-surface-100-800-token px-3 py-1.5">
										{undetectedAdvertiserCount} undetected
									</span>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-4 border-t border-surface-200-700-token pt-4">
					<div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
						<div>
							<h2 class="text-base font-semibold md:text-lg">Filters</h2>
							<p class="mt-0.5 text-sm opacity-70">
								Adjust network, category, format, and orientation without losing the grid.
							</p>
						</div>
						<div class="text-xs opacity-60 md:text-sm">{networkFilters.length} networks shown</div>
					</div>

					{#if !isSignedIn}
						<div
							class="flex flex-col gap-3 rounded-2xl border border-primary-300/60 bg-primary-50/60 p-4 md:flex-row md:items-center md:justify-between"
						>
							<div>
								<div class="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-700">
									Signed-out preview
								</div>
								<p class="mt-1 text-sm leading-6 text-primary-900">
									You can browse up to {anonymousCreativeLimit} creatives before signing in. Category, format, and orientation filters unlock once you sign in.
								</p>
							</div>
							<a
								href={signInUrl}
								class="inline-flex items-center justify-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
							>
								Sign in to unlock filters
							</a>
						</div>
					{/if}

					<div>
						<div
							class="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] opacity-60"
						>
							Networks
						</div>
						<div class="flex gap-2 overflow-x-auto pb-1">
							<button
								type="button"
								class={`flex min-w-[108px] shrink-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-sm transition ${getNetworkButtonClass(!selectedSearchCompany)}`}
								onclick={() => handleNetworkFilter('')}
							>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-50-950-token text-xs font-semibold"
								>
									All
								</div>
								<div class="min-w-0 flex-1">
									<div class="truncate text-sm font-medium leading-4">All Networks</div>
								</div>
							</button>

							{#each networkFilters as network}
								<button
									type="button"
									class={`flex min-w-[132px] shrink-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-sm transition ${getNetworkButtonClass(activeNetworkFilter === network.key)}`}
									onclick={() => handleNetworkFilter(network.filterValue)}
									aria-pressed={activeNetworkFilter === network.key}
								>
									<div
										class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-50-950-token"
									>
										{#if network.logoUrl}
											<img
												src={`https://media.appgoblin.info/${network.logoUrl}`}
												alt={network.label}
												class="h-6 w-6 rounded object-contain"
												loading="lazy"
											/>
										{:else}
											<span class="text-xs font-semibold"
												>{network.label.slice(0, 2).toUpperCase()}</span
											>
										{/if}
									</div>
									<div class="min-w-0 flex-1">
										<div class="truncate text-sm font-medium leading-4">{network.label}</div>
										<div class="text-xs opacity-60">{network.count}</div>
									</div>
								</button>
							{/each}
						</div>
					</div>

					<div
						class="grid gap-2.5 md:grid-cols-2 xl:grid-cols-[170px_180px_minmax(220px,280px)_auto] xl:items-end"
					>
						<div>
							<label class="label">
								<span class="label-text text-[11px] uppercase tracking-[0.14em] opacity-60"
									>Category</span
								>
								<select
									id="category-select"
									class={`select ${!allowAdvancedFilters ? 'cursor-not-allowed opacity-60' : ''}`}
									disabled={!allowAdvancedFilters}
									value={data.selectedCategory || 'overall'}
									onchange={handleFilterChange}
								>
									{#each categoryOptions as cat}
										<option value={cat.value}>{cat.label}</option>
									{/each}
								</select>
							</label>
						</div>

						<div>
							<label class="label">
								<span class="label-text text-[11px] uppercase tracking-[0.14em] opacity-60"
									>Format</span
								>
								<select
									id="format-select"
									class={`select ${!allowAdvancedFilters ? 'cursor-not-allowed opacity-60' : ''}`}
									disabled={!allowAdvancedFilters}
									value={data.selectedFormat || 'all'}
									onchange={handleFilterChange}
								>
									{#each adCreativeFormats as fm}
										<option value={fm.value}>{fm.label}</option>
									{/each}
								</select>
							</label>
						</div>

						<div>
							<div
								class="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] opacity-60"
							>
								Orientation
							</div>
							<div
								class="flex h-10 w-full rounded-xl border border-surface-300 bg-surface-100-800-token p-1"
								role="radiogroup"
								aria-label="Creative orientation"
							>
								<button
									type="button"
									class={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-2 text-sm transition ${getOrientationButtonClass(selectedOrientationFilter === 'all')} ${!allowAdvancedFilters ? 'cursor-not-allowed opacity-55' : ''}`}
									disabled={!allowAdvancedFilters}
									role="radio"
									aria-checked={selectedOrientationFilter === 'all'}
									onclick={() => setOrientationFilter('all')}
								>
									<LayoutGrid size={16} />
									<span>All</span>
								</button>
								<button
									type="button"
									class={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-2 text-sm transition ${getOrientationButtonClass(selectedOrientationFilter === 'landscape')} ${!allowAdvancedFilters ? 'cursor-not-allowed opacity-55' : ''}`}
									disabled={!allowAdvancedFilters}
									role="radio"
									aria-checked={selectedOrientationFilter === 'landscape'}
									onclick={() => setOrientationFilter('landscape')}
								>
									<RectangleHorizontal size={16} />
									<span>Landscape</span>
								</button>
								<button
									type="button"
									class={`flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-2 text-sm transition ${getOrientationButtonClass(selectedOrientationFilter === 'portrait')} ${!allowAdvancedFilters ? 'cursor-not-allowed opacity-55' : ''}`}
									disabled={!allowAdvancedFilters}
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
							{#if selectedSearchCompany || (allowAdvancedFilters && (selectedCategory !== 'overall' || selectedFormat !== 'all' || selectedOrientationFilter !== 'all'))}
								<button
									type="button"
									class="rounded-full border border-surface-300 px-3 py-1.5 text-sm transition hover:bg-surface-100-800-token"
									onclick={clearAllFilters}
								>
									Clear all
								</button>
							{/if}
						</div>
					</div>

					<div class="flex flex-wrap items-center gap-2 text-xs md:text-sm">
						<span class="opacity-60">Current view:</span>
						{#if !isSignedIn}
							<span class="rounded-full border border-primary-300/60 bg-primary-50/60 px-2.5 py-1 text-primary-700 md:px-3 md:py-1.5">
								Preview limit {anonymousCreativeLimit}
							</span>
						{/if}
						<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
							>{creativeClusters.length} creatives</span
						>
						{#if allowAdvancedFilters && selectedCategory !== 'overall'}
							<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
								>{categoryOptions.find((cat) => cat.value === selectedCategory)?.label ||
									selectedCategory}</span
							>
						{/if}
						{#if allowAdvancedFilters && selectedFormat !== 'all'}
							<span class="rounded-full bg-surface-100-800-token px-2.5 py-1 md:px-3 md:py-1.5"
								>{adCreativeFormats.find((format) => format.value === selectedFormat)?.label ||
									selectedFormat}</span
							>
						{/if}
						{#if allowAdvancedFilters && selectedOrientationFilter !== 'all'}
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
				<div class="space-y-6">
					{#each creativeSections as section}
						<section class="space-y-5">
							<div
								class="flex flex-col gap-1 border-b border-surface-200-700-token pb-2 md:flex-row md:items-end md:justify-between"
							>
								<div>
									<h2 class="text-xl font-semibold">{section.label}</h2>
									<p class="mt-1 text-sm opacity-68">{section.description}</p>
								</div>
								<div class="text-sm opacity-60">{section.items.length} creatives</div>
							</div>

							<div
								class={`grid grid-cols-2 gap-x-3 gap-y-4 md:gap-y-5 ${section.orientation === 'portrait' ? 'md:grid-cols-3 md:gap-x-4 lg:grid-cols-4 2xl:grid-cols-5 2xl:gap-x-8' : 'md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-6 2xl:grid-cols-4 2xl:gap-x-8'} 2xl:gap-y-6`}
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
