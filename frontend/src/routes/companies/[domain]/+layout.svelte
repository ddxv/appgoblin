<script lang="ts">
	import { page } from '$app/state';
	import Breadcrumbs from '$lib/Breadcrumbs.svelte';
	import type { CompanyLayoutDetails, CompanyTypes, Crumb, MyCrumbMetadata } from '../../../types';

	import ExternalLink from '$lib/ExternalLink.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';
	import MainContent from '$lib/MainContent.svelte';
	import CompanyTypesTabs from '$lib/utils/CompanyTypesTabs.svelte';
	import CompanyNavTabs from '$lib/utils/CompanyNavTabs.svelte';

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

	let sectionSlug = $derived(getSectionSlug(page.url.pathname));
	let companyDomain = $derived(
		data.companyTree?.queried_domain || data.companyTree?.company_domain || domain
	);
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
	let isParentCompany = $derived(
		Boolean(
			data.companyTree &&
			!data.companyTree.parent &&
			!data.companyTree.is_secondary_domain &&
			!data.companyTree.is_orphan
		)
	);
	let isSecondaryDomain = $derived(Boolean(data.companyTree?.is_secondary_domain));
	let isStubDomain = $derived(Boolean(data.companyTree?.is_orphan));

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
			case 'apps-added-adstxt':
				return `${companyDisplayName} Recently Added App-Ads.txt Apps | AppGoblin`;
			case 'apps-lost-adstxt':
				return `${companyDisplayName} Recently Lost App-Ads.txt Apps | AppGoblin`;
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
				return `Review the latest Android and iOS apps that recently added ${companyDisplayName} via verified SDK and API-call signals.`;
			case 'apps-lost':
				return `Review the latest Android and iOS apps that recently removed ${companyDisplayName} via verified SDK and API-call signals.`;
			case 'apps-added-adstxt':
				return `Review the latest Android and iOS apps with new app-ads.txt DIRECT listings for ${companyDisplayName}.`;
			case 'apps-lost-adstxt':
				return `Review the latest Android and iOS apps where ${companyDisplayName} lost their app-ads.txt DIRECT listing.`;
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
	<CompanyNavTabs tabIndicators={data.tabIndicators} {companyDomain} {companyDisplayName} />

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

		<div class="mb-2">
			{#await data.companyTree}
				<span class="text-lg">Loading...</span>
			{:then myTree}
				{#if typeof myTree == 'string'}
					<h1 class="h1 text-2xl md:text-3xl font-bold">{domain}</h1>
					<p class="text-red-500">Failed to load company tree.</p>
				{:else if myTree}
					<div class="flex items-start gap-3 md:gap-5">
						<!-- Logo -->
						{#if page.url.pathname.includes('adstxt/publisher') && myTree.parent}
							{#if myTree.parent.company_logo_url}
								<img
									src="https://media.appgoblin.info/{myTree.parent.company_logo_url}"
									alt={myTree.parent.company_logo_url}
									class="w-14 h-14 rounded-sm shrink-0"
								/>
							{:else}
								<img
									src="/default_company_logo.png"
									alt="Default Company Logo"
									class="w-14 h-14 rounded-sm shrink-0"
								/>
							{/if}
						{:else if myTree.company_logo_url}
							<img
								src="https://media.appgoblin.info/{myTree.company_logo_url}"
								alt={myTree.company_logo_url}
								class="w-14 h-14 rounded-sm shrink-0"
							/>
						{:else if myTree.parent?.company_logo_url}
							<img
								src="https://media.appgoblin.info/{myTree.parent.company_logo_url}"
								alt={myTree.parent.company_logo_url}
								class="w-14 h-14 rounded-sm shrink-0"
							/>
						{:else}
							<img
								src="/default_company_logo.png"
								alt="Default Company Logo"
								class="w-14 h-14 rounded-sm shrink-0"
							/>
						{/if}

						<!-- Name + Type Badge (Line 1) + Relationship Info (Line 2) -->
						<div class="min-w-0">
							<!-- Line 1: Company Name + Type Badge -->
							<div class="flex flex-wrap items-center gap-2">
								{#if page.url.pathname.includes('adstxt/publisher') && myTree.parent}
									<h1 class="h1 text-2xl md:text-3xl font-bold">
										<a href={`/companies/${myTree.parent.company_domain}`} class="hover:underline"
											>{myTree.parent.company_name || myTree.parent.company_domain}</a
										>
									</h1>
								{:else if isParentCompany}
									<h1 class="h1 text-2xl md:text-3xl font-bold">
										{myTree.company_name || myTree.company_domain || myTree.queried_domain}
										{#if page.params.category}, App Category: {categoryName}{/if}
									</h1>
									<span class="badge preset-filled-secondary-500 text-xs">Parent Company</span>
								{:else if isSecondaryDomain}
									<h1 class="h1 text-2xl md:text-3xl font-bold">
										{myTree.queried_domain}
										{#if page.params.category}
											/ {categoryName}{/if}
									</h1>
									<span class="badge preset-filled-warning-500-100 text-xs">Secondary Domain</span>
								{:else if isStubDomain}
									<h1 class="h1 text-2xl md:text-3xl font-bold">
										{myTree.queried_domain}
										{#if page.params.category}
											/ {categoryName}{/if}
									</h1>
									<span class="badge preset-filled-error-900-100 text-xs">Unmapped Domain</span>
								{:else}
									<!-- Regular Company -->
									<h1 class="h1 text-2xl md:text-3xl font-bold">
										{myTree.company_name || myTree.company_domain || myTree.queried_domain}
										{#if page.params.category}
											/ {categoryName}{/if}
									</h1>
								{/if}
							</div>

							<!-- Line 2: External Link + Entity Relationships -->
							<div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm">
								{#if !isSecondaryDomain && (!isStubDomain || page.url.pathname.includes('adstxt/publisher'))}
									<ExternalLink
										domain={page.url.pathname.includes('adstxt/publisher') && myTree.parent
											? myTree.parent.company_domain || myTree.queried_domain
											: myTree.company_domain || myTree.queried_domain}
									/>
								{/if}

								{#if isSecondaryDomain}
									<span class="flex items-center gap-1.5">
										<span
											class="text-surface-600-400 text-[11px] font-medium uppercase tracking-wide"
										>
											Belongs to:
										</span>
										<CompanyButton
											companyName={myTree.company_name || undefined}
											companyDomain={myTree.company_domain || myTree.queried_domain}
											companyLogoUrl={myTree.company_logo_url || undefined}
											size="sm"
										/>
									</span>
									{#if hasHigherLevelParent && myTree.parent}
										<span class="flex items-center gap-1.5">
											<span
												class="text-surface-500-400 text-[11px] font-medium uppercase tracking-wide"
											>
												Parent:
											</span>
											<CompanyButton
												companyName={myTree.parent.company_name}
												companyDomain={myTree.parent.company_domain}
												companyLogoUrl={myTree.parent.company_logo_url || undefined}
												size="sm"
											/>
										</span>
									{/if}
									<!-- Secondary domain external link: use the queried domain, placed at end -->
									<ExternalLink domain={myTree.queried_domain} />
								{/if}

								{#if !isParentCompany && !isSecondaryDomain && !isStubDomain && myTree.parent}
									<span class="flex items-center gap-1.5">
										<span
											class="text-surface-600-400 text-[11px] font-medium uppercase tracking-wide"
										>
											Part of:
										</span>
										<CompanyButton
											companyName={myTree.parent.company_name}
											companyDomain={myTree.parent.company_domain}
											companyLogoUrl={myTree.parent.company_logo_url || undefined}
											size="sm"
										/>
									</span>
								{/if}

								{#if isStubDomain}
									<div class="flex flex-wrap items-center gap-3 mt-1">
										<a href="/contact" class="btn preset-tonal-secondary btn-sm">
											Identify Parent
										</a>
										<span class="text-surface-600-400 text-xs">
											This domain is currently identified as a standalone entity and is not linked
											to a parent organization in our database. Please contact if you would like
											this mapped or have information to share.
										</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
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
