<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import type { CompanyLayoutDetails, CompanyTypes, Crumb, MyCrumbMetadata } from '../../../types';

	import ExternalLink from '$lib/ExternalLink.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';
	import FollowToggleButton from '$lib/components/follows/FollowToggleButton.svelte';
	import MainContent from '$lib/MainContent.svelte';
	import CompanyTypesTabs from '$lib/utils/CompanyTypesTabs.svelte';

	let { children, data }: { children: any; data: CompanyLayoutDetails } = $props();
	const domain = page.params.domain ?? '';

	let companyTypesData = $derived((page.data as { companyTypes?: CompanyTypes }).companyTypes);
	let pageDataCrumbs = $derived(page.data.crumbs as Crumb<MyCrumbMetadata>[] | undefined);

	let categoryName = $derived(getAppCategory(page.params.category || ''));

	function getAppCategory(category: string) {
		if (category) {
			return category
				.split('_')
				.map((c) => c.charAt(0).toUpperCase() + c.slice(1))
				.join(' ');
		} else {
			return 'All ';
		}
	}

	function getSectionSlug(pathname: string) {
		if (pathname.includes('/app-adstxt/publisher/')) return 'app-adstxt-publisher';
		if (pathname.includes('/app-adstxt')) return 'app-adstxt';
		if (pathname.includes('/apps-added')) return 'apps-added';
		if (pathname.includes('/apps-lost')) return 'apps-lost';
		if (pathname.includes('/creatives')) return 'creatives';
		if (pathname.includes('/data-exports')) return 'data-exports';
		if (pathname.includes('/mediation')) return 'mediation';
		if (pathname.includes('/trends')) return 'trends';
		if (pathname.includes('/sdks')) return 'sdks';
		return 'overview';
	}

	function isSectionTabActive(tabSlug: string): boolean {
		if (tabSlug === 'app-adstxt') {
			return sectionSlug === 'app-adstxt' || sectionSlug === 'app-adstxt-publisher';
		}
		return sectionSlug === tabSlug;
	}

	function sectionTabClass(tabSlug: string): string {
		const selectedClass =
			'bg-secondary-100-900 text-surface-900-50 border-secondary-300-700 shadow-sm';
		const unselectedClass =
			'border-surface-200-800 text-surface-700-300 hover:border-secondary-300-700 hover:bg-surface-100-900';
		const parentOnlyClass = 'opacity-50';
		const isActive = isSectionTabActive(tabSlug);
		let cls = isActive ? selectedClass : unselectedClass;
		if (!isActive && isParentOnlyData(tabSlug)) {
			cls += ` ${parentOnlyClass}`;
		}
		return cls;
	}

	function isParentOnlyData(tabSlug: string): boolean {
		if (!tabInd) return false;
		switch (tabSlug) {
			case 'creatives':
				return tabInd.creatives_app_count > 0 && tabInd.creatives_app_count_direct === 0;
			case 'trends':
				return tabInd.has_trends > 0 && tabInd.has_trends_direct === 0;
			case 'apps-added':
			case 'apps-lost':
				return (
					(tabInd.apps_added_count > 0 || tabInd.apps_lost_count > 0) &&
					tabInd.apps_added_count_direct === 0 &&
					tabInd.apps_lost_count_direct === 0
				);
			case 'sdks':
				return tabInd.sdk_count > 0 && tabInd.sdk_count_direct === 0;
			case 'mediation':
				return tabInd.mediation_adapter_count > 0 && tabInd.mediation_adapter_count_direct === 0;
			case 'app-adstxt':
				return false;
			default:
				return false;
		}
	}

	let sectionSlug = $derived(getSectionSlug(page.url.pathname));
	let companyDomain = $derived(
		data.companyTree?.queried_domain || data.companyTree?.company_domain || domain
	);
	let tabInd = $derived(data.tabIndicators);
	let showCreativesTab = $derived(Boolean(tabInd?.creatives_app_count));
	let showTrendsTab = $derived(Boolean(tabInd?.has_trends));
	let showMediationTab = $derived(Boolean(tabInd?.mediation_adapter_count));
	let companyDisplayName = $derived(
		data.companyTree?.company_name ||
			data.companyTree?.company_domain ||
			data.companyTree?.queried_domain ||
			domain
	);

	let hasHigherLevelParent = $derived(
		Boolean(
			data.companyTree?.is_secondary_domain &&
			data.companyTree?.parent &&
			data.companyTree.parent.company_domain !== data.companyTree.company_domain
		)
	);
	let selectedCategoryName = $derived(
		categoryName && categoryName.trim() ? categoryName : 'All Apps'
	);
	let categoryContext = $derived(
		selectedCategoryName === 'All ' || selectedCategoryName === 'All Apps'
			? 'all app categories'
			: `${selectedCategoryName} apps`
	);

	let pageTitle = $derived.by(() => {
		switch (sectionSlug) {
			case 'apps-added':
				return `${companyDisplayName} Recently Added Client Apps | AppGoblin`;
			case 'apps-lost':
				return `${companyDisplayName} Recently Lost Client Apps | AppGoblin`;
			case 'trends':
				return `${companyDisplayName} Quarterly Market Share Trends | AppGoblin`;
			case 'sdks':
				return `${companyDisplayName} SDK Intelligence for ${categoryContext} | AppGoblin`;
			case 'mediation':
				return `${companyDisplayName} Mediation Adapter Coverage | AppGoblin`;
			case 'creatives':
				return `${companyDisplayName} Ad Creatives and Campaign Signals | AppGoblin`;
			case 'app-adstxt':
				return `${companyDisplayName} App-Ads.txt Direct and Reseller IDs | AppGoblin`;
			case 'app-adstxt-publisher':
				return `${companyDisplayName} App-Ads.txt Publisher ID Detail | AppGoblin`;
			case 'data-exports':
				return `${companyDisplayName} Mobile Intelligence Data Exports | AppGoblin`;
			default:
				return `${companyDisplayName} Mobile SDK, API, and App-Ads.txt Intelligence | AppGoblin`;
		}
	});

	let pageDescription = $derived.by(() => {
		switch (sectionSlug) {
			case 'apps-added':
				return `Review the latest Android and iOS apps that recently added ${companyDisplayName} across SDK, API-call, and app-ads.txt signals.`;
			case 'apps-lost':
				return `Review the latest Android and iOS apps that recently removed ${companyDisplayName} across SDK, API-call, and app-ads.txt signals.`;
			case 'trends':
				return `Analyze quarterly iOS and Android market share trends for ${companyDisplayName}, split by SDK/API and app-ads.txt direct signals.`;
			case 'sdks':
				return `Review the SDK footprint for ${companyDisplayName} across ${categoryContext}, including adtech, analytics, and developer tooling integrations.`;
			case 'mediation':
				return `Analyze mediation adapters used by ${companyDisplayName} and evaluate monetization stack coverage across real mobile apps.`;
			case 'creatives':
				return `Browse recent creatives linked to ${companyDisplayName} to monitor ad campaign activity, placement signals, and market behavior.`;
			case 'app-adstxt':
				return `Track app-ads.txt direct and reseller publisher IDs tied to ${companyDisplayName}, mapped to real app store IDs and updated daily.`;
			case 'app-adstxt-publisher':
				return `Inspect publisher-level app-ads.txt records connected to ${companyDisplayName}, including direct and reseller relationships across apps.`;
			case 'data-exports':
				return `Access structured data exports for ${companyDisplayName}, including app-ads.txt and SDK/API traffic intelligence for paid members.`;
			default:
				return `Explore ${companyDisplayName} across ${categoryContext} with app-level intelligence for SDK usage, API behavior, and app-ads.txt relationships.`;
		}
	});

	let breadcrumbList = $derived.by(() => {
		const crumbs = [
			{ name: 'Home', item: 'https://appgoblin.info/' },
			{ name: 'Companies', item: 'https://appgoblin.info/companies' },
			{
				name: companyDisplayName,
				item: `https://appgoblin.info/companies/${companyDomain}`
			}
		];

		if (sectionSlug !== 'overview') {
			crumbs.push({ name: sectionSlug.replace(/-/g, ' '), item: page.url.href });
		}

		return crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: crumb.item
		}));
	});

	let structuredData = $derived.by(() => {
		const companyUrl = `https://appgoblin.info/companies/${companyDomain}`;
		const logoUrl = data.companyTree?.company_logo_url
			? `https://media.appgoblin.info/${data.companyTree.company_logo_url}`
			: data.companyTree?.parent?.company_logo_url
				? `https://media.appgoblin.info/${data.companyTree.parent.company_logo_url}`
				: 'https://appgoblin.info/default_company_logo.png';

		return {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebPage',
					name: pageTitle,
					description: pageDescription,
					url: page.url.href,
					inLanguage: 'en',
					isPartOf: {
						'@type': 'WebSite',
						name: 'AppGoblin',
						url: 'https://appgoblin.info'
					},
					about: {
						'@id': `${companyUrl}#organization`
					}
				},
				{
					'@type': 'Organization',
					'@id': `${companyUrl}#organization`,
					name: companyDisplayName,
					url: companyUrl,
					logo: logoUrl
				},
				{
					'@type': 'BreadcrumbList',
					itemListElement: breadcrumbList
				}
			]
		};
	});

	let titleClass = 'h1 text-2xl md:text-3xl font-bold ';
	let titleSecondaryClass = 'text-xl font-bold  mr-2';
	let titleDividerClass = 'md:h-8 w-px bg-gray-300 mx-2';
	let customCrumbs = $derived.by((): Crumb<MyCrumbMetadata>[] => {
		const primaryType = data.companyDetails?.company_types?.[0];
		const typeName = primaryType
			? companyTypesData?.types.find((t) => t.url_slug === primaryType)?.name
			: undefined;

		const crumbs: Crumb<MyCrumbMetadata>[] = [{ title: 'Companies', url: '/companies' }];
		if (typeName && primaryType) {
			crumbs.push({ title: typeName, url: `/companies/types/${primaryType}` });
		}
		crumbs.push({ title: companyDisplayName });
		return crumbs;
	});
	let hasAdstxt = $derived(Boolean(tabInd?.adstxt_direct_app_count));
	let hasAppChanges = $derived(Boolean(tabInd?.apps_added_count || tabInd?.apps_lost_count));

	function formatCount(n: number | undefined | null): string {
		if (n == null || n === 0) return '';
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
		return String(n);
	}

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
			count: tabInd?.creatives_app_count ?? null
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
			visible: hasAppChanges,
			count: tabInd?.apps_added_count ?? null
		},
		{
			slug: 'apps-lost',
			label: 'Apps Lost',
			href: `/companies/${companyDomain}/apps-lost`,
			visible: hasAppChanges,
			count: tabInd?.apps_lost_count ?? null
		},
		{
			slug: 'sdks',
			label: 'SDKs',
			href: `/companies/${companyDomain}/sdks`,
			visible: Boolean(tabInd?.sdk_count),
			count: null
		},
		{
			slug: 'mediation',
			label: 'Mediation Adapters',
			href: `/companies/${companyDomain}/mediation`,
			visible: showMediationTab,
			count: tabInd?.mediation_adapter_count ?? null
		},
		{
			slug: 'app-adstxt',
			label: 'App-ads.txt',
			href: `/companies/${companyDomain}/app-adstxt`,
			visible: hasAdstxt,
			count: tabInd?.adstxt_direct_app_count ?? null
		},
		{
			slug: 'data-exports',
			label: 'Data Exports',
			href: `/companies/${companyDomain}/data-exports`,
			visible: hasAdstxt || Boolean(tabInd?.sdk_count),
			count: null as number | null
		}
	]);
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta
		name="keywords"
		content={`${domain}, ${selectedCategoryName}, adtech, advertising network, data tracking, mobile measurement, programmatic advertising, app-ads.txt, mobile advertising, ad tech analytics, AppGoblin`}
	/>
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />

	<meta
		property="og:image"
		content="https://appgoblin.info/previews/appgoblin_companies_smaller.png"
	/>
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:image"
		content="https://appgoblin.info/previews/appgoblin_companies_smaller.png"
	/>
	<link rel="canonical" href={page.url.href} />
	<meta name="robots" content="index, follow" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

