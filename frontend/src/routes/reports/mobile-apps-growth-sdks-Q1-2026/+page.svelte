<script lang="ts">
	import CompanyButton from '$lib/CompanyButton.svelte';
	import CompaniesOverviewTable from '$lib/CompaniesOverviewTable.svelte';

	let { data } = $props();

	type SupportMetric = {
		label: string;
		value: number | null;
		format: 'share' | 'signedPercent' | 'count' | 'compact';
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

	let selectedPanelView = $state<Record<string, PanelView>>({});
	let selectedCompanyIndex = $state<Record<string, number>>({});
	let selectedCompanyType = $state<Record<string, string>>({});
	let selectedSurfacePanel = $state<Record<string, string>>({});

	const breakoutSectionClass = 'border-t border-surface-200 py-8 dark:border-surface-700';
	const breakoutPanelClass =
		'rounded-md border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900';
	const breakoutMetaPillClass =
		'rounded-md bg-surface-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-surface-500 dark:bg-surface-800 dark:text-surface-300';
	const breakoutSelectClass =
		'rounded-md border border-surface-300 bg-white px-3 py-2 text-sm font-medium text-surface-900 outline-none transition focus:border-primary-500 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-50';
	const shortlistShellClass =
		'border-b border-surface-200 p-3 dark:border-surface-700 lg:border-b-0 lg:border-r';
	const detailStatCardClass = 'rounded-md bg-surface-50 p-4 dark:bg-surface-800';

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
		const prefix = value > 0 ? '+' : '';
		return `${prefix}${value.toFixed(digits)}%`;
	}

	function formatCount(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return '—';
		}

		return Math.round(value).toLocaleString();
	}

	function getDeltaTone(value: number | null | undefined): string {
		if (typeof value !== 'number' || Number.isNaN(value)) {
			return 'text-surface-500';
		}
		if (value > 0) return 'text-emerald-600';
		if (value < 0) return 'text-red-500';
		return 'text-surface-500';
	}

	function formatMetricValue(
		value: number | null | undefined,
		format: 'share' | 'signedPercent' | 'count' | 'compact'
	): string {
		switch (format) {
			case 'share':
				return formatShare(value);
			case 'signedPercent':
				return formatSignedPercent(value);
			case 'count':
				return formatCount(value);
			case 'compact':
				return formatCompactNumber(value);
			default:
				return '—';
		}
	}

	function getPrimaryTone(
		presentation: 'signed' | 'single',
		tone: 'positive' | 'negative' | undefined,
		value: number | null | undefined
	): string {
		if (presentation === 'signed') {
			return getDeltaTone(value);
		}

		if (tone === 'negative') {
			return 'text-red-500';
		}

		return 'text-emerald-600';
	}

	function getSupportMetrics(sectionId: string, company: LeaderboardCompany): SupportMetric[] {
		switch (sectionId) {
			case 'qoq-share-change':
				return [
					{ label: 'Current share', value: company.share, format: 'share' },
					{ label: '30D installs', value: company.installs, format: 'compact' }
				];
			case 'qoq-company-app-change':
				return [
					{ label: 'Current share', value: company.share, format: 'share' },
					{ label: 'Tracked apps', value: company.totalAppCount, format: 'count' }
				];
			case 'apps-added':
			case 'apps-lost':
				return [
					{ label: 'Current share', value: company.share, format: 'share' },
					{ label: 'Q/Q share', value: company.qoqShareChange, format: 'signedPercent' }
				];
			default:
				return [];
		}
	}

	function getPanelView(section: ReportSection, panel: ReportPanel): PanelView {
		if (section.presentation === 'single') {
			return 'single';
		}

		return selectedPanelView[panel.id] ?? (panel.topGood?.length ? 'good' : 'bad');
	}

	function setPanelView(panelId: string, view: PanelView): void {
		selectedPanelView[panelId] = view;
		selectedCompanyIndex[panelId] = 0;
	}

	function getSelectedCompanyType(sectionId: string): string {
		return selectedCompanyType[sectionId] ?? 'all_mapped';
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

	function getSelectedPanel(section: ReportSection): ReportPanel {
		const defaultPanel = section.panels[0];
		if (!defaultPanel) {
			throw new Error(`Missing surface panel for section: ${section.id}`);
		}

		return (
			section.panels.find(
				(panel) => panel.id === (selectedSurfacePanel[section.id] ?? defaultPanel.id)
			) ?? defaultPanel
		);
	}

	function selectSurfacePanel(sectionId: string, panelId: string): void {
		selectedSurfacePanel[sectionId] = panelId;
		selectedCompanyIndex[panelId] = 0;
	}

	function getToggleButtonClass(activeView: PanelView, currentView: 'good' | 'bad'): string {
		const isActive = activeView === currentView;
		if (currentView === 'good') {
			return isActive
				? 'bg-emerald-600 text-white shadow-sm'
				: 'border border-surface-300 text-surface-600 hover:border-emerald-300 hover:bg-emerald-50 dark:border-surface-700 dark:text-surface-300 dark:hover:border-emerald-900 dark:hover:bg-emerald-950/30';
		}

		return isActive
			? 'bg-rose-500 text-white shadow-sm'
			: 'border border-surface-300 text-surface-600 hover:border-rose-300 hover:bg-rose-50 dark:border-surface-700 dark:text-surface-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/30';
	}

	function getCompanyLogoUrl(url: string | null | undefined): string {
		if (!url) {
			return '/default_company_logo.png';
		}

		return url.startsWith('http') ? url : `https://media.appgoblin.info/${url}`;
	}

	function getShortlistButtonClass(panelId: string, index: number): string {
		const selectedIndex = selectedCompanyIndex[panelId] ?? 0;
		return selectedIndex === index
			? 'border-surface-400 bg-surface-50 dark:border-surface-500 dark:bg-surface-800'
			: 'border-transparent bg-transparent hover:border-surface-300 hover:bg-surface-50 dark:hover:border-surface-600 dark:hover:bg-surface-800';
	}

	function getPanelTabLabel(panel: ReportPanel): string {
		switch (panel.id) {
			case 'qoq-share-change-google-sdk':
			case 'qoq-company-app-change-google-sdk':
			case 'apps-added-google-sdk':
			case 'apps-lost-google-sdk':
				return 'Google SDK';
			case 'qoq-share-change-apple-sdk':
			case 'qoq-company-app-change-apple-sdk':
			case 'apps-added-apple-sdk':
			case 'apps-lost-apple-sdk':
				return 'Apple SDK';
			case 'qoq-share-change-google-adstxt':
			case 'qoq-company-app-change-google-adstxt':
			case 'apps-added-google-adstxt':
			case 'apps-lost-google-adstxt':
				return 'Google app-ads.txt';
			case 'qoq-share-change-apple-adstxt':
			case 'qoq-company-app-change-apple-adstxt':
			case 'apps-added-apple-adstxt':
			case 'apps-lost-apple-adstxt':
				return 'Apple app-ads.txt';
			default:
				return panel.title;
		}
	}

	function getSurfaceTabClass(panelId: string, activePanelId: string): string {
		return panelId === activePanelId
			? 'border-surface-900 bg-surface-900 text-white dark:border-surface-50 dark:bg-surface-50 dark:text-surface-950'
			: 'border-surface-300 text-surface-600 hover:border-surface-400 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800';
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

	function getViewLabel(section: ReportSection, view: PanelView): string {
		if (view === 'good') {
			return section.goodLabel ?? 'Top movers';
		}

		if (view === 'bad') {
			return section.badLabel ?? 'Watchlist';
		}

		return section.listLabel ?? 'Shortlist';
	}

	function getDetailSummary(
		sectionId: string,
		panelTitle: string,
		company: LeaderboardCompany,
		view: PanelView
	): string {
		switch (sectionId) {
			case 'qoq-share-change':
				return view === 'bad'
					? `${company.companyName} posted one of the sharpest quarter-over-quarter share pullbacks in ${panelTitle.toLowerCase()}.`
					: `${company.companyName} posted one of the strongest quarter-over-quarter share gains in ${panelTitle.toLowerCase()}.`;
			case 'qoq-company-app-change':
				return view === 'bad'
					? `${company.companyName} contracted its tracked app footprint fastest in ${panelTitle.toLowerCase()}.`
					: `${company.companyName} expanded its tracked app footprint fastest in ${panelTitle.toLowerCase()}.`;
			case 'apps-added':
				return `${company.companyName} added one of the largest share-weighted app footprints in ${panelTitle.toLowerCase()}.`;
			case 'apps-lost':
				return `${company.companyName} lost one of the largest share-weighted app footprints in ${panelTitle.toLowerCase()}.`;
			default:
				return `${company.companyName} stands out in this quarter's ${panelTitle.toLowerCase()} slice.`;
		}
	}

	function getTrendPath(isNegative: boolean): string {
		return isNegative ? 'M10 12 L18 20 L28 10 L38 18' : 'M10 26 L18 18 L28 28 L38 12';
	}

	function getTrendStrokeClass(isNegative: boolean): string {
		return isNegative ? 'stroke-red-500' : 'stroke-emerald-500';
	}

	function getDetailCardClass(isNegative: boolean): string {
		return isNegative
			? 'border-l-2 border-red-400 bg-white dark:bg-surface-900'
			: 'border-l-2 border-emerald-500 bg-white dark:bg-surface-900';
	}

	function getTrendIcon(isNegative: boolean): string {
		return isNegative ? '↘' : '↗';
	}

	function getTrendIconClass(isNegative: boolean): string {
		return isNegative
			? 'bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300'
			: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300';
	}

	const structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'Report',
		name: data.title,
		headline: 'AppGoblin Mobile Ecosystem Report Q1 2026',
		description: data.description,
		url: 'https://appgoblin.info/reports/mobile-apps-growth-sdks-Q1-2026',
		datePublished: '2026-05-15',
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
	<link rel="canonical" href="https://appgoblin.info/reports/mobile-apps-growth-sdks-Q1-2026" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}<\/script>`}
</svelte:head>

<div class="container mx-auto max-w-7xl px-4 py-10">
	<section
		class={`${heroCardClass} mb-8 overflow-hidden bg-gradient-to-br from-white via-primary-50 to-secondary-50 dark:from-surface-900 dark:via-surface-900 dark:to-surface-800`}
	>
		<div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-4xl">
				<div
					class="mb-4 inline-flex rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 dark:border-primary-800 dark:bg-primary-950/40 dark:text-primary-300"
				>
					{data.summary.reportPeriod} mobile ecosystem snapshot
				</div>
				<h1
					class="text-4xl font-black tracking-tight text-surface-900 dark:text-surface-50 md:text-6xl"
				>
					AppGoblin Mobile Ecosystem Report Q1 2026
				</h1>
				<p class="mt-4 max-w-3xl text-lg leading-8 text-surface-600 dark:text-surface-300">
					Quarter-over-quarter company movement across SDK and direct app-ads.txt coverage on Google
					Play and Apple App Store. Use the breakout panels for the fastest movers, then drop into
					the full explorer to compare installs, market share, share change, and apps added or lost
					across both surfaces.
				</p>
			</div>

			<div class="flex flex-col gap-3 lg:min-w-72">
				<a
					href="/reports/mobile-apps-growth-sdks-Q1-2026/download"
					class="inline-flex items-center justify-center rounded-2xl bg-surface-950 px-5 py-3 text-sm font-semibold text-white transition hover:translate-y-[-1px] dark:bg-surface-50 dark:text-surface-950"
				>
					Download Source CSV
				</a>
				<a
					href="mailto:contact@appgoblin.info"
					class="inline-flex items-center justify-center rounded-2xl border border-surface-300 px-5 py-3 text-sm font-semibold text-surface-700 transition hover:border-surface-400 hover:bg-surface-50 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
				>
					Request Custom Cuts
				</a>
			</div>
		</div>
	</section>

	<section class="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
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
			<p class="text-sm font-medium text-surface-500">Open-source weighted</p>
			<p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
				{data.summary.openSourceWeightedCompanies.toLocaleString()}
			</p>
		</div>
		<div class={kpiCardClass}>
			<p class="text-sm font-medium text-surface-500">US API footprint</p>
			<p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
				{data.summary.usHostedApiCompanies.toLocaleString()}
			</p>
		</div>
		<div class={kpiCardClass}>
			<p class="text-sm font-medium text-surface-500">Company app footprints</p>
			<p class="mt-2 text-3xl font-bold text-surface-900 dark:text-surface-50">
				{formatCompactNumber(data.summary.companyAppFootprint)}
			</p>
		</div>
	</section>

	<section class={`${panelCardClass} mb-8`}>
		<div class="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
			<div>
				<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50">
					How to read this report
				</h2>
				<p class="mt-3 leading-7 text-surface-600 dark:text-surface-300">
					This dashboard is driven directly from the static Q1 2026 mobile ecosystem export. The
					quarter-over-quarter metrics compare company footprint changes from the previous period to
					{data.summary.reportPeriod} for SDK and direct app-ads.txt presence on both stores.
				</p>
			</div>
			<div
				class="rounded-2xl bg-surface-50 p-5 text-sm leading-7 text-surface-600 dark:bg-surface-800 dark:text-surface-300"
			>
				<p>
					App footprint totals are company-level sums and are not deduplicated across vendors. They
					are useful for relative scale, not for estimating unique app counts.
				</p>
				<p class="mt-3">
					Use the full explorer below to switch between installs, current share, Q/Q share change,
					Q/Q app change, apps added, and apps lost across SDK and direct app-ads.txt columns at the
					same time.
				</p>
			</div>
		</div>
	</section>

	<section class="mb-10">
		<div class="space-y-6">
			{#each data.metricSections as baseSection}
				{@const companyType = getSelectedCompanyType(baseSection.id)}
				{@const section = getMetricSection(baseSection.id, companyType)}
				{@const activePanel = getSelectedPanel(section)}
				{@const activeView = getPanelView(section, activePanel)}
				{@const shortlist = getPanelCompanies(activePanel, activeView)}
				{@const featuredCompany = getSelectedCompany(activePanel.id, shortlist)}
				{@const negativeDisplay = isNegativeDisplay(section, activeView)}
				<article class={breakoutSectionClass}>
					<div class="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div class="flex flex-col gap-2">
							<p
								class="text-sm font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300"
							>
								{section.basisLabel}
							</p>
							<h2 class="text-2xl font-bold text-surface-900 dark:text-surface-50 md:text-3xl">
								{section.title}
							</h2>
							<p class="max-w-3xl text-surface-600 dark:text-surface-300">{section.description}</p>
						</div>
						<label
							class="flex min-w-64 flex-col gap-2 text-sm font-medium text-surface-600 dark:text-surface-300"
						>
							<span class="text-xs font-semibold uppercase tracking-[0.16em] text-surface-500"
								>Company category</span
							>
							<select
								class={breakoutSelectClass}
								value={companyType}
								onchange={(event) =>
									setSelectedCompanyType(
										baseSection.id,
										(event.currentTarget as HTMLSelectElement).value
									)}
							>
								{#each data.companyTypeOptions as option}
									<option value={option.value}>{option.label} ({option.count})</option>
								{/each}
							</select>
						</label>
					</div>

					<div class="mb-4 flex flex-wrap gap-2 overflow-x-auto pb-1">
						{#each section.panels as panel}
							<button
								type="button"
								class={`rounded-md border px-3 py-2 text-sm font-medium whitespace-nowrap transition ${getSurfaceTabClass(panel.id, activePanel.id)}`}
								onclick={() => selectSurfacePanel(section.id, panel.id)}
							>
								{getPanelTabLabel(panel)}
							</button>
						{/each}
					</div>

					<section class={breakoutPanelClass}>
						<div
							class="flex flex-col gap-4 border-b border-surface-200 p-4 dark:border-surface-700 lg:flex-row lg:items-start lg:justify-between"
						>
							<div>
								<h3 class="text-lg font-semibold text-surface-900 dark:text-surface-50">
									{activePanel.title}
								</h3>
								<p class="mt-1 text-sm leading-6 text-surface-600 dark:text-surface-300">
									{activePanel.description}
								</p>
							</div>
							<div class="flex flex-wrap items-center gap-2">
								<p class={breakoutMetaPillClass}>{activePanel.meta}</p>
								{#if section.presentation === 'signed'}
									<button
										type="button"
										class={`rounded-md px-3 py-2 text-sm font-semibold transition ${getToggleButtonClass(activeView, 'good')}`}
										onclick={() => setPanelView(activePanel.id, 'good')}
									>
										{section.goodLabel}
									</button>
									<button
										type="button"
										class={`rounded-md px-3 py-2 text-sm font-semibold transition ${getToggleButtonClass(activeView, 'bad')}`}
										onclick={() => setPanelView(activePanel.id, 'bad')}
									>
										{section.badLabel}
									</button>
								{/if}
							</div>
						</div>

						{#if featuredCompany}
							<div class="grid lg:grid-cols-[15rem_minmax(0,1fr)]">
								<div class={shortlistShellClass}>
									<div class="mb-3 flex items-center justify-between gap-3">
										<p class="text-xs font-semibold uppercase tracking-[0.18em] text-surface-500">
											{getViewLabel(section, activeView)}
										</p>
										<p class="text-xs text-surface-500 dark:text-surface-400">{shortlist.length}</p>
									</div>
									<div class="space-y-1">
										{#each shortlist as company, index}
											<button
												type="button"
												class={`w-full rounded-md border px-3 py-3 text-left transition ${getShortlistButtonClass(activePanel.id, index)}`}
												onclick={() => selectCompany(activePanel.id, index)}
											>
												<div class="flex items-center justify-between gap-3">
													<div class="flex min-w-0 items-center gap-3">
														<img
															src={getCompanyLogoUrl(company.companyLogoUrl)}
															alt={company.companyName}
															class="h-9 w-9 rounded-md border border-surface-200 object-cover dark:border-surface-700"
															onerror={(event) =>
																((event.currentTarget as HTMLImageElement).src =
																	'/default_company_logo.png')}
														/>
														<p class="truncate font-medium text-surface-900 dark:text-surface-50">
															{company.companyName}
														</p>
													</div>
													<p
														class={`text-sm font-semibold ${getPrimaryTone(section.presentation, section.tone, company.primaryValue)}`}
													>
														{formatMetricValue(company.primaryValue, section.primaryFormat)}
													</p>
												</div>
											</button>
										{/each}
									</div>
								</div>

								<div class={`p-4 md:p-5 ${getDetailCardClass(negativeDisplay)}`}>
									<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
										<div>
											<p class="text-xs font-semibold uppercase tracking-[0.16em] text-surface-500">
												{getViewLabel(section, activeView)}
											</p>
											<div class="mt-3">
												<CompanyButton
													companyDomain={featuredCompany.companyDomain}
													companyName={featuredCompany.companyName}
													companyLogoUrl={featuredCompany.companyLogoUrl ?? undefined}
													size="lg"
												/>
											</div>
										</div>
										<div
											class={`inline-flex h-14 w-14 items-center justify-center rounded-md text-3xl font-bold ${getTrendIconClass(negativeDisplay)}`}
										>
											{getTrendIcon(negativeDisplay)}
										</div>
									</div>

									<div class="mt-5 grid gap-3 md:grid-cols-3">
										<div class={detailStatCardClass}>
											<p class="text-sm text-surface-500">{section.primaryMetricLabel}</p>
											<p
												class={`mt-2 text-3xl font-bold ${getPrimaryTone(section.presentation, section.tone, featuredCompany.primaryValue)}`}
											>
												{formatMetricValue(featuredCompany.primaryValue, section.primaryFormat)}
											</p>
										</div>
										{#each getSupportMetrics(section.id, featuredCompany) as metric}
											<div class={detailStatCardClass}>
												<p class="text-sm text-surface-500">{metric.label}</p>
												<p
													class="mt-2 text-2xl font-semibold text-surface-900 dark:text-surface-50"
												>
													{formatMetricValue(metric.value, metric.format)}
												</p>
											</div>
										{/each}
									</div>

									<p
										class="mt-5 max-w-2xl text-sm leading-7 text-surface-600 dark:text-surface-300"
									>
										{getDetailSummary(section.id, activePanel.title, featuredCompany, activeView)}
									</p>
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
				change, Q/Q app change, apps added, or apps lost across SDK and direct app-ads.txt columns
				side by side.
			</p>
		</div>
		<CompaniesOverviewTable data={data.allData} viewMode="both" />
	</section>
</div>
