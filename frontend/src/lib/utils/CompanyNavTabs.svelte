<script lang="ts">
	import { page } from '$app/state';
	import Crown from 'lucide-svelte/icons/crown';
	import type { CompanyTabIndicators } from '../../types';

	let {
		tabIndicators,
		companyDomain,
		companyDisplayName
	}: {
		tabIndicators: CompanyTabIndicators;
		companyDomain: string;
		companyDisplayName: string;
	} = $props();

	function formatCount(n: number | undefined | null): string {
		if (n == null || n === 0) return '';
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
		return String(n);
	}

	function getSectionSlug(pathname: string) {
		if (pathname.includes('/app-adstxt/publisher/')) return 'app-adstxt-publisher';
		if (pathname.includes('/app-adstxt')) return 'app-adstxt';
		if (pathname.includes('/apps-added-adstxt')) return 'apps-added-adstxt';
		if (pathname.includes('/apps-lost-adstxt')) return 'apps-lost-adstxt';
		if (pathname.includes('/apps-added')) return 'apps-added';
		if (pathname.includes('/apps-lost')) return 'apps-lost';
		if (pathname.includes('/creatives')) return 'creatives';
		if (pathname.includes('/data-exports')) return 'data-exports';
		if (pathname.includes('/mediation')) return 'mediation';
		if (pathname.includes('/trends')) return 'trends';
		if (pathname.includes('/sdks')) return 'sdks';
		return 'overview';
	}

	function isSectionTabActive(tabSlug: string, currentSlug: string): boolean {
		if (tabSlug === 'app-adstxt') {
			return currentSlug === 'app-adstxt' || currentSlug === 'app-adstxt-publisher';
		}
		return currentSlug === tabSlug;
	}

	function isParentOnlyData(tabSlug: string): boolean {
		if (!tabIndicators) return false;
		switch (tabSlug) {
			case 'creatives':
				return (
					tabIndicators.creatives_app_count > 0 && tabIndicators.creatives_app_count_direct === 0
				);
			case 'trends':
				return tabIndicators.has_trends > 0 && tabIndicators.has_trends_direct === 0;
			case 'apps-added':
			case 'apps-lost':
				return (
					(tabIndicators.apps_sdk_added_count > 0 || tabIndicators.apps_sdk_lost_count > 0) &&
					tabIndicators.apps_sdk_added_count_direct === 0 &&
					tabIndicators.apps_sdk_lost_count_direct === 0
				);
			case 'sdks':
				return tabIndicators.sdk_count > 0 && tabIndicators.sdk_count_direct === 0;
			case 'mediation':
				return (
					tabIndicators.mediation_adapter_count > 0 &&
					tabIndicators.mediation_adapter_count_direct === 0
				);
			case 'app-adstxt':
			case 'apps-added-adstxt':
			case 'apps-lost-adstxt':
				return false;
			default:
				return false;
		}
	}

	function sectionTabClass(tabSlug: string, currentSlug: string): string {
		const selectedClass =
			'bg-secondary-100-900 text-surface-900-50 border-secondary-300-700 shadow-sm';
		const unselectedClass =
			'border-surface-200-800 text-surface-700-300 hover:border-secondary-300-700 hover:bg-surface-100-900';
		const parentOnlyClass = 'opacity-50';
		const isActive = isSectionTabActive(tabSlug, currentSlug);
		let cls = isActive ? selectedClass : unselectedClass;
		if (!isActive && isParentOnlyData(tabSlug)) {
			cls += ` ${parentOnlyClass}`;
		}
		return cls;
	}

	let sectionSlug = $derived(getSectionSlug(page.url.pathname));

	let showCreativesTab = $derived(Boolean(tabIndicators?.creatives_app_count));
	let showTrendsTab = $derived(Boolean(tabIndicators?.has_trends));
	let showMediationTab = $derived(Boolean(tabIndicators?.mediation_adapter_count));
	let hasAdstxt = $derived(Boolean(tabIndicators?.adstxt_direct_app_count));
	let hasAppsAdded = $derived(Boolean(tabIndicators?.apps_sdk_added_count));
	let hasAppsLost = $derived(Boolean(tabIndicators?.apps_sdk_lost_count));
	let hasAdstxtAppsAdded = $derived(Boolean(tabIndicators?.apps_adstxt_direct_added_count));
	let hasAdstxtAppsLost = $derived(Boolean(tabIndicators?.apps_adstxt_direct_lost_count));

	let sectionLinks = $derived([
		{
			slug: 'overview',
			label: `${companyDisplayName} Apps Overview`,
			href: `/companies/${companyDomain}`,
			visible: true,
			count: null as number | null
		},
		{
			slug: 'creatives',
			label: 'Creatives',
			href: `/companies/${companyDomain}/creatives`,
			visible: showCreativesTab,
			count: tabIndicators?.creatives_app_count ?? null
		},
		{
			slug: 'trends',
			label: 'Trends',
			href: `/companies/${companyDomain}/trends`,
			visible: showTrendsTab,
			count: null
		},
		{
			slug: 'apps-added',
			label: 'Apps Added',
			href: `/companies/${companyDomain}/apps-added`,
			visible: hasAppsAdded,
			b2b: true,
			count: tabIndicators?.apps_sdk_added_count ?? null
		},
		{
			slug: 'apps-lost',
			label: 'Apps Lost',
			href: `/companies/${companyDomain}/apps-lost`,
			visible: hasAppsLost,
			b2b: true,
			count: tabIndicators?.apps_sdk_lost_count ?? null
		},
		{
			slug: 'apps-added-adstxt',
			label: 'Apps Added (ads.txt)',
			href: `/companies/${companyDomain}/apps-added-adstxt`,
			visible: hasAdstxtAppsAdded,
			b2b: true,
			count: tabIndicators?.apps_adstxt_direct_added_count ?? null
		},
		{
			slug: 'apps-lost-adstxt',
			label: 'Apps Lost (ads.txt)',
			href: `/companies/${companyDomain}/apps-lost-adstxt`,
			visible: hasAdstxtAppsLost,
			b2b: true,
			count: tabIndicators?.apps_adstxt_direct_lost_count ?? null
		},
		{
			slug: 'sdks',
			label: 'SDKs',
			href: `/companies/${companyDomain}/sdks`,
			visible: Boolean(tabIndicators?.sdk_count),
			count: null
		},
		{
			slug: 'mediation',
			label: 'Mediation Adapters',
			href: `/companies/${companyDomain}/mediation`,
			visible: showMediationTab,
			count: tabIndicators?.mediation_adapter_count ?? null
		},
		{
			slug: 'app-adstxt',
			label: 'App-ads.txt',
			href: `/companies/${companyDomain}/app-adstxt`,
			visible: hasAdstxt,
			count: tabIndicators?.adstxt_direct_app_count ?? null
		},
		{
			slug: 'data-exports',
			label: 'Full Client App CSVs',
			href: `/companies/${companyDomain}/data-exports`,
			visible: hasAdstxt || Boolean(tabIndicators?.sdk_count),
			b2b: true,
			count: null as number | null
		}
	]);