{#if !page.params.domain && !page.url.pathname.includes('adstxt') && companyTypesData && companyTypesData.types.length > 0}
	<CompanyTypesTabs companyTypes={companyTypesData} />
{/if}

<div class="-ml-1 grid grid-cols-1 gap-6 md:-ml-4 md:grid-cols-[minmax(220px,260px)_1fr]">
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
						class={`rounded border px-3 py-2.5 text-sm font-medium transition ${sectionTabClass(link.slug)}`}
						aria-current={isSectionTabActive(link.slug) ? 'page' : undefined}
					>
						<span class="flex items-center justify-between gap-2">
							<span>{link.label}</span>
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

	<MainContent class="min-w-0 pl-1 md:pl-4">
		<div class="mb-4">
			<Breadcrumbs
				url={page.url}
				routeId={page.route.id}
				pageData={page.data}
				crumbs={pageDataCrumbs ?? customCrumbs}
			>
				{#snippet children({ crumbs })}
					<div>
						<span><a href="/" class="text-surface-900-100 hover:">Home</a></span>
						{#each crumbs as c}
							<span>/</span>
							<span>
								{#if c.title != 'Types' && c.title != 'Categories' && c.title != 'Publisher' && c.title != 'App-adstxt'}
									<a href={c.url} class="text-surface-900-100 hover:">
										{c.title}
										{c.metadata ? `(${c.metadata.extraValue})` : ''}
									</a>
								{:else}
									{c.title}
									{c.metadata ? `(${c.metadata.extraValue})` : ''}
								{/if}
							</span>
						{/each}
					</div>
				{/snippet}
			</Breadcrumbs>
		</div>

		<div class="flex items-center mb-2">
			{#await data.companyTree}
				<span class="text-lg">Loading...</span>
			{:then myTree}
				{#if typeof myTree == 'string'}
					<h1 class={titleClass}>{domain}</h1>
					<p class="text-red-500">Failed to load company tree.</p>
				{:else if myTree}
					<div class="flex flex-col md:flex-row items-left md:items-center">
						{#if page.url.pathname.includes('adstxt/publisher') && myTree.parent}
							<h1 class={titleClass}>
								<a href={`/companies/${myTree.parent.company_domain}`}
									>{myTree.parent.company_name || myTree.parent.company_domain}</a
								>
							</h1>
						{:else if myTree.company_domain || myTree.queried_domain}
							{#if myTree.company_logo_url}
								<img
									src="https://media.appgoblin.info/{myTree.company_logo_url}"
									alt={myTree.company_logo_url}
									class="w-20 h-20 rounded-sm mr-2 md:mr-8"
								/>
							{:else if myTree.parent?.company_logo_url}
								<img
									src="https://media.appgoblin.info/{myTree.parent.company_logo_url}"
									alt={myTree.parent.company_logo_url}
									class="w-20 h-20 rounded-sm mr-2 md:mr-8"
								/>
							{:else}
								<img
									src="/default_company_logo.png"
									alt="Default Company Logo"
									class="w-20 h-20 rounded-sm mr-2 md:mr-8"
								/>
							{/if}

							{#if !myTree.parent && !myTree.is_secondary_domain && !myTree.is_orphan}
								<!-- IS PARENT COMPANY -->
								<h1 class={titleClass}>
									{myTree.company_name ||
										myTree.company_domain ||
										myTree.queried_domain}{#if page.params.category}, App Category:
										{categoryName}{/if}
								</h1>
								<div class={titleDividerClass}></div>
								<ExternalLink domain={myTree.company_domain || myTree.queried_domain} />
							{:else if myTree.is_secondary_domain}
								<!-- IS SUB DOMAIN ONLY -->
								<h1 class={titleClass}>{myTree.queried_domain} / {categoryName}</h1>
								<div class={titleDividerClass}></div>
								<ExternalLink domain={myTree.queried_domain} />
								<div class={titleDividerClass}></div>
								<span class="flex row items-center">
									<h2 class={titleSecondaryClass}>Company:</h2>
									<CompanyButton
										companyName={myTree.company_name || undefined}
										companyDomain={myTree.company_domain || myTree.queried_domain}
										companyLogoUrl={myTree.company_logo_url || undefined}
									/>
								</span>
								{#if hasHigherLevelParent && myTree.parent}
									<div class={titleDividerClass}></div>
									<span class="flex row">
										<h2 class={titleSecondaryClass}>Parent:</h2>
										<CompanyButton
											companyName={myTree.parent.company_name}
											companyDomain={myTree.parent.company_domain}
											companyLogoUrl={myTree.parent.company_logo_url || undefined}
										/>
									</span>
								{/if}
							{:else}
								<!-- REGULAR COMPANY  -->
								<h1 class={titleClass}>
									{myTree.company_name || myTree.company_domain || myTree.queried_domain} / {categoryName}
								</h1>
								<div class={titleDividerClass}></div>
								<ExternalLink domain={myTree.company_domain || myTree.queried_domain} />
								{#if myTree.parent}
									<div class={titleDividerClass}></div>
									<!-- HAS PARENT COMPANY -->
									<span class="flex row">
										<h2 class={titleSecondaryClass}>Parent Company:</h2>
										<CompanyButton
											companyName={myTree.parent.company_name}
											companyDomain={myTree.parent.company_domain}
											companyLogoUrl={myTree.parent.company_logo_url || undefined}
										/>
									</span>
								{/if}
							{/if}
						{/if}
					</div>
					{#if data.companyLookup?.company_id}
						<div class="mt-2 md:mt-0 md:ml-4">
							<FollowToggleButton
								entity="company"
								label="Company"
								companyId={data.companyLookup.company_id}
								initialFollowing={Boolean(data.isFollowingCompany)}
							/>
						</div>
					{/if}
				{/if}
			{:catch error}
				<p class="text-red-500">{error.message}</p>
			{/await}
		</div>

		<div class="space-y-4 md:space-y-8">
			{@render children?.()}
		</div>
	</MainContent>
</div>
