<script lang="ts">
	import CompanyButton from '$lib/CompanyButton.svelte';
	import CreativeModal from '$lib/CreativeModal.svelte';
	import PopularCreativeCard from '$lib/PopularCreativeCard.svelte';
	import Crown from 'lucide-svelte/icons/crown';
	import Lock from 'lucide-svelte/icons/lock';
	import RankBadge from '$lib/RankBadge.svelte';
	import { createCreativeModal } from '$lib/stores/creativeModal.svelte';

	import { formatNumber } from '$lib/utils/formatNumber.js';

	let { data } = $props();

	// Derived splits
	const topGames = $derived(data.apps.filter((a) => a.category?.startsWith('game_')).slice(0, 10));
	const topApps = $derived(data.apps.filter((a) => !a.category?.startsWith('game_')).slice(0, 10));

	// Creative modal state
	const creativeModal = createCreativeModal();
	const reportUrl = 'https://appgoblin.info/reports/ad-user-acquisition-2026-june';
	const reportPublishedDate = '2026-07-22';
	const reportTemporalCoverage = '2026-06-01/2026-06-30';

	function formatPercent(num: number): string {
		return num.toFixed(1) + '%';
	}

	function formatSignedPercent(num?: number | null, digits = 0): string {
		if (num == null) return '—';
		const sign = num > 0 ? '+' : '';
		return `${sign}${num.toFixed(digits)}%`;
	}

	function formatWoWGrowth(num?: number | null): string {
		if (num == null) return '—';
		if (num > 500) {
			const multiplier = Math.round(num / 100);
			return `${multiplier}x`;
		}
		const sign = num > 0 ? '+' : '';
		return `${sign}${num.toFixed(0)}%`;
	}

	function getWoWGrowthColor(value?: number | null): string {
		if (value == null) return 'text-surface-400';
		if (value > 500) return 'text-success-600-400';
		if (value > 0) return 'text-success-800-200';
		if (value < 0) return 'text-rose-400';
		return 'text-surface-500';
	}

	function formatDecimal(num?: number | null, digits = 2): string {
		return num == null ? '—' : num.toFixed(digits);
	}

	function formatOptional(num?: number | null): string {
		return num == null ? '—' : String(formatNumber(num));
	}

	function formatRoundedOptional(num?: number | null): string {
		return num == null ? '—' : String(formatNumber(Math.round(num)));
	}

	function formatCurrency(num?: number | null): string {
		return num == null ? '—' : '$' + formatNumber(Math.round(num));
	}

	function formatWeekDate(dateStr?: string | null): string {
		if (!dateStr) return '—';
		if (dateStr.includes('T')) return dateStr.split('T')[0];
		return dateStr;
	}

	function getTierClass(tier: string): string {
		if (tier === 'Top') return 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300';
		if (tier === 'Big')
			return 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300';
		return 'bg-transparent text-surface-400';
	}

	const sectionTitleClass = 'text-2xl md:text-3xl font-bold text-surface-900-200';
	const sectionContainerClass = 'mb-20 pt-10 md:pt-12 border-t border-surface-200-800';
	const sectionHeaderSubtitleClass = 'text-sm md:text-base text-surface-600-400';
	const sectionHeaderBaseClass = 'my-4 md:my-6 p-3 md:p-4 border-t border-l-1';
	const sectionDescriptionClass = 'text-base md:text-lg space-y-3 md:space-y-4 mb-4 md:px-4';
	const sectionIntroRowClass = 'flex items-center gap-2 mb-4 md:mb-6';

	const publisherTextColor = 'font-bold text-primary-900-100';
	const creativesTextColor = 'font-bold text-secondary-900-100';
	const advertisersTextColor = 'font-bold text-success-900-100';
	const simpleMetricColor = 'text-base md:text-large text-surface-900-200';
	const sectionBodyClass = 'max-w-none mb-6';
	const paragraphClass = 'text-base md:text-lg leading-relaxed text-surface-800-300';
	const textMutedXsClass = 'text-xs text-surface-500-500';
	const textMutedXsCapClass = `${textMutedXsClass} capitalize`;
	const storeIdClass = `${textMutedXsClass} truncate max-w-[10rem] md:max-w-[16rem]`;
	const appLinkClass =
		'block text-xs md:text-lg font-semibold truncate max-w-[10rem] md:max-w-[16rem] text-surface-900-200';
	const tableRowClass =
		'border-b border-surface-200-800 hover:bg-surface-100-900 transition-colors';
	const tableAppIconClass =
		'w-9 h-9 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-lg shadow-sm flex-shrink-0';
	const cardTableWrapperClass = 'card overflow-hidden';
	const tableWrapperClass = 'report-table-shell report-table-scroll';
	const tableHeaderText = 'text-xs md:text-sm font-bold text-surface-900-200';
	const tableHeaderLeftClass = `px-1 md:px-2 py-2 ${tableHeaderText}`;
	const tableHeaderCenterClass = `px-1 md:px-2 py-2 ${tableHeaderText}`;
	const tableHeaderRightClass = `px-1 md:px-2 py-2 ${tableHeaderText}`;
	const companyButtonListClass = 'flex flex-wrap gap-0.5 md:gap-1';

	const metricGridClass = 'p-4 ';
	const subCardTextClass = 'text-surface-600-400';
	const tHeadClass = 'bg-surface-100-900';
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<link rel="canonical" href={reportUrl} />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="AppGoblin" />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:url" content={reportUrl} />
	<meta property="og:image" content="https://appgoblin.info/appgoblin_screenshot.png" />
	<meta property="og:image:alt" content="AppGoblin mobile UA intelligence report dashboard" />
	<meta property="article:published_time" content={reportPublishedDate} />
	<meta property="article:modified_time" content={new Date().toISOString().split('T')[0]} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:image" content="https://appgoblin.info/appgoblin_screenshot.png" />

	<!-- Structured Data for Report and NewsArticle -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': ['Report', 'NewsArticle'],
				'@id': `${reportUrl}#report`,
				url: reportUrl,
				mainEntityOfPage: {
					'@type': 'WebPage',
					'@id': reportUrl
				},
				name: data.title,
				headline: data.title,
				alternativeHeadline: `${data.summary.reportPeriod} mobile user acquisition report for ad buyers and growth teams`,
				description: data.description,
				inLanguage: 'en',
				datePublished: reportPublishedDate,
				dateModified: new Date().toISOString().split('T')[0],
				isAccessibleForFree: true,
				publisher: {
					'@id': `${reportUrl}#publisher`
				},
				author: {
					'@type': 'Organization',
					name: 'AppGoblin Mobile UA Intelligence'
				},
				image: {
					'@type': 'ImageObject',
					url: 'https://appgoblin.info/appgoblin_screenshot.png'
				},
				audience: [
					{
						'@type': 'Audience',
						audienceType: 'Mobile user acquisition buyers'
					},
					{
						'@type': 'Audience',
						audienceType: 'Ad sales and growth teams'
					}
				],
				about: [
					{
						'@type': 'Thing',
						name: 'Mobile User Acquisition',
						description: 'Performance signals for paid app growth and campaign distribution'
					},
					{
						'@type': 'Thing',
						name: 'Ad Networks and DSPs',
						description: 'Network reach, advertiser overlap, and creative volume'
					},
					{
						'@type': 'Thing',
						name: 'Creative Performance',
						description: 'Most-distributed video creatives in June 2026'
					}
				],
				mentions: [
					data.apps?.[0]
						? {
								'@type': 'MobileApplication',
								name: data.apps[0].app_name,
								identifier: data.apps[0].store_id,
								url: `https://appgoblin.info/apps/${data.apps[0].store_id}`
							}
						: null,
					data.adNetworks?.[0]
						? {
								'@type': 'Organization',
								name: data.adNetworks[0].ad_network_name,
								url: `https://appgoblin.info/companies/${data.adNetworks[0].ad_network_domain}`
							}
						: null
				].filter(Boolean),
				articleSection: ['Mobile Advertising', 'User Acquisition', 'AdTech'],
				keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : data.keywords,
				mainEntity: {
					'@id': `${reportUrl}#dataset`
				}
			},
			{
				'@type': 'Dataset',
				'@id': `${reportUrl}#dataset`,
				name: 'June 2026 Mobile App Advertising Intelligence',
				description:
					'Comprehensive dataset of app performance, ad networks, and creative strategies',
				publisher: {
					'@id': `${reportUrl}#publisher`
				},
				url: reportUrl,
				license: 'https://appgoblin.info/terms',
				spatialCoverage: {
					'@type': 'Place',
					name: 'Global'
				},
				temporalCoverage: reportTemporalCoverage,
				measurementTechnique: [
					'Mobile app network request telemetry',
					'Weekly installs trend analysis',
					'Creative distribution mapping'
				],
				distribution: [
					{
						'@type': 'DataDownload',
						encodingFormat: 'application/json'
					}
				],
				variableMeasured: [
					{
						'@type': 'PropertyValue',
						name: 'Apps Analyzed',
						value: '${data.summary.totalApps}'
					},
					{
						'@type': 'PropertyValue',
						name: 'Total Weekly Installs',
						value: '${data.summary.totalInstalls}'
					},
					{
						'@type': 'PropertyValue',
						name: 'Unique Creatives',
						value: '${data.summary.totalCreatives}'
					},
					{
						'@type': 'PropertyValue',
						name: 'Ad Networks Identified',
						value: '${data.summary.uniqueNetworks}'
					},
					{
						'@type': 'PropertyValue',
						name: 'Advertiser Count',
						value: '${data.summary.advertisers}'
					},
					{
						'@type': 'PropertyValue',
						name: 'AdTech Companies',
						value: '${data.summary.adtechCompanies}'
					},
					{
						'@type': 'PropertyValue',
						name: 'HTTPS Tracked Requests',
						value: '${data.summary.httpsTracked}'
					},
					{
						'@type': 'PropertyValue',
						name: 'API Domains',
						value: '${data.summary.apiDomains}'
					}
				]
			},
			{
				'@type': 'Organization',
				'@id': `${reportUrl}#publisher`,
				name: 'AppGoblin',
				url: 'https://appgoblin.info/',
				logo: {
					'@type': 'ImageObject',
					url: 'https://appgoblin.info/AppGoblin_Large_Logo.png'
				}
			},
			{
				'@type': 'WebPage',
				'@id': reportUrl,
				url: reportUrl,
				name: data.title,
				description: data.description,
				isPartOf: {
					'@id': 'https://appgoblin.info/#website'
				},
				about: {
					'@id': `${reportUrl}#report`
				}
			},
			{
				'@type': 'WebSite',
				'@id': 'https://appgoblin.info/#website',
				url: 'https://appgoblin.info/',
				name: 'AppGoblin'
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `${reportUrl}#breadcrumbs`,
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: 'https://appgoblin.info/'
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Reports',
						item: 'https://appgoblin.info/reports'
					},
					{
						'@type': 'ListItem',
						position: 3,
						name: data.title,
						item: reportUrl
					}
				]
			}
		]
	})}<\/script>`}
</svelte:head>

<div class="container mx-auto px-3 md:px-8 xl:px-16 py-6 md:py-8">
	<!-- Header Section -->
	<div class="mb-10 md:mb-12 text-center max-w-4xl mx-auto">
		<h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary-600-400">
			Mobile UA Report - {data.summary.reportPeriod}
		</h1>
		<p class="text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-surface-700-400">
			AppGoblin's free report shares the top mobile app's buying ads in June 2026. See which mobile
			ad networks were most popular for user acquisiton. See the video and image ads that were
			performing best for the top advertisers.
		</p>
	</div>

	<!-- Top CSV Download Banner -->
	<div class="mb-10 border border-primary-500 p-4 md:p-5">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
			<div class="flex items-center gap-2 min-w-0">
				<Crown class="w-5 h-5 shrink-0 text-primary-600-400" aria-hidden="true" />
				<p class="text-sm font-semibold text-surface-900-200 truncate">
					Advertiser CSV with estimated buying size
				</p>
				<p>
					See the top 100 apps that were buying mobile ads and running UA campaigns in June 2026.
				</p>
			</div>
			{#if data.hasB2BAccess}
				<a
					href="/reports/ad-user-acquisition-2026-june/advertisers-csv"
					class="btn preset-filled-primary-500 inline-flex items-center gap-2 p-2 text-sm shrink-0"
				>
					<Crown class="w-5 h-5 shrink-0" aria-hidden="true" />
					<span class="text-black">Download CSV</span>
					<span class="text-black">↓</span>
				</a>
			{:else}
				<a
					href="/pricing"
					class="btn preset-outlined-primary-500 inline-flex items-center gap-2 p-2 text-sm shrink-0"
				>
					<Lock class="w-3.5 h-3.5" aria-hidden="true" />
					<span>Upgrade to Download</span>
				</a>
			{/if}
		</div>
	</div>

	<div class="mb-12 p-5">
		<div class="grid grid-cols-1 xl:grid-cols-12 gap-5 md:gap-6 xl:items-stretch">
			<div class="space-y-4 xl:col-span-4">
				<div class="rounded-lg bg-primary-100-900 p-5">
					<h2 class="text-xl md:text-3xl font-bold leading-tight">June 2026's top ad buyers</h2>
				</div>

				<div class="rounded-lg border border-surface-200-800 p-4 md:p-5">
					<div class="text-base md:text-lg font-semibold mb-3">Top Games</div>
					<div class="grid grid-cols-5 sm:grid-cols-10 xl:grid-cols-5 gap-2 md:gap-3 mb-4">
						{#each topGames as app}
							<a href="/apps/{app.store_id}" class="group" title={app.app_name}>
								<img
									src="https://media.appgoblin.info/app-icons/{app.store_id}/{app.icon_128}"
									alt={app.app_name}
									class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm group-hover:scale-105 transition-transform"
									onerror={(e) =>
										((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
								/>
							</a>
						{/each}
					</div>

					<div class="text-base md:text-lg font-semibold mb-3">Top Apps</div>
					<div class="grid grid-cols-5 sm:grid-cols-10 xl:grid-cols-5 gap-2 md:gap-3 mb-4">
						{#each topApps as app}
							<a href="/apps/{app.store_id}" class="group" title={app.app_name}>
								<img
									src="https://media.appgoblin.info/app-icons/{app.store_id}/{app.icon_128}"
									alt={app.app_name}
									class="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm group-hover:scale-105 transition-transform"
									onerror={(e) =>
										((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
								/>
							</a>
						{/each}
					</div>

					<div class="text-base md:text-lg font-semibold mb-3">Ad Networks</div>
					<div class="flex flex-wrap gap-2 md:gap-3">
						{#each data.adNetworks.slice(0, 6) as network}
							<CompanyButton
								companyDomain={network.ad_network_domain}
								companyName={network.ad_network_name}
								companyLogoUrl={network.company_logo_url}
								size="logo-only"
							/>
						{/each}
					</div>
				</div>

				<div class="grid grid-cols-3 gap-3 text-center">
					<div class="rounded-lg bg-primary-100-900 p-3 shadow-sm">
						<div class="text-xl md:text-2xl font-bold text-primary-contrast-500">
							{formatOptional(data.summary.totalApps)}
						</div>
						<div class="text-sm font-bold text-primary-contrast-500">Apps</div>
					</div>
					<div class="rounded-lg bg-secondary-100-900 p-3 shadow-sm">
						<div class="text-xl md:text-2xl font-bold text-secondary-contrast-500">
							{formatOptional(data.summary.advertisers)}
						</div>
						<div class="text-sm font-bold text-secondary-contrast-500">Advertisers</div>
					</div>
					<div class="rounded-lg bg-primary-100-900 p-3 shadow-sm">
						<div class="text-xl md:text-2xl font-bold text-success-contrast-500">
							{formatOptional(data.summary.adtechCompanies)}
						</div>
						<div class="text-sm font-bold text-success-contrast-500">Platforms</div>
					</div>
				</div>
			</div>

			<div class="xl:col-span-6">
				<div class="featured-creatives-strip">
					{#each [data.popularCreatives[2], data.popularCreatives[8], data.popularCreatives[5]] as creative, index}
						<div class="featured-creative-slide">
							<PopularCreativeCard
								{creative}
								{index}
								titlePrefix="June Featured Creative"
								badgeLabel="Popular Creative"
								compact={true}
								dense={true}
								onOpen={(rawUrl, title) => creativeModal.open(rawUrl, title)}
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 1: EXECUTIVE SUMMARY -->
	<!-- ========================================= -->
	<div class={sectionContainerClass}>
		<div class="mb-16">
			<!-- Section Header -->
			<div class={`${sectionHeaderBaseClass}`}>
				<h2 class={sectionTitleClass}>Summary</h2>
				<p class={sectionHeaderSubtitleClass}>
					Key findings and performance overview for {data.summary.reportPeriod}
				</p>
			</div>

			<!-- Content -->
			<div class="px-2 md:px-4">
				<div class="max-w-none">
					<p class={paragraphClass}>
						In {data.summary.reportPeriod}, AppGoblin analyzed
						<strong class={publisherTextColor}>
							{formatNumber(data.summary.totalApps)} mobile apps
						</strong>
						and captured
						<strong class="">
							{formatNumber(data.summary.httpsTracked)} HTTPS events
						</strong>
						across
						<strong class="">
							{formatNumber(data.summary.apiDomains)} unique API domains
						</strong>, providing a detailed view of June's user acquisition trends.
					</p>
					<p class={`${paragraphClass} mt-4`}>
						These mobile ad campaigns spanned
						<strong class="">
							{formatNumber(data.summary.adtechCompanies)} AdTech platforms
						</strong>
						supporting
						<strong class={advertisersTextColor}>
							{formatNumber(data.summary.advertisers)} advertisers
						</strong>
						and
						<strong class={creativesTextColor}>
							{formatNumber(data.summary.totalCreatives)} creative assets
						</strong>
						on ad campaigns that saw some apps with correlated
						<strong class="">{data.summary.avgGrowth}% week on week installs growth </strong>.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 2: AD IMPACT ON INSTALLS -->
	<!-- ========================================= -->
	<div class={sectionContainerClass}>
		<div class={`${sectionHeaderBaseClass}`}>
			<h2 class={sectionTitleClass}>Advertising Apps that saw the Best Weekly Install Growth</h2>
			<p class={sectionHeaderSubtitleClass}>
				These apps saw the best week on week install growth while at the same time running ad
				campaigns.
			</p>
		</div>
		<div class={sectionDescriptionClass}>
			<p class="mt-2">
				<span class={publisherTextColor}>{data.apps[0].app_name}</span>
				which also showed up briefly at the end of
				<a href="https://appgoblin.info/reports/ad-user-acquisition-2026-may">
					the 2026 May UA report</a
				>, finished their May push with a high of +680k weekly installs. This music game was
				advertising via Google's ad network and using AppMetrica and AppsFlyer for attribution.
			</p>
			<p>
				A newer app that exploded in June 2026 was <span class={publisherTextColor}
					>{data.apps[1].app_name}</span
				>
				with
				{formatNumber(data.apps[1].weekly_installs)} weekly installs and a crazy
				<strong>166X week-over-week growth</strong> during their UA push. This is a new game from South
				Korean publisher NetMarble and throughout June it brought in 200k-700k new installs a week.
			</p>
			<p>
				<span class={publisherTextColor}>{data.apps[6].app_name}</span> increased weekly installs to nearly
				1 million in June as their UA campaigns kicked in. Duck Survivor is developed by Hong Kong's Joy
				Nice Games.
			</p>
		</div>
		<div class={cardTableWrapperClass}>
			<div class={tableWrapperClass}>
				<table class="report-table report-table--apps w-full">
					<thead class={tHeadClass}>
						<tr>
							<th class={tableHeaderLeftClass}>Rank</th>
							<th class={tableHeaderLeftClass}>App</th>
							<th class={`${tableHeaderLeftClass} hidden md:table-cell`}>Best Week</th>
							<th class={tableHeaderRightClass}>Installs (week)</th>
							<th class={`${tableHeaderRightClass} hidden lg:table-cell`}>WoW Growth</th>
							<th class={`${tableHeaderRightClass} hidden xl:table-cell`}>Rev. Est.</th>
							<th class={`${tableHeaderRightClass} hidden xl:table-cell`}>MAU</th>
							<th class={tableHeaderCenterClass}>Ad Creatives</th>
							<th class={tableHeaderCenterClass}>Ad Networks</th>
							<th class={`${tableHeaderCenterClass} hidden lg:table-cell`}>MMP</th>
						</tr>
					</thead>
					<tbody>
						{#each data.apps as app, index}
							<tr class={tableRowClass}>
								<td class="px-1 md:px-4 py-2 md:py-4 text-center">
									<RankBadge rank={index + 1} />
								</td>
								<td class="px-1 md:px-4 py-2 md:py-4">
									<a href="/apps/{app.store_id}" class="flex items-center gap-2 md:gap-3 min-w-0">
										<img
											src="https://media.appgoblin.info/app-icons/{app.store_id}/{app.icon_128}"
											alt={app.app_name}
											class={tableAppIconClass}
											onerror={(e) =>
												((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
										/>
										<div class="min-w-0">
											<div class={appLinkClass}>
												{app.app_name}
											</div>
											<div class={storeIdClass} title={app.store_id}>
												{app.store_id}
											</div>
										</div>
									</a>
								</td>
								<td
									class="hidden md:table-cell px-1 md:px-4 py-2 md:py-4 text-right whitespace-nowrap"
								>
									<div class={`text-xs md:text-lg ${simpleMetricColor}`}>
										{formatWeekDate(app.best_week)}
									</div>
								</td>
								<td class="px-1 md:px-4 py-2 md:py-4 text-right">
									<div class={`text-xs md:text-lg ${simpleMetricColor}`}>
										{formatNumber(app.weekly_installs)}
									</div>
									<div class={textMutedXsClass}>
										Base {formatRoundedOptional(app.baseline_installs)}
									</div>
								</td>
								<td
									class="hidden lg:table-cell px-1 md:px-4 py-2 md:py-4 text-right whitespace-nowrap"
								>
									<div class={`text-xs md:text-lg ${getWoWGrowthColor(app.wow_growth_pct)}`}>
										{formatWoWGrowth(app.wow_growth_pct)}
									</div>
								</td>
								<td
									class="hidden xl:table-cell px-1 md:px-4 py-2 md:py-4 text-right whitespace-nowrap"
								>
									<div class={`text-xs md:text-lg ${simpleMetricColor}`}>
										{formatCurrency(app.weekly_revenue_estimate)}
									</div>
								</td>
								<td
									class="hidden xl:table-cell px-1 md:px-4 py-2 md:py-4 text-right whitespace-nowrap"
								>
									<div class={`text-xs md:text-lg ${simpleMetricColor}`}>
										{formatOptional(app.monthly_active_users)}
									</div>
								</td>
								<td class="px-1 md:px-4 py-2 md:py-4 text-center">
									<div class="flex justify-center items-center gap-1">
										{#each app.creatives.slice(0, 3) as creative}
											<a
												href="/apps/{app.store_id}/ad-placements"
												class="relative group hover:scale-110 transition-transform duration-200"
												title="View ad placements for {app.app_name}"
											>
												<div
													class="w-10 h-10 rounded border border-surface-300 dark:border-surface-600 overflow-hidden group-hover:border-purple-500"
												>
													<img
														src="https://media.appgoblin.info/creatives/thumbs/{creative.md5_hash}.jpg"
														alt="Creative"
														class="w-full h-full object-cover"
														onerror={(e) => {
															const target = e.currentTarget as HTMLImageElement;
															const parent = target.parentElement;
															if (parent) {
																parent.innerHTML =
																	'<div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">N/A</div>';
															}
														}}
													/>
												</div>
											</a>
										{/each}
										{#if app.creative_count > 3}
											<span class={`${textMutedXsClass} font-semibold ml-1`}>
												+{app.creative_count - 3}
											</span>
										{/if}
									</div>
								</td>
								<td class="px-1 md:px-4 py-2 md:py-4 min-w-[8rem]">
									<div class={companyButtonListClass}>
										{#each app.ad_networks as network}
											<CompanyButton
												companyDomain={network.domain}
												companyLogoUrl={network.logo_url}
												size="logo-only"
											/>
										{/each}
									</div>
								</td>
								<td class="hidden lg:table-cell px-1 md:px-4 py-2 md:py-4 min-w-[6rem]">
									{#if app.mmps && app.mmps.length > 0}
										<div class={companyButtonListClass}>
											{#each app.mmps as mmp}
												<CompanyButton
													companyDomain={mmp.domain}
													companyLogoUrl={mmp.logo_url}
													size="logo-only"
												/>
											{/each}
										</div>
									{:else}
										<span class="text-xs text-surface-400">—</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 3: MOST POPULAR VIDEO CREATIVES -->
	<!-- ========================================= -->
	<div class={sectionContainerClass}>
		<!-- Section Header -->
		<div class={`${sectionHeaderBaseClass}`}>
			<h2 class={sectionTitleClass}>Most Popular Video Creatives</h2>
			<p class={sectionHeaderSubtitleClass}>
				Video ads with the widest mobile app distribution during {data.summary.reportPeriod}
			</p>
		</div>
		<!-- Content -->
		<div class={sectionDescriptionClass}>
			<p>
				These mobile app ad video creatives achieved the widest distribution among mobile publishers
				in {data.summary.reportPeriod}. The top performer was showing across
				<strong class="text-pink-600">{data.popularCreatives[0].publisher_count} publishers</strong>
				demonstrating its popularity and success as a mobile app ad creative.
			</p>
			<p>
				The leading creative in this sample belongs to
				<a href="/apps/{data.popularCreatives[0].advertiser_store_id}">
					{data.popularCreatives[0].advertiser_store_id}
				</a>
				and gives an example of a creative asset that was published broadly across various app ad placements.
			</p>
			<p>
				A notable trend here is that the AI generated creatives of the past couple months seem to be
				reduced in our sample. In fact a number of apps seem to be falling back to traditional tried
				and true styles like the floating pointer finger and UGC style gameplay.
			</p>
		</div>
		<!-- Creatives Grid -->
		<div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 xl:gap-6">
			{#each data.popularCreatives as creative, index}
				<PopularCreativeCard
					{creative}
					{index}
					titlePrefix="Popular Creative"
					badgeLabel="Most Popular"
					dense={true}
					onOpen={(rawUrl, title) => creativeModal.open(rawUrl, title)}
				/>
			{/each}
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 4: AD NETWORK LANDSCAPE -->
	<!-- ========================================= -->
	<div class={sectionContainerClass}>
		<!-- Section Header -->
		<div class={`${sectionHeaderBaseClass}`}>
			<h2 class={sectionTitleClass}>Ad Network Landscape</h2>
			<p class={sectionHeaderSubtitleClass}>
				The advertising platforms that powered {data.summary.reportPeriod} user acquisition campaigns
			</p>
		</div>
		<!-- Network Metrics Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			<div class={metricGridClass}>
				<div class={`mb-1`}>Publishers Apps That Ran Ads</div>
				<div class="text-3xl font-bold">
					{data.networkStats.totalPublishers.toLocaleString()}
				</div>
			</div>
			<div class={metricGridClass}>
				<div class={`${subCardTextClass} mb-1`}>App Advertisers</div>
				<div class="text-3xl font-bold">
					{data.summary.advertisers.toLocaleString()}
				</div>
			</div>
			<div class={metricGridClass}>
				<div class={`${subCardTextClass} mb-1`}>Ad Creatives (video & images)</div>
				<div class="text-3xl font-bold">
					{data.networkStats.totalNetworkCreatives.toLocaleString()}
				</div>
			</div>
		</div>
		<!-- Content -->
		<div class={sectionDescriptionClass}>
			<p>
				June 2026 shows <a href="/companies/bidease.com">BidEase</a> rising to with a huge 627 apps found
				publishing their ads.
			</p>
			<p>
				Another noteable rising ad network this month was <a href="/companies/criteo.com">Criteo</a> who
				saw a rise in mobile gaming ads.
			</p>
			<div class="list-disc list-inside space-y-1 px-8">
				<li>
					Publisher coverage and advertiser coverage do not move in lockstep, so broad reach does
					not always mean the widest advertiser base.
				</li>
			</div>
		</div>
		<div class={sectionDescriptionClass}>
			<p>Note on Methodology</p>
			<p class="text-sm">
				When looking at this data its important to keep the context of how it was collected. The
				data is aggregated from API calls made by opening apps and watching the ad network
				connections. As such, this does not include App Store advertising (Apple/Google) or social
				media ads (TikTok/Facebook/Instagram). Facebook Audience Network (FAN) is included, but as
				it is quite small it didn't make the top 10.
			</p>
		</div>
		<!-- Top Networks Cards -->
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
			{#each data.adNetworks as network, index}
				<a
					href="/companies/{network.ad_network_domain}"
					class="card p-4 border border-surface-200-800 hover:border-primary-400-600 transition-all duration-200 hover:shadow-lg flex flex-col"
				>
					<!-- Network Header -->
					<div class="flex items-center gap-3 mb-4">
						<img
							src="https://media.appgoblin.info/{network.company_logo_url}"
							alt={network.ad_network_name}
							class="w-12 h-12 rounded-lg border border-surface-200-800 shadow-sm shrink-0"
							onerror={(e) =>
								((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
						/>
						<div class="min-w-0 flex-1">
							<div class="text-base font-bold truncate text-surface-900-200">
								{network.ad_network_name}
							</div>
							{#if network.domains && network.domains.length > 0}
								<div class="text-xs text-surface-500-500 truncate">
									{network.domains.slice(0, 2).join(', ')}
									{#if network.domains.length > 2}
										<span class="text-surface-400">+{network.domains.length - 2}</span>
									{/if}
								</div>
							{:else}
								<div class="text-xs text-surface-500-500 truncate">
									{network.ad_network_domain}
								</div>
							{/if}
						</div>
						<RankBadge
							rank={index + 1}
							class="shrink-0"
							numberClass="text-sm font-semibold text-surface-500-400"
						/>
					</div>

					<!-- Stats Grid -->
					<div class="grid grid-cols-2 gap-3 mb-3">
						<div class="flex flex-col">
							<div class="text-sm mb-1">Publishers</div>
							<div>
								{network.publisher_count.toLocaleString()}
							</div>
						</div>
						<div class="flex flex-col">
							<div class="text-sm mb-1">Advertisers Tracked</div>
							<div>
								{network.advertiser_count.toLocaleString()}
							</div>
						</div>
					</div>

					<!-- Market Share -->
					<div class="pt-3 border-t border-surface-200-800 text-sm">
						<div class="flex items-center justify-between mb-2">
							<span>Market Share</span>
							<span>
								{((network.publisher_count / data.networkStats.totalPublishers) * 100).toFixed(1)}%
							</span>
						</div>

						<!-- Creatives Count -->
						<div class="mt-3 flex items-center justify-between">
							<span class="">Ad Creatives</span>
							<span class="">
								{network.creatives_count.toLocaleString()}
							</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 5: CAMPAIGN REACH ANALYSIS -->
	<!-- ========================================= -->
	<div class={sectionContainerClass}>
		<!-- Section Header -->
		<div class={`${sectionHeaderBaseClass}`}>
			<h2 class={sectionTitleClass}>Campaign Reach Analysis</h2>
			<p class={sectionHeaderSubtitleClass}>
				Publisher distribution strategies and market penetration insights
			</p>
		</div>
		<!-- Content -->
		<div class={sectionIntroRowClass}>
			<h3 class="text-xl font-bold text-emerald-900 dark:text-emerald-100">
				Reach Tiers & Distribution
			</h3>
		</div>
		<div class={sectionBodyClass}>
			<p class={paragraphClass}>
				These are the advertisers that appeared in the most unique publisher apps during {data
					.summary.reportPeriod}.
				{data.appReachData[0].advertiser_name} led the reach table with {data.appReachData[0]
					.unique_publishers}
				publishers and {data.appReachData[0].unique_creatives} creatives.
			</p>
			<p class={paragraphClass}>
				This is a useful set of apps for understanding which advertisers were able to spread
				creative across the widest publisher footprint in June 2026.
			</p>
		</div>
		<!-- Top Apps by Publisher Reach -->
		<div class={`mt-6 ${cardTableWrapperClass}`}>
			<div class={tableWrapperClass}>
				<table class="report-table report-table--reach w-full">
					<thead class={tHeadClass}>
						<tr>
							<th class={tableHeaderLeftClass}>Rank</th>
							<th class={tableHeaderLeftClass}>Advertising App</th>
							<th class={tableHeaderRightClass}>Count of Apps with their Ads</th>
							<th class={tableHeaderRightClass}>Ad Creatives</th>
							<th class={`${tableHeaderRightClass} hidden lg:table-cell`}>Buying Power</th>
							<th class={tableHeaderLeftClass}>Ad Networks</th>
							<th class={`${tableHeaderCenterClass} hidden lg:table-cell`}>MMP</th>
						</tr>
					</thead>
					<tbody>
						{#each data.appReachData.slice(0, 10) as app, index}
							<tr class={tableRowClass}>
								<td class="px-1 md:px-2 py-2 md:py-4 text-center">
									<RankBadge rank={index + 1} />
								</td>
								<td class="px-1 md:px-2 py-2 md:py-4">
									<a
										href="/apps/{app.advertiser_store_id}"
										class="flex items-center gap-2 md:gap-3 min-w-0"
									>
										<img
											src="https://media.appgoblin.info/app-icons/{app.advertiser_store_id}/{app.advertiser_icon_128}"
											alt={app.advertiser_name}
											class={tableAppIconClass}
											onerror={(e) =>
												((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
										/>
										<div class="min-w-0">
											<div class={appLinkClass}>
												{app.advertiser_name}
											</div>
											<div class={textMutedXsCapClass}>
												{app.advertiser_category?.replace(/_/g, ' ')}
											</div>
										</div>
									</a>
								</td>
								<td class="px-1 md:px-2 py-2 md:py-4 text-right">
									<span class={publisherTextColor}>
										{app.unique_publishers}
									</span>
								</td>
								<td class="px-1 md:px-2 py-2 md:py-4 text-right">
									<span class={creativesTextColor}>
										{app.unique_creatives}
									</span>
								</td>
								<td
									class="hidden lg:table-cell px-1 md:px-2 py-2 md:py-4 text-center whitespace-nowrap"
								>
									<span
										class="inline-block px-2 py-0.5 rounded text-xs font-bold {getTierClass(
											app.buying_size_tier
										)}"
									>
										{app.buying_size_tier}
									</span>
								</td>
								<td class="px-1 md:px-2 py-2 md:py-4 min-w-[8rem]">
									{#if app.ad_networks && app.ad_networks.length > 0}
										<div class={companyButtonListClass}>
											{#each app.ad_networks.slice(0, 4) as network}
												<CompanyButton
													companyDomain={network.domain}
													companyLogoUrl={network.logo_url}
													size="logo-only"
												/>
											{/each}
											{#if app.ad_networks.length > 4}
												<span class={`${textMutedXsClass} font-semibold`}
													>+{app.ad_networks.length - 4}</span
												>
											{/if}
										</div>
									{:else}
										<span class="text-xs text-surface-400">—</span>
									{/if}
								</td>
								<td class="hidden lg:table-cell px-1 md:px-2 py-2 md:py-4 text-right min-w-[6rem]">
									{#if app.mmps && app.mmps.length > 0}
										<div class={companyButtonListClass}>
											{#each app.mmps as mmp}
												<CompanyButton
													companyDomain={mmp.domain}
													companyLogoUrl={mmp.logo_url}
													size="logo-only"
												/>
											{/each}
										</div>
									{:else}
										<span class="text-xs text-surface-400">—</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 6: NEW APPS THIS MONTH -->
	<!-- ========================================= -->
	<div class={sectionContainerClass}>
		<div class={`${sectionHeaderBaseClass}`}>
			<h2 class={sectionTitleClass}>Newly Released Apps that were Buying Ads in June 2026</h2>
			<p class={sectionHeaderSubtitleClass}>
				Brand new apps starting off running ad campaigns during {data.summary.reportPeriod}
			</p>
		</div>
		<div class={sectionDescriptionClass}>
			<p>
				These apps were released recently, some even in June 2026, and were already running ad
				campaigns tracked by AppGoblin in June.
			</p>
			<p>
				<span class={publisherTextColor}>{data.newAdvertisers[5].name}</span> was a brand new game released
				by Unicorn Studio from Hong Kong. They blasted onto the Play Store with 800k+ weekly installs
				and quickly climbed over 1 million weekly installs. They, like most of the new category this month,
				were using Google Ad Mob to scale their game.
			</p>
			<p>
				<span class={publisherTextColor}>UFL - Soccer Game 2026</span> by XTEN LIMITED was likely soft
				launched in February (when AppGoblin first picked it up) and has since seen a parabolic increase
				installs since May, fueled by the 2026 World Cup and their mobile ad campaigns. They saw upwards
				of 400k weekly installs and have been doing very well. As might be expected, they used a mixture
				of real soccer video + gameplay for their ads.
			</p>
		</div>

		<!-- Games Sub-section -->
		{#if data.newGames.length > 0}
			<div class="mb-8">
				<h4 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="text-sky-900 dark:text-sky-100">New Games</span>
					<span class="text-sm font-normal text-surface-500 dark:text-surface-400">
						({Math.min(data.newGames.length, 10)} titles)
					</span>
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
					{#each data.newGames.slice(0, 10) as app (app.store_id)}
						<div
							class="card p-4 md:p-5 border border-surface-200-800 hover:border-primary-400-600 transition-all duration-200 hover:shadow-lg flex flex-col"
						>
							<!-- Card Header -->
							<a href="/apps/{app.store_id}" class="flex items-center gap-3 mb-3 group">
								{#if app.icon_128}
									<img
										src="https://media.appgoblin.info/app-icons/{app.store_id}/{app.icon_128}"
										alt={app.name}
										class="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm shrink-0"
										onerror={(e) =>
											((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
									/>
								{:else}
									<img
										src="/default_company_logo.png"
										alt={app.name}
										class="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm shrink-0"
									/>
								{/if}
								<div class="min-w-0">
									<div
										class="text-base md:text-lg font-bold truncate group-hover:underline text-surface-800-200"
									>
										{app.name}
									</div>
									<div class="text-xs md:text-sm text-surface-500 dark:text-surface-400 truncate">
										{app.store_id}
									</div>
								</div>
							</a>

							<!-- Stats Row -->
							<div class="flex items-center gap-3 text-sm md:text-lg mb-3">
								{#if app.installs}
									<span class="font-bold text-emerald-400">
										{formatNumber(app.installs)} installs
									</span>
									<span class="text-surface-500">·</span>
								{/if}
								<span class="text-surface-600 dark:text-surface-400 text-sm md:text-base">
									released: {app.release_date ? app.release_date.split('T')[0] : '—'}
								</span>
							</div>

							<!-- Creatives Thumbnails -->
							{#if app.md5_hashes && app.md5_hashes.length > 0}
								<div class="mt-auto pt-3 border-t border-surface-200 dark:border-surface-700">
									<div class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-2">
										{app.creative_count} creative{app.creative_count !== 1 ? 's' : ''}
									</div>
									<div class="flex flex-wrap gap-1.5">
										{#each app.md5_hashes.slice(0, 3) as md5_hash, ci}
											{@const fileExt = app.md5_file_extensions?.[ci] ?? 'mp4'}
											<button
												onclick={() =>
													creativeModal.open(
														`https://media.appgoblin.info/creatives/raw/${md5_hash.substring(0, 3)}/${md5_hash}.${fileExt}`,
														app.name
													)}
												class="relative group cursor-pointer hover:scale-110 transition-transform duration-200"
												title="Click to view creative"
											>
												<div
													class="w-16 h-16 md:w-20 md:h-20 rounded-lg border border-surface-300 dark:border-surface-600 overflow-hidden group-hover:border-sky-500"
												>
													<img
														src="https://media.appgoblin.info/creatives/thumbs/{md5_hash}.jpg"
														alt="Creative"
														class="w-full h-full object-cover"
														onerror={(e) => {
															const target = e.currentTarget as HTMLImageElement;
															const parent = target.parentElement;
															if (parent) {
																parent.innerHTML =
																	'<div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">N/A</div>';
															}
														}}
													/>
												</div>
											</button>
										{/each}
										{#if app.md5_hashes.length > 4}
											<button
												onclick={() =>
													creativeModal.open(
														`https://media.appgoblin.info/creatives/raw/${app.md5_hashes[4].substring(0, 3)}/${app.md5_hashes[4]}.${app.md5_file_extensions?.[4] ?? 'mp4'}`,
														app.name
													)}
												class="w-16 h-16 md:w-20 md:h-20 rounded-lg border border-dashed border-surface-300 dark:border-surface-600 flex items-center justify-center text-xs font-semibold text-surface-500 hover:border-sky-500 hover:text-sky-500 transition-colors"
												title="View all creatives"
											>
												+{app.md5_hashes.length - 4}
											</button>
										{/if}
									</div>
								</div>
							{/if}

							<!-- Ad Networks -->
							<div class="mt-3">
								<div class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1.5">
									Ad Networks
								</div>
								<div class={companyButtonListClass}>
									{#each app.ad_networks.slice(0, 3) as network}
										<CompanyButton
											companyDomain={network.domain}
											companyLogoUrl={network.logo_url}
											size="logo-only"
										/>
									{/each}
									{#if app.ad_networks.length > 3}
										<span class={`${textMutedXsClass} font-semibold`}
											>+{app.ad_networks.length - 3}</span
										>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Apps Sub-section -->
		{#if data.newApps.length > 0}
			<div>
				<h4 class="text-xl font-bold mb-4 flex items-center gap-2">
					<span class="text-sky-900 dark:text-sky-100">New Apps (Not Games)</span>
					<span class="text-sm font-normal text-surface-500 dark:text-surface-400">
						({Math.min(data.newApps.length, 5)} titles)
					</span>
				</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
					{#each data.newApps.slice(0, 5) as app (app.store_id)}
						<div
							class="card p-4 md:p-5 border border-surface-200-800 hover:border-secondary-400-600 transition-all duration-200 hover:shadow-lg flex flex-col"
						>
							<!-- Card Header -->
							<a href="/apps/{app.store_id}" class="flex items-center gap-3 mb-3 group">
								{#if app.icon_128}
									<img
										src="https://media.appgoblin.info/app-icons/{app.store_id}/{app.icon_128}"
										alt={app.name}
										class="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm shrink-0"
										onerror={(e) =>
											((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
									/>
								{:else}
									<img
										src="/default_company_logo.png"
										alt={app.name}
										class="w-14 h-14 md:w-16 md:h-16 rounded-xl border border-surface-200 dark:border-surface-700 shadow-sm shrink-0"
									/>
								{/if}
								<div class="min-w-0">
									<div
										class="text-base md:text-lg font-bold truncate group-hover:underline text-surface-800-200"
									>
										{app.name}
									</div>
									<div class="text-xs md:text-sm text-surface-500 dark:text-surface-400 truncate">
										{app.store_id}
									</div>
								</div>
							</a>

							<!-- Stats Row -->
							<div class="flex items-center gap-3 text-sm md:text-lg mb-3">
								{#if app.installs}
									<span class="font-bold text-purple-400">
										{formatNumber(app.installs)} installs
									</span>
									<span class="text-surface-500">·</span>
								{/if}
								<span class="text-surface-600 dark:text-surface-400 text-sm md:text-base">
									{app.release_date ? app.release_date.split('T')[0] : '—'}
								</span>
							</div>

							<!-- Ad Networks -->
							<div class="mb-3">
								<div class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-1.5">
									Ad Networks
								</div>
								<div class={companyButtonListClass}>
									{#each app.ad_networks.slice(0, 3) as network}
										<CompanyButton
											companyDomain={network.domain}
											companyLogoUrl={network.logo_url}
											size="logo-only"
										/>
									{/each}
									{#if app.ad_networks.length > 3}
										<span class={`${textMutedXsClass} font-semibold`}
											>+{app.ad_networks.length - 3}</span
										>
									{/if}
								</div>
							</div>

							<!-- Creatives Thumbnails -->
							{#if app.md5_hashes && app.md5_hashes.length > 0}
								<div class="mt-auto pt-3 border-t border-surface-200 dark:border-surface-700">
									<div class="text-sm font-semibold text-surface-600 dark:text-surface-400 mb-2">
										{app.creative_count} creative{app.creative_count !== 1 ? 's' : ''}
									</div>
									<div class="flex flex-wrap gap-1.5">
										{#each app.md5_hashes.slice(0, 4) as md5_hash, ci}
											{@const fileExt = app.md5_file_extensions?.[ci] ?? 'mp4'}
											<button
												onclick={() =>
													creativeModal.open(
														`https://media.appgoblin.info/creatives/raw/${md5_hash.substring(0, 3)}/${md5_hash}.${fileExt}`,
														app.name
													)}
												class="relative group cursor-pointer hover:scale-110 transition-transform duration-200"
												title="Click to view creative"
											>
												<div
													class="w-16 h-16 md:w-20 md:h-20 rounded-lg border border-surface-300 dark:border-surface-600 overflow-hidden group-hover:border-sky-500"
												>
													<img
														src="https://media.appgoblin.info/creatives/thumbs/{md5_hash}.jpg"
														alt="Creative"
														class="w-full h-full object-cover"
														onerror={(e) => {
															const target = e.currentTarget as HTMLImageElement;
															const parent = target.parentElement;
															if (parent) {
																parent.innerHTML =
																	'<div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">N/A</div>';
															}
														}}
													/>
												</div>
											</button>
										{/each}
										{#if app.md5_hashes.length > 4}
											<button
												onclick={() =>
													creativeModal.open(
														`https://media.appgoblin.info/creatives/raw/${app.md5_hashes[4].substring(0, 3)}/${app.md5_hashes[4]}.${app.md5_file_extensions?.[4] ?? 'mp4'}`,
														app.name
													)}
												class="w-16 h-16 md:w-20 md:h-20 rounded-lg border border-dashed border-surface-300 dark:border-surface-600 flex items-center justify-center text-xs font-semibold text-surface-500 hover:border-sky-500 hover:text-sky-500 transition-colors"
												title="View all creatives"
											>
												+{app.md5_hashes.length - 4}
											</button>
										{/if}
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<!-- CTA Section -->
	<div class={sectionContainerClass}>
		<div class={`${sectionHeaderBaseClass} pl-4 border-l-1`}>
			<h2 class={sectionTitleClass}>Want to leverage AppGoblin's insights?</h2>
			<p class={sectionHeaderSubtitleClass}>Choose the next step that fits your team</p>
		</div>

		<!-- Content -->
		<div class={sectionDescriptionClass}>
			<p>
				Use pricing to unlock AppGoblin data, or create a free account to explore the platform
				today.
			</p>

			<div
				class="rounded-xl border border-primary-500/30 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 p-5 md:p-6 mt-6"
			>
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
					<div>
						<h3 class="text-lg font-bold text-primary-900-100 flex items-center gap-2">
							<Crown class="w-5 h-5 text-primary-900-100" aria-hidden="true" />
							B2B Intelligence — Advertiser CSV
						</h3>
						<p class="text-sm text-surface-600 dark:text-surface-300 mt-1">
							Top 100 advertisers we tracked in {data.summary.reportPeriod} with estimated buying size,
							ad networks, publisher reach, and creative counts — one row per advertiser.
						</p>
					</div>
					{#if data.hasB2BAccess}
						<a
							href="/reports/ad-user-acquisition-2026-june/advertisers-csv"
							class="btn preset-filled-primary-500 inline-flex items-center gap-2 p-3 shrink-0"
						>
							<span class="text-black">Download CSV</span>
							<span class="text-black">↓</span>
						</a>
					{:else}
						<a
							href="/pricing"
							class="btn preset-outlined-primary-500 inline-flex items-center gap-2 p-3 shrink-0"
						>
							<Lock class="w-4 h-4" aria-hidden="true" />
							<span>Upgrade to Download</span>
						</a>
					{/if}
				</div>

				<div class="border-t border-primary-500/20 pt-4 mt-2">
					<p
						class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3"
					>
						CSV Columns
					</p>
					<div
						class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-xs md:text-sm"
					>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">store_id</span><span
								class="text-surface-500 dark:text-surface-400">App store bundle ID</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">app_name</span><span
								class="text-surface-500 dark:text-surface-400">App name</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">category</span><span
								class="text-surface-500 dark:text-surface-400">App category</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">developer</span><span
								class="text-surface-500 dark:text-surface-400">Developer name</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">report_period</span><span
								class="text-surface-500 dark:text-surface-400">June 2026</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">weekly_installs</span><span
								class="text-surface-500 dark:text-surface-400"
								>Peak weekly installs (max across June)</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">total_estimated_installs</span><span
								class="text-surface-500 dark:text-surface-400">Lifetime estimated installs</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">unique_publishers</span><span
								class="text-surface-500 dark:text-surface-400"
								>Publisher apps running their ads</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">unique_creatives_count</span><span
								class="text-surface-500 dark:text-surface-400">Unique ad creatives tracked</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">ad_networks</span><span
								class="text-surface-500 dark:text-surface-400"
								>Ad networks used (semicolon-separated)</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">mmp_providers</span><span
								class="text-surface-500 dark:text-surface-400">MMP/attribution providers</span
							>
						</div>
						<div class="flex gap-2">
							<span class="font-mono font-semibold shrink-0">estimated_buying_size_score</span><span
								class="text-surface-500 dark:text-surface-400"
								>Our rough estimate of ad buying scale</span
							>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-wrap items-center justify-center gap-3 mt-6">
				<a
					href="/auth/signup"
					class="btn preset-filled-primary-500 inline-flex items-center gap-2 p-3"
				>
					<span class="text-black">Create Free Account</span>
					<span class="text-black">→</span>
				</a>
				<a
					href="/pricing"
					class="btn preset-outlined-primary-500 inline-flex items-center gap-2 p-3"
				>
					<span>View Pricing</span>
					<span>→</span>
				</a>
			</div>
		</div>
	</div>
</div>

<!-- Footer -->
<div
	class="mt-20 pt-12 border-t-2 border-surface-200 dark:border-surface-700 text-center text-sm text-surface-500 dark:text-surface-400"
>
	<p>
		Data source: AppGoblin Ad Intelligence Platform | Report Period: {data.summary.reportPeriod}
	</p>
	<p class="mt-2">
		For more insights and detailed analytics, visit <a
			href="/"
			class="text-purple-600 hover:underline">AppGoblin.info</a
		>
	</p>
	<p class="text-sm text-surface-500 mt-4">Report Generated: {data.summary.generatedDate}</p>
</div>

<!-- Creative Modal -->
<CreativeModal
	bind:isOpen={creativeModal.isOpen}
	creativeUrl={creativeModal.creativeUrl}
	title={creativeModal.title}
/>

<style>
	.featured-creatives-strip {
		display: flex;
		gap: 1rem;
		overflow-x: auto;
		padding-bottom: 0.25rem;
		scroll-snap-type: x proximity;
		overscroll-behavior-x: contain;
		-webkit-overflow-scrolling: touch;
	}

	.featured-creative-slide {
		min-width: min(18rem, 82vw);
		flex: 0 0 auto;
		scroll-snap-align: start;
	}

	.report-table-shell {
		max-width: 100%;
	}

	.report-table-scroll {
		overflow-x: auto;
		overflow-y: hidden;
		overscroll-behavior-x: contain;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 0.25rem;
	}

	.report-table {
		min-width: 100%;
	}

	@media (max-width: 767px) {
		.report-table--apps {
			min-width: 45rem;
		}

		.report-table--network {
			min-width: 34rem;
		}

		.report-table--reach {
			min-width: 38rem;
		}

		.report-table--new-apps {
			min-width: 42rem;
		}
	}

	@media (min-width: 768px) {
		.featured-creatives-strip {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			align-items: stretch;
			height: 100%;
			overflow: visible;
			padding-bottom: 0;
		}

		.featured-creative-slide {
			min-width: 0;
			height: 100%;
		}
	}
</style>
