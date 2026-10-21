<script lang="ts">
	import CompaniesOverviewTable from './ReportCompaniesOverviewTable.svelte';
	import ReportSectionEditorial from './ReportSectionEditorial.svelte';
	import StoreIcon from '$lib/StoreIcon.svelte';
	import Download from '@lucide/svelte/icons/download';
	import Lock from '@lucide/svelte/icons/lock';

	let { data } = $props();

	type SupportMetric = {
		label: string;
		value: number | null;
		format: 'share' | 'signedPercent' | 'count' | 'compact';
		tone?: 'negative';
	};

	type LeaderboardCompany = {
		companyDomain: string;
		companyName: string;
		companyLogoUrl: string | null;
		primaryValue: number | null;
		share: number | null;
		installs: number | null;
		totalAppCount: number | null;
		qoqShareChange: number | null;
		appsAdded: number | null;
	};

	type PanelView = 'good' | 'bad' | 'single';
	type PanelPlatform = 'google' | 'apple';
	type PanelSignal = 'sdk' | 'adstxt';

	type ReportPanel = {
		id: string;
		title: string;
		description: string;
		meta: string;
		topGood?: LeaderboardCompany[];
		topBad?: LeaderboardCompany[];
		topEntries?: LeaderboardCompany[];
	};

	type ReportSection = {
		id: string;
		companyCategory?: string;
		companyCategories?: string[];
		signal?: PanelSignal;
		presentation: 'signed' | 'single';
		primaryMetricLabel: string;
		primaryFormat: 'signedPercent' | 'count';
		goodLabel?: string;
		badLabel?: string;
		listLabel?: string;
		tone?: 'positive' | 'negative';
		panels: ReportPanel[];
	};

	type CompanyTypeOption = {
		value: string;
		label: string;
		count: number;
	};

	let selectedCompanyIndex = $state<Record<string, number>>({});
	let selectedCompanyType = $state<Record<string, string>>({});
	let selectedSurfacePanel = $state<Record<string, string>>({});

	const DEFAULT_COMPANY_TYPE = 'Ad Networks';
	const FALLBACK_COMPANY_TYPE = 'all_mapped';
	const QOQ_MARKET_SHARE_CHANGE_LABEL = '2026 Q2 Market Share Growth';

	const breakoutSectionClass = 'border-t border-surface-200 py-8 dark:border-surface-700';
	const reportContainerClass = 'container mx-auto max-w-7xl px-4 py-10';
	const reportCardBaseClass =
		'border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900';
	const reportCardBorderClass = 'border border-surface-200 dark:border-surface-700';
	const reportHeadingClass = 'font-bold';
	const reportBrandNameClass = `text-sm font-semibold ${reportHeadingClass}`;
	const reportEyebrowClass = `text-[11px] uppercase tracking-[0.18em] `;
	const reportBadgeNameClass = `text-xs font-semibold ${reportHeadingClass}`;
	const reportBadgeEyebrowClass = `text-[10px] uppercase tracking-[0.16em] `;
	const breakoutPanelClass = `rounded-md ${reportCardBaseClass}`;
	const sectionHeaderClass = 'mb-4 flex flex-col gap-2';
	const sectionTitleClass = `text-2xl md:text-3xl ${reportHeadingClass}`;
	const sectionDescriptionClass = `max-w-3xl `;
	const richSectionDescriptionClass = `max-w-3xl [&_a]:font-semibold [&_a]:text-primary-700 [&_a:hover]:underline dark:[&_a]:text-primary-300 [&_p+p]:mt-3`;
	const panelHeaderClass = 'border-b border-surface-200 p-4 dark:border-surface-700 md:p-5';
	const panelDescriptionClass = `text-sm leading-6 `;
	const panelControlsClass =
		'mt-4 grid gap-2 md:grid-cols-[minmax(0,1.15fr)_minmax(11rem,0.75fr)_minmax(9rem,0.65fr)] md:items-end';
	const controlGroupClass = 'rounded-xl bg-white/90 p-2.5 md:w-full dark:bg-surface-900/85';
	const controlGroupLabelClass = `mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]`;
	const breakoutMetaPillClass =
		'rounded-md bg-surface-50-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] whitespace-nowrap';
	const detailStatCardClass = 'rounded-md bg-surface-50 p-4 text-center dark:bg-surface-800';
	const brandLockupClass = 'inline-flex items-center gap-3 px-1 py-1';
	const reportBadgeClass = 'inline-flex items-center gap-2';
	const selectControlClass =
		'w-full min-w-0 rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm font-medium shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-surface-700 dark:bg-surface-900 dark:focus:ring-primary-900';
	const storeButtonBaseClass =
		'group relative inline-flex flex-1 items-center justify-center rounded-xl border px-3 py-2.5 text-sm font-semibold shadow-sm transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500';
	const logoBadgeRailClass = 'flex flex-wrap gap-2 md:gap-4';
	const featuredShellClass = 'p-4 md:p-5';
	const featuredCardClass = 'rounded-xl bg-white p-4 dark:bg-surface-900 md:p-5';
	const featuredHeaderClass = 'flex flex-col gap-4';
	const featuredIdentityClass = 'flex flex-col gap-3 md:items-start';
	const metadataRailClass = 'flex flex-wrap gap-2 md:flex-nowrap';
	const featuredCompanyLinkClass =
		'inline-flex items-center gap-4 rounded-2xl px-4 py-4 transition';
	const companyLogoClass = 'h-24 w-24 rounded-xl border border-surface-200-800';
	const companyNameClass = 'text-2xl font-black leading-tight md:text-3xl';
	const companyDomainClass = 'mt-1 text-sm font-medium';
	const trendLabelClass = 'text-xs font-semibold uppercase tracking-[0.14em]';
	const detailMetricsGridClass = 'mt-3 grid gap-3 md:mx-auto md:max-w-4xl md:grid-cols-3';
	const detailMetricLabelClass = `text-sm `;
	const detailSummaryClass = `mt-5 max-w-2xl text-sm leading-7 `;
	const shortlistHeaderClass = 'mb-3 flex items-center justify-between gap-3';
	const emptyPanelClass = 'p-5 text-sm';
	const heroLayoutClass = 'flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between';
	const heroIntroClass = 'max-w-4xl';
	const heroEyebrowRowClass = 'mb-4 flex flex-wrap items-center gap-3';
	const heroDescriptionClass = `mt-4 max-w-3xl space-y-3 text-base leading-7  md:text-lg md:leading-8`;
	const heroActionsClass = 'flex flex-col gap-3 lg:min-w-72';
	const reportButtonClass = 'btn inline-flex items-center justify-center gap-2 rounded-xl p-3';
	const reportBodyClass = `text-base leading-7`;

	function formatCompactNumber(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return '—';
		}
		return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
	}

	function formatShare(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return '—';
		}

		const percent = value * 100;
		const digits = percent >= 10 ? 1 : 2;
		return `${percent.toFixed(digits)}%`;
	}

	function formatSignedPercent(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return '—';
		}

		const absolute = Math.abs(value);
		const digits = absolute >= 100 ? 0 : absolute >= 10 ? 1 : 2;
		const sign = value > 0 ? '+' : value < 0 ? '−' : '';
		return `${sign}${absolute.toFixed(digits)}%`;
	}

	function supportsAdstxt(companyType: string): boolean {
		return companyType === DEFAULT_COMPANY_TYPE;
	}

	function getCompanyTypeOptions(sectionId: string): CompanyTypeOption[] {
		return data.companyTypeOptions;
	}

	function getCompanyTypeLabel(sectionId: string, companyType: string): string {
		return (
			getCompanyTypeOptions(sectionId).find(
				(option: CompanyTypeOption) => option.value === companyType
			)?.label ?? companyType
		);
	}

	function getMetricSection(sectionId: string, companyType: string): ReportSection {
		const typedSections = data.metricSectionsByCompanyType?.[companyType] ?? data.metricSections;
		const fallbackSection = data.metricSections.find((section) => section.id === sectionId);

		if (!fallbackSection) {
			throw new Error(`Missing metric section: ${sectionId}`);
		}

		return (
			typedSections.find((section: ReportSection) => section.id === sectionId) ?? fallbackSection
		);
	}

	function getSectionCompanyType(section: ReportSection): string {
		return section.companyCategory ?? getSelectedCompanyType(section.id);
	}

	function getSectionCategoryLabel(section: ReportSection, companyType: string): string {
		return section.companyCategories ? 'Analytics' : getCompanyTypeLabel(section.id, companyType);
	}

	function setSelectedCompanyType(sectionId: string, companyType: string): void {
		selectedCompanyType[sectionId] = companyType;

		const selectedSection = getMetricSection(sectionId, companyType);
		const currentPanelId = selectedSurfacePanel[sectionId];
		const currentPanel = currentPanelId
			? selectedSection.panels.find((panel) => panel.id === currentPanelId)
			: undefined;

		if (currentPanel && !supportsAdstxt(companyType) && getPanelSignal(currentPanel) === 'adstxt') {
			selectedSurfacePanel[sectionId] = getPanelForAxes(
				selectedSection,
				getPanelPlatform(currentPanel),
				'sdk'
			).id;
		}

		if (
			selectedSection.panels.length > 0 &&
			!selectedSection.panels.some((panel) => panel.id === selectedSurfacePanel[sectionId])
		) {
			selectedSurfacePanel[sectionId] = selectedSection.panels[0].id;
		}

		for (const panel of selectedSection?.panels ?? []) {
			selectedCompanyIndex[panel.id] = 0;
		}
	}

	function getSelectedCompanyType(sectionId: string): string {
		const options = getCompanyTypeOptions(sectionId);
		const selectedType = selectedCompanyType[sectionId];
		if (
			selectedType &&
			options.some((option: CompanyTypeOption) => option.value === selectedType)
		) {
			return selectedType;
		}

		const hasDefaultType = options.some(
			(option: CompanyTypeOption) => option.value === DEFAULT_COMPANY_TYPE
		);
		return hasDefaultType ? DEFAULT_COMPANY_TYPE : FALLBACK_COMPANY_TYPE;
	}

	function getSelectedPanel(section: ReportSection, companyType: string): ReportPanel {
		const defaultPanel = section.panels[0];
		if (!defaultPanel) {
			throw new Error(`Missing surface panel for section: ${section.id}`);
		}

		const panel =
			section.panels.find(
				(panel) => panel.id === (selectedSurfacePanel[section.id] ?? defaultPanel.id)
			) ?? defaultPanel;

		if (!supportsAdstxt(companyType) && getPanelSignal(panel) === 'adstxt') {
			return getPanelForAxes(section, getPanelPlatform(panel), 'sdk');
		}

		return panel;
	}

	function selectSurfacePanel(sectionId: string, panelId: string): void {
		selectedSurfacePanel[sectionId] = panelId;
		selectedCompanyIndex[panelId] = 0;
	}

	function getPanelView(section: ReportSection, panel: ReportPanel): PanelView {
		if (section.presentation === 'single') {
			return 'single';
		}

		return 'good';
	}

	function getPanelPlatform(panel: ReportPanel): PanelPlatform {
		return panel.id.includes('google') ? 'google' : 'apple';
	}

	function getPanelSignal(panel: ReportPanel): PanelSignal {
		return panel.id.includes('adstxt') ? 'adstxt' : 'sdk';
	}

	function getPanelForAxes(
		section: ReportSection,
		platform: PanelPlatform,
		signal: PanelSignal
	): ReportPanel {
		return (
			section.panels.find(
				(panel) => getPanelPlatform(panel) === platform && getPanelSignal(panel) === signal
			) ?? section.panels[0]
		);
	}

	function setSelectedPlatform(
		section: ReportSection,
		activePanel: ReportPanel,
		platform: PanelPlatform
	): void {
		const nextPanel = getPanelForAxes(section, platform, getPanelSignal(activePanel));
		selectSurfacePanel(section.id, nextPanel.id);
	}

	function setSelectedSignal(
		section: ReportSection,
		activePanel: ReportPanel,
		signal: PanelSignal
	): void {
		if (signal === 'adstxt' && !supportsAdstxt(getSelectedCompanyType(section.id))) {
			return;
		}
		const nextPanel = getPanelForAxes(section, getPanelPlatform(activePanel), signal);
		selectSurfacePanel(section.id, nextPanel.id);
	}

	function getCompanyLogoUrl(url: string | null | undefined): string {
		if (!url) {
			return '/default_company_logo.png';
		}

		return url.startsWith('http') ? url : `https://media.appgoblin.info/${url}`;
	}

	function getCompanyBadgeClass(panelId: string, index: number): string {
		const selectedIndex = selectedCompanyIndex[panelId] ?? 0;
		const isSelected = selectedIndex === index;
		const base =
			'group relative inline-flex min-h-[6.25rem] w-24 flex-col items-center justify-center gap-2 rounded-xl border bg-white px-2 py-2 shadow-sm transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-surface-900';

		if (isSelected) {
			return `${base} scale-[1.06] border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200 dark:border-primary-400 dark:bg-primary-950/40 dark:ring-primary-900`;
		}

		return `${base} border-surface-200 hover:border-primary-300 hover:bg-primary-50/70 dark:border-surface-700 dark:hover:border-primary-700 dark:hover:bg-primary-950/30`;
	}

	function getCompanyBadgeMetricClass(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return 'text-surface-500';
		}

		if (value < 0) {
			return 'text-red-600 dark:text-red-300';
		}

		return 'text-primary-600-400';
	}

	function getPlatformLabel(platform: PanelPlatform): string {
		return platform === 'google' ? 'Google Play' : 'Apple App Store';
	}

	function getSignalLabel(signal: PanelSignal): string {
		return signal === 'sdk' ? 'SDK' : 'Direct app-ads.txt';
	}

	function getPanelCompanies(panel: ReportPanel, view: PanelView): LeaderboardCompany[] {
		switch (view) {
			case 'good':
				return panel.topGood ?? [];
			case 'bad':
				return panel.topBad ?? [];
			case 'single':
			default:
				return panel.topEntries ?? [];
		}
	}

	function getSelectedCompany(
		panelId: string,
		companies: LeaderboardCompany[]
	): LeaderboardCompany | null {
		if (!companies.length) {
			return null;
		}

		const index = selectedCompanyIndex[panelId] ?? 0;
		return companies[Math.min(index, companies.length - 1)] ?? companies[0];
	}

	function selectCompany(panelId: string, index: number): void {
		selectedCompanyIndex[panelId] = index;
	}

	function isNegativeDisplay(section: ReportSection, view: PanelView): boolean {
		if (section.presentation === 'signed') {
			return view === 'bad';
		}

		return section.tone === 'negative';
	}

	function formatMetricValue(
		value: number | null | undefined,
		format: SupportMetric['format'] | ReportSection['primaryFormat']
	): string {
		switch (format) {
			case 'share':
				return formatShare(value);
			case 'signedPercent':
				return formatSignedPercent(value);
			case 'compact':
				return formatCompactNumber(value);
			case 'count':
			default:
				if (typeof value !== 'number' || Number.isNaN(value)) {
					return '—';
				}
				return value.toLocaleString();
		}
	}

	function getPrimaryTone(
		presentation: ReportSection['presentation'],
		tone: ReportSection['tone'] | undefined,
		value: number | null
	): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return '';
		}

		if (presentation === 'signed') {
			return value < 0 ? 'text-error-500' : 'text-primary-600-400';
		}

		if (tone === 'negative') {
			return 'text-error-500';
		}

		return '';
	}

	function getDetailMetricTone(metric: SupportMetric): string {
		if (metric.format === 'signedPercent') {
			return getPrimaryTone('signed', 'positive', metric.value);
		}

		if (metric.tone === 'negative') {
			return 'text-red-600 dark:text-red-300';
		}

		return '';
	}

	function getDetailMetrics(section: ReportSection, company: LeaderboardCompany): SupportMetric[] {
		const qoqMetric: SupportMetric = {
			label: QOQ_MARKET_SHARE_CHANGE_LABEL,
			value: company.qoqShareChange,
			format: 'signedPercent'
		};

		if (section.id.startsWith('qoq-share-change-')) {
			return [
				{ label: 'Apps Detected', value: company.appsAdded, format: 'count' },
				qoqMetric,
				{ label: '30-day installs', value: company.installs, format: 'compact' }
			];
		}

		if (section.id === 'apps-lost') {
			return [
				{
					label: section.primaryMetricLabel,
					value: company.primaryValue,
					format: section.primaryFormat,
					tone: 'negative'
				},
				qoqMetric,
				{ label: 'Apps Detected', value: company.appsAdded, format: 'count' }
			];
		}

		return [
			{
				label: section.primaryMetricLabel,
				value: company.primaryValue,
				format: section.primaryFormat
			},
			qoqMetric,
			{ label: 'Apps Detected', value: company.appsAdded, format: 'count' }
		];
	}

	function getTrendIcon(isNegative: boolean): string {
		return isNegative ? '↘' : '↗';
	}

	function getTrendIconClass(isNegative: boolean): string {
		return isNegative ? 'text-error-500' : 'text-primary-600-400';
	}

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': ['Report', 'NewsArticle'],
		name: data.title,
		headline: 'AppGoblin Mobile Ecosystem Report Q2 2026',
		description: data.description,
		url: 'https://appgoblin.info/reports/app-ecosystem-report-Q2-2026',
		datePublished: '2026-08-17',
		dateModified: new Date().toISOString().split('T')[0],
		publisher: {
			'@type': 'Organization',
			name: 'AppGoblin',
			logo: {
				'@type': 'ImageObject',
				url: 'https://appgoblin.info/AppGoblin_Large_Logo.png'
			}
		},
		author: {
			'@type': 'Organization',
			name: 'AppGoblin Intelligence'
		},
		keywords: data.keywords,
		license: 'https://creativecommons.org/licenses/by/4.0/',
		isBasedOn: 'https://appgoblin.info'
	});

	const heroCardClass = `rounded-3xl ${reportCardBorderClass} bg-white/90 p-8 shadow-xl dark:bg-surface-900/90`;
	const panelCardClass = `rounded-3xl ${reportCardBaseClass} p-6 shadow-sm`;
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta name="keywords" content={data.keywords} />
	<link rel="canonical" href="https://appgoblin.info/reports/app-ecosystem-report-Q2-2026" />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="AppGoblin" />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:url" content="https://appgoblin.info/reports/app-ecosystem-report-Q2-2026" />
	<meta property="og:image" content="https://appgoblin.info/appgoblin_screenshot.png" />
	<meta property="article:published_time" content="2026-08-17" />
	<meta property="article:author" content="AppGoblin" />
	<meta property="article:section" content="Mobile App Ecosystem" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:image" content="https://appgoblin.info/appgoblin_screenshot.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}<\/script>`}
