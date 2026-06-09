<script lang="ts">
	import CompaniesOverviewTable from './Q1ReportCompaniesOverviewTable.svelte';

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
		title: string;
		basisLabel: string;
		description: string;
		descriptionHtml?: string;
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
	const MAU_EXHIBITOR_SECTION_ID = 'mau-2026-exhibitors';
	const MAU_DEFAULT_COMPANY_TYPE = 'Business Tools';
	const QOQ_MARKET_SHARE_CHANGE_LABEL = 'Q/Q Market Share Change';

	const breakoutSectionClass = 'border-t border-surface-200 py-8 dark:border-surface-700';
	const breakoutPanelClass =
		'rounded-md border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900';
	const controlGroupClass = 'rounded-xl bg-white/90 p-2.5 md:w-full dark:bg-surface-900/85';
	const controlGroupLabelClass =
		'mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-surface-500';
	const breakoutMetaPillClass =
		'rounded-md bg-surface-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] whitespace-nowrap text-surface-500 dark:bg-surface-800 dark:text-surface-300';
	const detailStatCardClass = 'rounded-md bg-surface-50 p-4 text-center dark:bg-surface-800';
	const brandLockupClass = 'inline-flex items-center gap-3 px-1 py-1';
	const reportBadgeClass = 'inline-flex items-center gap-2';
	const selectControlClass =
		'w-full min-w-0 rounded-xl border border-surface-200 bg-white px-3 py-2.5 text-sm font-medium text-surface-700 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-100 dark:focus:ring-primary-900';
	const logoBadgeRailClass = 'flex flex-wrap gap-2';

	function formatCompactNumber(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return '—';
		}
		return Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
	}

	function formatRoundedK(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return '—';
		}

		return `${Math.round(value / 1000).toLocaleString()}k`;
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
		return data.companyTypeOptionsBySection?.[sectionId] ?? data.companyTypeOptions;
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
		const fallbackSection = data.metricSections.find(
			(section: ReportSection) => section.id === sectionId
		);

		if (!fallbackSection) {
			throw new Error(`Missing metric section: ${sectionId}`);
		}

		return (
			typedSections.find((section: ReportSection) => section.id === sectionId) ?? fallbackSection
		);
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

		if (
			sectionId === MAU_EXHIBITOR_SECTION_ID &&
			options.some((option: CompanyTypeOption) => option.value === MAU_DEFAULT_COMPANY_TYPE)
		) {
			return MAU_DEFAULT_COMPANY_TYPE;
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
			'group relative inline-flex min-h-[6.25rem] w-24 flex-col items-center justify-center gap-2 rounded-2xl border bg-white px-2 py-2 shadow-sm transition duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 dark:bg-surface-900';

		if (isSelected) {
			return `${base} scale-[1.06] border-primary-500 bg-primary-50 shadow-md ring-2 ring-primary-200 dark:border-primary-400 dark:bg-primary-950/40 dark:ring-primary-900`;
		}

		return `${base} border-surface-200 hover:border-primary-300 hover:bg-primary-50/70 dark:border-surface-700 dark:hover:border-primary-700 dark:hover:bg-primary-950/30`;
	}

	function getCompanyBadgeMetricClass(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return 'text-surface-500 dark:text-surface-400';
		}

		if (value < 0) {
			return 'text-red-600 dark:text-red-300';
		}

		return 'text-emerald-600 dark:text-emerald-300';
	}

	function getPlatformLabel(platform: PanelPlatform): string {
		return platform === 'google' ? 'Google Play' : 'Apple App Store';
	}

	function getSignalLabel(signal: PanelSignal): string {
		return signal === 'sdk' ? 'SDK' : 'Direct app-ads.txt';
	}

	function getAvailableSignals(companyType: string): PanelSignal[] {
		return supportsAdstxt(companyType) ? ['sdk', 'adstxt'] : ['sdk'];
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
			return 'text-surface-900 dark:text-surface-50';
		}

		if (presentation === 'signed') {
			return value < 0
				? 'text-red-600 dark:text-red-300'
				: 'text-emerald-600 dark:text-emerald-300';
		}

		if (tone === 'negative') {
			return 'text-red-600 dark:text-red-300';
		}

		return 'text-surface-900 dark:text-surface-50';
	}

	function getDetailMetricTone(metric: SupportMetric): string {
		if (metric.format === 'signedPercent') {
			return getPrimaryTone('signed', 'positive', metric.value);
		}

		if (metric.tone === 'negative') {
			return 'text-red-600 dark:text-red-300';
		}

		return 'text-surface-900 dark:text-surface-50';
	}

	function getDetailMetrics(section: ReportSection, company: LeaderboardCompany): SupportMetric[] {
		const qoqMetric: SupportMetric = {
			label: QOQ_MARKET_SHARE_CHANGE_LABEL,
			value: company.qoqShareChange,
			format: 'signedPercent'
		};

		if (section.id === 'qoq-share-change' || section.id === MAU_EXHIBITOR_SECTION_ID) {
			return [
				{ label: 'Current share', value: company.share, format: 'share' },
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
				{ label: 'Current share', value: company.share, format: 'share' }
			];
		}

		return [
			{
				label: section.primaryMetricLabel,
				value: company.primaryValue,
				format: section.primaryFormat
			},
			qoqMetric,
			{ label: 'Current share', value: company.share, format: 'share' }
		];
	}

	function getDetailSummary(
		sectionId: string,
		panelTitle: string,
		company: LeaderboardCompany
	): string {
		switch (sectionId) {
			case 'qoq-share-change':
				return `${company.companyName} posted one of the largest quarter-over-quarter share breakouts in ${panelTitle.toLowerCase()}.`;
			case MAU_EXHIBITOR_SECTION_ID:
				return `${company.companyName} is one of the fastest-growing MAU 2026 exhibitors in ${panelTitle.toLowerCase()}.`;
			case 'apps-added':
				return `${company.companyName} added one of the largest share-weighted app footprints in ${panelTitle.toLowerCase()}.`;
			case 'apps-lost':
				return `${company.companyName} lost one of the largest share-weighted app footprints in ${panelTitle.toLowerCase()}.`;
			default:
				return `${company.companyName} stands out in this quarter's ${panelTitle.toLowerCase()} slice.`;
		}
	}

	function getTrendIcon(isNegative: boolean): string {
		return isNegative ? '↘' : '↗';
	}

	function getTrendIconClass(isNegative: boolean): string {
		return isNegative ? 'text-red-600 dark:text-red-300' : 'text-emerald-600 dark:text-emerald-300';
	}

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': ['Report', 'NewsArticle'],
		name: data.title,
		headline: 'AppGoblin Mobile Ecosystem Report Q1 2026',
		description: data.description,
		url: 'https://appgoblin.info/reports/app-ecosystem-report-Q1-2026',
		datePublished: '2026-05-17',
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
		keywords: data.keywords
	});

	const heroCardClass =
		'rounded-3xl border border-surface-200 bg-white/90 p-8 shadow-xl dark:border-surface-700 dark:bg-surface-900/90';
	const kpiCardClass =
		'rounded-2xl border border-surface-200 bg-white p-5 shadow-sm dark:border-surface-700 dark:bg-surface-900';
	const panelCardClass =
		'rounded-3xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-700 dark:bg-surface-900';
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta name="keywords" content={data.keywords} />
	<link rel="canonical" href="https://appgoblin.info/reports/app-ecosystem-report-Q1-2026" />
	<meta property="og:type" content="article" />
	<meta property="og:site_name" content="AppGoblin" />
	<meta property="og:title" content={data.title} />
	<meta property="og:description" content={data.description} />
	<meta property="og:url" content="https://appgoblin.info/reports/app-ecosystem-report-Q1-2026" />
	<meta property="og:image" content="https://appgoblin.info/appgoblin_screenshot.png" />
	<meta property="article:published_time" content="2026-05-17" />
	<meta property="article:author" content="AppGoblin" />
	<meta property="article:section" content="Mobile App Ecosystem" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.title} />
	<meta name="twitter:description" content={data.description} />
	<meta name="twitter:image" content="https://appgoblin.info/appgoblin_screenshot.png" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}<\/script>`}
</svelte:head>

<div class="container mx-auto max-w-7xl px-4 py-10">
	<section
		class={`${heroCardClass} mb-8 overflow-hidden bg-gradient-to-br from-white via-primary-50 to-secondary-50 dark:from-surface-900 dark:via-surface-900 dark:to-surface-800`}
	>
		<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-4xl">
				<div class="mb-4 flex flex-wrap items-center gap-3">
					<div class={brandLockupClass}>
						<img src="/goblin_purple_hat_60.png" alt="AppGoblin" class="h-8 w-8" />
						<div>
							<p class="text-sm font-semibold text-surface-900 dark:text-surface-50">AppGoblin</p>
							<p class="text-[11px] uppercase tracking-[0.18em] text-surface-500">
								Intelligence Report
							</p>
						</div>
					</div>
					<div
						class="inline-flex rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300"
					>
						{data.summary.reportPeriod} mobile ecosystem snapshot
					</div>
				</div>
				<h1
					class="text-4xl font-black tracking-tight text-surface-900 dark:text-surface-50 md:text-6xl"
				>
					AppGoblin Mobile Ecosystem Report Q1 2026
				</h1>
				<div
					class="mt-4 max-w-3xl space-y-3 text-base leading-7 text-surface-600 dark:text-surface-300 md:text-lg md:leading-8"
				>
					<p>
						This quarter-over-quarter report tracks changes from 2025 Q4 to {data.summary
							.reportPeriod}
						across app SDKs, API calls, and direct app-ads.txt files.
					</p>
					<p>
						Use it to see which mobile service companies are gaining ground across Ad Networks,
						Analytics, Development Tools, and Business Services.
					</p>
					<p>
						The raw report data is available as a free download, and questions or comments are
						welcome via email or Discord.
					</p>
				</div>
			</div>

			<div class="flex flex-col gap-3 lg:min-w-72">
				<a
					href="/reports/app-ecosystem-report-Q1-2026/download"
					class="btn preset-filled-primary-500 inline-flex items-center justify-center gap-2 rounded-2xl p-3 shadow-sm"
				>
					<span class="text-black">Download CSV</span>
				</a>
				<a
					href="/contact"
					class="btn preset-outlined-primary-500 inline-flex items-center justify-center gap-2 rounded-2xl p-3"
				>
					<span>Contact & Questions</span>
				</a>
			</div>
		</div>
	</section>

	<section class="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
		<div class={kpiCardClass}>
			<p class="text-sm font-medium text-surface-500">Companies tracked</p>
			<p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
				{data.summary.totalCompanies.toLocaleString()}
			</p>
		</div>
		<div class={kpiCardClass}>
			<p class="text-sm font-medium text-surface-500">SDK-tracked companies</p>
			<p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
				{data.summary.trackedSdkCompanies.toLocaleString()}
			</p>
		</div>
		<div class={kpiCardClass}>
			<p class="text-sm font-medium text-surface-500">Direct app-ads.txt companies</p>
			<p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
				{data.summary.trackedAdCompanies.toLocaleString()}
			</p>
		</div>
		<div class={kpiCardClass}>
			<p class="text-sm font-medium text-surface-500">Apps analyzed</p>
			<p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
				{formatRoundedK(data.summary.companyAppFootprint)}
			</p>
		</div>
	</section>

	<section class={`${panelCardClass} mb-8`}>
		<div>
			<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
				How to read this report
			</h2>
			<div
				class="mt-4 max-w-4xl space-y-4 text-base leading-7 text-surface-600 dark:text-surface-300"
			>
				<p>
					<span class="font-semibold text-surface-900 dark:text-surface-50">What's included.</span>
					The quarter-over-quarter metrics compare company footprint changes from the previous period
					to {data.summary.reportPeriod} for SDK and direct app-ads.txt coverage on both stores. SDK and
					API observations are grouped together as "SDK", while direct app-ads.txt is tracked as a separate
					signal.
				</p>
				<p>
					<span class="font-semibold text-surface-900 dark:text-surface-50">Accuracy.</span>
					Mapped SDK data is generally the most reliable. API calls are definitive when observed, but
					may understate providers that are not initialized on launch. App-ads.txt is broad and covers
					millions of apps, but it is also the noisiest signal because it depends on linking app store
					listings back to websites.
				</p>
				<p>
					<span class="font-semibold text-surface-900 dark:text-surface-50">Aggregation.</span>
					Distinct subcompanies are broken out separately. Some companies have multiple SDK and API domains
					that roll up to the same parent, and fully aggregated data is available on AppGoblin company
					pages along with hierarchy maps.
				</p>
				<p>
					<span class="font-semibold text-surface-900 dark:text-surface-50"
						>What's not included.</span
					>
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
				{@const companyType = getSelectedCompanyType(baseSection.id)}
				{@const section = getMetricSection(baseSection.id, companyType)}
				{@const activePanel = getSelectedPanel(section, companyType)}
				{@const activeView = getPanelView(section, activePanel)}
				{@const activePlatform = getPanelPlatform(activePanel)}
				{@const activeSignal = getPanelSignal(activePanel)}
				{@const shortlist = getPanelCompanies(activePanel, activeView)}
				{@const featuredCompany = getSelectedCompany(activePanel.id, shortlist)}
				{@const negativeDisplay = isNegativeDisplay(section, activeView)}
				<article class={breakoutSectionClass}>
					<div class="mb-4 flex flex-col gap-2">
						<div class="flex flex-col gap-2">
							<p
								class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300"
							>
								{section.basisLabel}
							</p>
							<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 md:text-3xl">
								{section.title}
							</h2>
							{#if section.descriptionHtml}
								<div
									class="max-w-3xl text-surface-600 dark:text-surface-300 [&_a]:font-semibold [&_a]:text-primary-700 [&_a:hover]:underline dark:[&_a]:text-primary-300 [&_p+p]:mt-3"
								>
									{@html section.descriptionHtml}
								</div>
							{:else}
								<p class="max-w-3xl text-surface-600 dark:text-surface-300">
									{section.description}
								</p>
							{/if}
						</div>
					</div>

					<section class={breakoutPanelClass}>
						<div class="border-b border-surface-200 p-4 dark:border-surface-700 md:p-5">
							<div class="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
								<div class="min-w-0 flex-1">
									<p class="text-sm leading-6 text-surface-600 dark:text-surface-300">
										{activePanel.description}
									</p>
								</div>
							</div>

							<div
								class="mt-4 grid gap-2 md:grid-cols-[minmax(0,1.15fr)_minmax(11rem,0.75fr)_minmax(9rem,0.65fr)] md:items-end"
							>
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

								<div class={controlGroupClass}>
									<p class={controlGroupLabelClass}>Store</p>
									<select
										class={selectControlClass}
										value={activePlatform}
										onchange={(event) =>
											setSelectedPlatform(
												section,
												activePanel,
												(event.currentTarget as HTMLSelectElement).value as PanelPlatform
											)}
									>
										{#each ['google', 'apple'] as platform}
											<option value={platform}>{getPlatformLabel(platform as PanelPlatform)}</option
											>
										{/each}
									</select>
								</div>

								<div class={controlGroupClass}>
									<p class={controlGroupLabelClass}>Signal</p>
									<select
										class={selectControlClass}
										value={activeSignal}
										onchange={(event) =>
											setSelectedSignal(
												section,
												activePanel,
												(event.currentTarget as HTMLSelectElement).value as PanelSignal
											)}
									>
										{#each getAvailableSignals(companyType) as signal}
											<option value={signal}>{getSignalLabel(signal)}</option>
										{/each}
									</select>
								</div>
							</div>
						</div>

						{#if featuredCompany}
							<div class="p-4 md:p-5">
								<div class="rounded-2xl bg-white p-4 dark:bg-surface-900 md:p-5">
									<div class="flex flex-col gap-4">
										<div class="flex flex-col gap-3 md:items-start">
											<div class={reportBadgeClass}>
												<img src="/goblin_purple_hat_60.png" alt="AppGoblin" class="h-7 w-7" />
												<div>
													<p class="text-xs font-semibold text-surface-900 dark:text-surface-50">
														AppGoblin
													</p>
													<p class="text-[10px] uppercase tracking-[0.16em] text-surface-500">
														Mobile ecosystem report
													</p>
												</div>
											</div>
											<div class="flex flex-wrap gap-2 md:flex-nowrap">
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
												class="inline-flex items-center gap-4 rounded-3xl bg-white/95 px-4 py-4 shadow-sm transition hover:bg-primary-50/70 dark:bg-surface-900/95 dark:hover:bg-primary-950/30"
											>
												<img
													src={getCompanyLogoUrl(featuredCompany.companyLogoUrl)}
													alt={featuredCompany.companyName}
													class="h-20 w-20 rounded-2xl border border-surface-200 object-cover dark:border-surface-700"
													onerror={(event) =>
														((event.currentTarget as HTMLImageElement).src =
															'/default_company_logo.png')}
												/>
												<div class="min-w-0 text-center">
													<p
														class="text-2xl font-black leading-tight text-surface-900 dark:text-surface-50 md:text-3xl"
													>
														{featuredCompany.companyName}
													</p>
													<p
														class="mt-1 text-sm font-medium text-surface-500 dark:text-surface-400"
													>
														/{featuredCompany.companyDomain}
													</p>
													<div
														class="mt-3 flex flex-wrap items-center justify-center gap-2 text-center"
													>
														<span
															class={`inline-flex items-center justify-center text-3xl leading-none ${getTrendIconClass(negativeDisplay)}`}
														>
															{getTrendIcon(negativeDisplay)}
														</span>
														<span
															class="text-xs font-semibold uppercase tracking-[0.14em] text-surface-500"
														>
															{section.primaryMetricLabel}
														</span>
													</div>
												</div>
											</a>
										</div>
									</div>

									<div class="mt-3 grid gap-3 md:mx-auto md:max-w-4xl md:grid-cols-3">
										{#each getDetailMetrics(section, featuredCompany) as metric}
											<div class={detailStatCardClass}>
												<p class="	text-sm text-surface-500">
													{metric.label}
												</p>
												<p class={`mt-2 text-3xl font-bold ${getDetailMetricTone(metric)}`}>
													{formatMetricValue(metric.value, metric.format)}
												</p>
											</div>
										{/each}
									</div>

									<p
										class="mt-5 max-w-2xl text-sm leading-7 text-surface-600 dark:text-surface-300"
									>
										{getDetailSummary(section.id, activePanel.title, featuredCompany)}
									</p>

									<div class="mt-6">
										<div class="mb-3 flex items-center justify-between gap-3">
											<p class={controlGroupLabelClass}>Top companies</p>
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
														class="h-12 w-12 rounded-xl object-cover"
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
							<div class="p-5 text-sm text-surface-500 dark:text-surface-400">
								No companies crossed the threshold in this slice.
							</div>
						{/if}
					</section>
				</article>
			{/each}
		</div>
	</section>

	<section class={panelCardClass}>
		<div class="mb-5 flex flex-col gap-2">
			<h2 class="text-3xl font-bold text-surface-900 dark:text-surface-50">
				Full company explorer
			</h2>
			<p class="text-surface-600 dark:text-surface-300">
				Search any company and switch the metric selector to compare installs, share, Q/Q share
				change, apps lost, and company app counts across SDK and direct app-ads.txt columns side by
				side.
			</p>
		</div>
		<CompaniesOverviewTable data={data.allData} viewMode="both" />
	</section>
</div>