</script>

<aside class="md:sticky md:top-4 md:self-start">
	<div class="rounded border border-surface-200-800 bg-surface-100-900/20 p-3 md:p-4">
		<div class="mb-3">
			<h2 class="text-sm font-semibold uppercase tracking-[0.14em] opacity-70">Sections</h2>
			<p class="mt-1 text-xs text-surface-500">Browse company intelligence views.</p>
		</div>
		<nav class="flex flex-col gap-2" aria-label="Company sections">
			{#each sectionLinks.filter((link) => link.visible) as link (link.slug)}
				<a
					href={link.href}
					class={`rounded border px-3 py-2.5 text-sm font-medium transition ${sectionTabClass(link.slug, sectionSlug)}`}
					aria-current={isSectionTabActive(link.slug, sectionSlug) ? 'page' : undefined}
				>
					<span class="flex items-center justify-between gap-2">
						<span>
							{#if link.b2b}
								<Crown
									class="inline w-3 h-3 mr-0.5 -mt-0.5 text-primary-900-100"
									aria-hidden="true"
								/>
							{/if}
							{link.label}
						</span>
						{#if link.count}
							<span
								class="inline-flex items-center justify-center rounded-full bg-secondary-100-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-secondary-800-200"
							>
								{formatCount(link.count)}
							</span>
						{/if}
					</span>
				</a>
			{/each}
		</nav>
	</div>
</aside>