</svelte:head>

<div class={reportContainerClass}>
	<section
		class={`${heroCardClass} mb-8 overflow-hidden bg-gradient-to-br from-white via-primary-50 to-secondary-50 dark:from-surface-900 dark:via-surface-900 dark:to-surface-800`}
	>
		<div class={`${heroLayoutClass} relative`}>
			<div class={heroIntroClass}>
				<div class={heroEyebrowRowClass}>
					<div class={brandLockupClass}>
						<img src="/appgoblin_100.webp" alt="AppGoblin" class="h-8 w-8 md:h-12 md:w-12" />
						<div>
							<p class={reportBrandNameClass}>AppGoblin</p>
							<p class={reportEyebrowClass}>Intelligence Report</p>
						</div>
					</div>
				</div>
				<h1 class={`text-4xl font-black tracking-tight ${reportHeadingClass} md:text-6xl`}>
					App Ecosystem Report Q2 2026
				</h1>
				<div class={heroDescriptionClass}>
					<p>
						This report tracks changes from 2026-Q1 through {data.summary.reportPeriod}
						based on app SDKs, API calls, and app-ads.txt files.
					</p>
					<p>
						This report is free and shows which mobile app companies are gaining or losing apps as
						tracked by AppGoblin. Companies are brokend down by Ad Networks, Analytics, Development
						Tools, and Business Services.
					</p>
					<p>The raw report data is available as a free CSV download.</p>
				</div>
			</div>
			<div
				class="absolute right-0 top-0 inline-flex w-fit rounded-full preset-outlined-primary-800-200 p-2"
			>
				Top {data.summary.totalCompanies.toLocaleString()} mobile app company trends
			</div>

			<div class={heroActionsClass}>
				{#if data.isLoggedIn}
					<a
						href="/reports/app-ecosystem-report-Q2-2026/download"
						class={`${reportButtonClass} preset-filled-primary-500 shadow-sm`}
					>
						<Download class="h-4 w-4" aria-hidden="true" />
						<span class="text-black">Download CSV</span>
					</a>
				{:else}
					<a
						href="/auth/signup"
						title="Create a free account to download this CSV."
						class={`${reportButtonClass} preset-filled-primary-500 shadow-sm`}
					>
						<Lock class="h-4 w-4" aria-hidden="true" />
						<span class="text-black">Create Free Account to Download</span>
					</a>
				{/if}
				<a href="/contact" class={`${reportButtonClass} preset-outlined-primary-500`}>
					<span>Contact & Questions</span>
				</a>
			</div>
		</div>
	</section>

	<section class={`${panelCardClass} mb-8`}>
		<div>
			<h2 class={`text-2xl ${reportHeadingClass}`}>How to read this report</h2>
			<div class={`mt-4 max-w-4xl space-y-4 ${reportBodyClass}`}>
				<p>
					<span class={`font-semibold ${reportHeadingClass}`}>What's included</span>
					The quarter over quarter metrics compare company footprint changes from the previous period
					to {data.summary.reportPeriod}. SDK and API observations are grouped together as "SDK". Ad
					Networks have SDK and direct app-ads.txt separated into their own sections.
				</p>
				<p>
					<span class={`font-semibold ${reportHeadingClass}`}>Accuracy</span>
					AppGoblin SDK and API verified apps are the most deterministic way of knowing if an app is using
					a tool. Whilte calls are definitive when observed, they may understate APIs that are not initialized
					on launch and have no (known) SDK. App-ads.txt is broad and covers millions of apps, but is
					also depends on linking app store listings back to websites and thus is less deterministic.
				</p>
				<p>
					<span class={`font-semibold ${reportHeadingClass}`}>Aggregation.</span>
					Distinct subcompanies are broken out separately. Some companies have multiple SDK and API domains
					that roll up to the same parent, and fully aggregated data is available on AppGoblin company
					pages along with hierarchy maps.
				</p>
				<p>
					<span class={`font-semibold ${reportHeadingClass}`}>Q/Q Market Share Calculation</span>
					The quarter on share market share change here is each companies market share of all apps tracked
					on AppGoblin. Their quarterly change is compared to their previous quarter's market share. This
					helps surface smaller companies and avoid showing the usual largest Market Share companies ie
					Google/Facebook etc. Full market share is available in the table below.
				</p>
				<p>
					<span class={`font-semibold ${reportHeadingClass}`}>What's not included.</span>
					Unmapped ad and API domains appear in the table below without company-level aggregation. Unmapped
					SDKs are too numerous to list in this report. If there are specific cuts you'd like to see in
					future versions, reach out.
				</p>
			</div>
		</div>
	</section>

	<section class="mb-10">
		<div class="space-y-6">
			{#each data.metricSections as baseSection}
				{@const companyType = getSectionCompanyType(baseSection)}
				{@const section = getMetricSection(baseSection.id, companyType)}
				{@const activePanel = getSelectedPanel(section, companyType)}
				{@const activeView = getPanelView(section, activePanel)}
				{@const activePlatform = getPanelPlatform(activePanel)}
				{@const activeSignal = getPanelSignal(activePanel)}
				{@const shortlist = getPanelCompanies(activePanel, activeView)}
				{@const featuredCompany = getSelectedCompany(activePanel.id, shortlist)}
				{@const negativeDisplay = isNegativeDisplay(section, activeView)}
				<article class={breakoutSectionClass}>
					<div class={sectionHeaderClass}>
						<ReportSectionEditorial sectionId={section.id} />
					</div>

					<section class={breakoutPanelClass}>
						<div class={panelHeaderClass}>
							<div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
								<div class="min-w-0 flex-1">
									<p class={panelDescriptionClass}>
										{activePanel.description}
									</p>
								</div>
							</div>

							<div class={panelControlsClass}>
								{#if !baseSection.companyCategory && !baseSection.companyCategories}
									<div class={controlGroupClass}>
										<p class={controlGroupLabelClass}>Company Category</p>
										<select
											class={selectControlClass}
											value={companyType}
											onchange={(event) =>
												setSelectedCompanyType(
													baseSection.id,
													(event.currentTarget as HTMLSelectElement).value
												)}
										>
											{#each getCompanyTypeOptions(baseSection.id) as option}
												<option value={option.value}>{option.label}</option>
											{/each}
										</select>
									</div>
								{/if}

								<div class={controlGroupClass}>
									<p class={controlGroupLabelClass}>Store</p>
									<div class="flex gap-2">
										{#each ['google', 'apple'] as platform}
											<button
												type="button"
												class={`${storeButtonBaseClass} ${activePlatform === platform ? 'scale-[1.02] border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200 dark:border-primary-400 dark:bg-primary-950/40 dark:ring-primary-900' : 'border-surface-200 bg-surface-100 text-surface-700 hover:border-primary-300 hover:bg-primary-50/70 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-200 dark:hover:border-primary-700 dark:hover:bg-primary-950/30'}`}
												onclick={() =>
													setSelectedPlatform(section, activePanel, platform as PanelPlatform)}
												aria-pressed={activePlatform === platform}
											>
												<span class="inline-flex items-center justify-center gap-2">
													<StoreIcon
														store={platform === 'google' ? 'Google Play' : 'Apple App Store'}
													/>
													{platform === 'google' ? 'Google Play' : 'iOS'}
												</span>
											</button>
										{/each}
									</div>
								</div>
							</div>
						</div>

						{#if featuredCompany}
							<div class={featuredShellClass}>
								<div class={featuredCardClass}>
									<div class={featuredHeaderClass}>
										<div class={featuredIdentityClass}>
											<div class={reportBadgeClass}>
												<img src="/appgoblin_100.webp" alt="AppGoblin" class="h-7 w-7" />
												<div>
													<p class={reportBadgeNameClass}>AppGoblin</p>
													<p class={reportBadgeEyebrowClass}>2026 Q2 Mobile ecosystem report</p>
												</div>
											</div>
											<div class={metadataRailClass}>
												<p class={breakoutMetaPillClass}>
													{getCompanyTypeLabel(section.id, companyType)}
												</p>
												<p class={breakoutMetaPillClass}>{getPlatformLabel(activePlatform)}</p>
												<p class={breakoutMetaPillClass}>{getSignalLabel(activeSignal)}</p>
											</div>
										</div>
										<div class="flex justify-center">
											<a
												href={`/companies/${featuredCompany.companyDomain}`}
												class={featuredCompanyLinkClass}
											>
												<img
													src={getCompanyLogoUrl(featuredCompany.companyLogoUrl)}
													alt={featuredCompany.companyName}
													class={companyLogoClass}
													onerror={(event) =>
														((event.currentTarget as HTMLImageElement).src =
															'/default_company_logo.png')}
												/>
												<div class="min-w-0 text-center">
													<p class={companyNameClass}>
														{featuredCompany.companyName}
													</p>
													<p class={companyDomainClass}>
														/{featuredCompany.companyDomain}
													</p>
													<div
														class="mt-3 flex flex-wrap items-center justify-center gap-2 text-center"
													>
														<span
															class={`inline-flex items-center justify-center md:text-lg leading-none ${getTrendIconClass(negativeDisplay)}`}
														>
															{getTrendIcon(negativeDisplay)}
														</span>
														<span class={trendLabelClass}>
															{section.primaryMetricLabel}
														</span>
													</div>
												</div>
											</a>
										</div>
									</div>

									<div class={detailMetricsGridClass}>
										{#each getDetailMetrics(section, featuredCompany) as metric}
											<div class={detailStatCardClass}>
												<p class={detailMetricLabelClass}>
													{metric.label}
												</p>
												<p class={`mt-2 text-3xl font-bold ${getDetailMetricTone(metric)}`}>
													{formatMetricValue(metric.value, metric.format)}
												</p>
											</div>
										{/each}
									</div>

									<div class="mt-6 md:mt-16">
										<div class={shortlistHeaderClass}>
											<p class={controlGroupLabelClass}>
												Top {getSectionCategoryLabel(section, companyType)}
											</p>
										</div>
										<div class={logoBadgeRailClass}>
											{#each shortlist as company, index}
												<button
													type="button"
													class={getCompanyBadgeClass(activePanel.id, index)}
													onclick={() => selectCompany(activePanel.id, index)}
													aria-label={`Select ${company.companyName}`}
													title={company.companyName}
												>
													<img
														src={getCompanyLogoUrl(company.companyLogoUrl)}
														alt={company.companyName}
														class="h-8 w-8 md:h-12 md:w-12 xl:h-20 xl:w-20 rounded-xl object-cover"
														onerror={(event) =>
															((event.currentTarget as HTMLImageElement).src =
																'/default_company_logo.png')}
													/>
													<span
														class={`text-center text-xs font-semibold leading-tight ${getCompanyBadgeMetricClass(company.qoqShareChange)}`}
													>
														{formatSignedPercent(company.qoqShareChange)}
													</span>
												</button>
											{/each}
										</div>
									</div>
								</div>
							</div>
						{:else}
							<div class={emptyPanelClass}>No companies crossed the threshold in this slice.</div>
						{/if}
					</section>
				</article>
			{/each}
		</div>
	</section>

	<section class={panelCardClass}>
		<div class="mb-5 flex flex-col gap-2">
			<h2 class={`text-3xl ${reportHeadingClass}`}>2026 Q2 Company explorer</h2>
			<p>
				Search any company and switch the metric selector to compare installs, share, Q/Q share
				change, apps lost, and company app counts across SDK and direct app-ads.txt columns side by
				side.
			</p>
		</div>
		<CompaniesOverviewTable data={data.allData} viewMode="both" />
	</section>

	<section class={`${panelCardClass} mt-8`} itemscope itemtype="https://schema.org/Dataset">
		<meta itemprop="name" content="AppGoblin Mobile Ecosystem Report Q2 2026" />
		<link itemprop="license" href="https://creativecommons.org/licenses/by/4.0/" />
		<link itemprop="isBasedOn" href="https://appgoblin.info" />
		<h2 class={`text-2xl ${reportHeadingClass}`}>Data attribution and license</h2>
		<div class={`mt-4 max-w-4xl space-y-3 ${reportBodyClass}`}>
			<p>
				<strong>Attribution required:</strong> If you publish, redistribute, or build products using
				this report data, include a backlink to
				<a href="https://appgoblin.info" class="font-semibold underline">AppGoblin</a>.
			</p>
			<p>
				Suggested citation: <span class="italic">Data provided by AppGoblin.</span>
			</p>
			<p>
				<strong>License:</strong> This dataset is available under the
				<a
					href="https://creativecommons.org/licenses/by/4.0/"
					target="_blank"
					rel="license"
					class="font-semibold underline"
				>
					Creative Commons Attribution 4.0 License (CC BY 4.0)
				</a>.
			</p>
		</div>
	</section>
</div>
