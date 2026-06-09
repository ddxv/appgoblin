<script lang="ts">
	type ReportEntry = {
		slug: string;
		url: string;
		title: string;
		displayTitle: string;
		period: string | null;
		sortValue: number;
		publishedDate: string | null;
		seriesKey: string;
		seriesLabel: string;
		seriesDescription: string;
		highlights: string[];
	};

	type ReportGroup = {
		key: string;
		label: string;
		description: string;
		highlights: string[];
		reports: ReportEntry[];
	};

	const monthNames = [
		'january',
		'february',
		'march',
		'april',
		'may',
		'june',
		'july',
		'august',
		'september',
		'october',
		'november',
		'december'
	];

	const reportsPageUrl = 'https://appgoblin.info/reports';
	const reportsPageTitle = 'Mobile App Marketing Reports for Ad Buyers and Publishers | AppGoblin';
	const reportsPageDescription =
		'Browse AppGoblin mobile app marketing reports for ad buyers and mobile app publishers. Compare ad network reach, creatives, UA trends, and advertiser strategies.';

	const titleCaseOverrides: Record<string, string> = {
		q1: 'Q1',
		q2: 'Q2',
		q3: 'Q3',
		q4: 'Q4',
		sdk: 'SDK',
		sdks: 'SDKs',
		ua: 'UA'
	};

	const reportSeriesCatalog = [
		{
			key: 'ad-user-acquisition',
			match: (slug: string) => slug.startsWith('ad-user-acquisition-'),
			label: 'Ad User Acquisition',
			description:
				'Monthly reads on advertiser activity, creative rotation, and network share changes across the mobile ad market.',
			highlights: ['Creatives', 'Top advertisers', 'Network share']
		},
		{
			key: 'app-ecosystem-report',
			match: (slug: string) =>
				slug.startsWith('app-ecosystem-report-') || slug.startsWith('mobile-apps-growth-sdks-'),
			label: 'App Ecosystem Report',
			description:
				'Longer-range reports on SDK adoption, app infrastructure, and market shifts across the mobile app ecosystem.',
			highlights: ['SDK footprint', 'Infrastructure shifts', 'App ecosystem trends']
		}
	] as const;

	function formatSegment(segment: string): string {
		const normalized = segment.toLowerCase();

		if (titleCaseOverrides[normalized]) {
			return titleCaseOverrides[normalized];
		}

		return normalized.charAt(0).toUpperCase() + normalized.slice(1);
	}

	function toTitleCase(value: string): string {
		return value.split('-').filter(Boolean).map(formatSegment).join(' ');
	}

	function getDateSortValue(date: string | null): number {
		if (!date) {
			return 0;
		}

		return Number(date.replaceAll('-', ''));
	}

	function getPublishedDateFromSource(source: string | undefined): string | null {
		if (!source) {
			return null;
		}

		const reportPublishedDateMatch = source.match(/const\s+reportPublishedDate\s*=\s*'([^']+)'/);

		if (reportPublishedDateMatch) {
			return reportPublishedDateMatch[1];
		}

		const inlineDatePublishedMatch = source.match(/datePublished:\s*'([^']+)'/);

		if (inlineDatePublishedMatch) {
			return inlineDatePublishedMatch[1];
		}

		return null;
	}

	function parseReportSlug(slug: string): {
		title: string;
		period: string | null;
	} {
		const segments = slug.split('-');
		const yearIndex = segments.findIndex((segment) => /^\d{4}$/.test(segment));
		let title = toTitleCase(slug);
		let period: string | null = null;

		if (yearIndex !== -1) {
			const year = Number(segments[yearIndex]);
			const previousSegment = segments[yearIndex - 1]?.toLowerCase() ?? '';
			const nextSegment = segments[yearIndex + 1]?.toLowerCase() ?? '';
			const quarterBefore = /^q[1-4]$/.test(previousSegment) ? previousSegment.toUpperCase() : null;
			const quarterAfter = /^q[1-4]$/.test(nextSegment) ? nextSegment.toUpperCase() : null;
			const quarter = quarterBefore ?? quarterAfter;
			const monthIndex = monthNames.indexOf(nextSegment);
			const titleEndIndex = quarterBefore ? yearIndex - 1 : yearIndex;
			const nameParts = segments.slice(0, Math.max(titleEndIndex, 0));

			title = nameParts.length > 0 ? toTitleCase(nameParts.join('-')) : toTitleCase(slug);

			if (!Number.isNaN(year)) {
				if (monthIndex >= 0) {
					period = `${formatSegment(nextSegment)} ${year}`;
				} else if (quarter) {
					period = `${quarter} ${year}`;
				} else {
					const trailingParts = segments
						.slice(yearIndex + 1)
						.map(formatSegment)
						.join(' ');
					period = [trailingParts, year].filter(Boolean).join(' ').trim() || `${year}`;
				}
			}
		}

		return {
			title,
			period
		};
	}

	function getReportSeries(slug: string, fallbackTitle: string) {
		const series = reportSeriesCatalog.find((entry) => entry.match(slug));

		if (series) {
			return series;
		}

		return {
			key: slug,
			label: fallbackTitle,
			description:
				'Archive report covering mobile app marketing trends, advertiser behavior, and publisher-relevant market changes.',
			highlights: ['Market analysis']
		};
	}

	function getReportDisplayTitle(
		slug: string,
		title: string,
		period: string | null,
		seriesLabel: string
	): string {
		if (slug.startsWith('ad-user-acquisition-') && period) {
			return `${period} ${seriesLabel}`;
		}

		const ecosystemQuarterMatch = slug.match(/^app-ecosystem-report-(q[1-4])-(\d{4})$/i);

		if (ecosystemQuarterMatch) {
			const [, quarter, year] = ecosystemQuarterMatch;
			return `${year} ${quarter.toUpperCase()} ${seriesLabel}`;
		}

		if (slug.startsWith('mobile-apps-growth-sdks-') && period) {
			return `${period} ${seriesLabel}`;
		}

		return title;
	}

	function generateJsonLdArticles(): Array<{
		'@type': string;
		position: number;
		item: {
			'@type': string[];
			'@id': string;
			name: string;
			headline: string;
			description: string;
			url: string;
			datePublished?: string;
			inLanguage: string;
			audience: { '@type': string; audienceType: string }[];
			keywords: string[];
		};
	}> {
		return reports.map((report, index) => {
			const absoluteReportUrl = `https://appgoblin.info${report.url}`;
			return {
				'@type': 'ListItem',
				position: index + 1,
				item: {
					'@type': ['Report', 'NewsArticle'],
					'@id': `${absoluteReportUrl}#report`,
					name: report.displayTitle,
					headline: report.displayTitle,
					description: report.seriesDescription,
					url: absoluteReportUrl,
					...(report.publishedDate && { datePublished: report.publishedDate }),
					inLanguage: 'en',
					audience: [
						{ '@type': 'Audience', audienceType: 'Mobile ad buyers' },
						{ '@type': 'Audience', audienceType: 'Mobile app publishers' }
					],
					keywords: [
						'mobile app marketing report',
						'user acquisition',
						'ad network analytics',
						'mobile advertising creatives',
						'mobile app publishers'
					]
				}
			};
		});
	}

	const reportModules = import.meta.glob('./*/+page.svelte');
	const reportSourceModules = import.meta.glob('./*/+page.svelte', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>;

	const reports: ReportEntry[] = Object.keys(reportModules)
		.map((path) => {
			const match = path.match(/\.\/([^/]+)\/\+page\.svelte$/);
			const slug = match ? match[1] : path;
			const parsed = parseReportSlug(slug);
			const series = getReportSeries(slug, parsed.title);
			const publishedDate = getPublishedDateFromSource(reportSourceModules[path]);
			const displayTitle = getReportDisplayTitle(slug, parsed.title, parsed.period, series.label);

			return {
				slug,
				url: `/reports/${slug}`,
				title: parsed.title,
				displayTitle,
				period: parsed.period,
				sortValue: getDateSortValue(publishedDate),
				publishedDate,
				seriesKey: series.key,
				seriesLabel: series.label,
				seriesDescription: series.description,
				highlights: [...series.highlights]
			};
		})
		.sort((a, b) => {
			if (b.sortValue !== a.sortValue) return b.sortValue - a.sortValue;
			return a.title.localeCompare(b.title);
		});

	const latestReports = reports.slice(0, 3);
	const latestReportSlugs = new Set(latestReports.map((report) => report.slug));
	const newestReportPeriod = latestReports[0]?.period ?? null;

	const reportGroups: ReportGroup[] = Array.from(
		reports
			.reduce((groups, report) => {
				const existingGroup = groups.get(report.seriesKey);

				if (existingGroup) {
					existingGroup.reports.push(report);
					return groups;
				}

				groups.set(report.seriesKey, {
					key: report.seriesKey,
					label: report.seriesLabel,
					description: report.seriesDescription,
					highlights: [...report.highlights],
					reports: [report]
				});

				return groups;
			}, new Map<string, ReportGroup>())
			.values()
	).sort((a, b) => {
		const leftSort = a.reports[0]?.sortValue ?? 0;
		const rightSort = b.reports[0]?.sortValue ?? 0;

		if (rightSort !== leftSort) return rightSort - leftSort;
		return a.label.localeCompare(b.label);
	});
</script>

<svelte:head>
	<title>{reportsPageTitle}</title>
	<meta name="description" content={reportsPageDescription} />
	<link rel="canonical" href={reportsPageUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="AppGoblin" />
	<meta property="og:title" content={reportsPageTitle} />
	<meta property="og:description" content={reportsPageDescription} />
	<meta property="og:url" content={reportsPageUrl} />
	<meta property="og:image" content="https://appgoblin.info/appgoblin_screenshot.png" />
	<meta
		property="og:image:alt"
		content="AppGoblin reports hub for mobile app marketing and user acquisition intelligence"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={reportsPageTitle} />
	<meta name="twitter:description" content={reportsPageDescription} />
	<meta name="twitter:image" content="https://appgoblin.info/appgoblin_screenshot.png" />

	<!-- Structured Data for CollectionPage and Articles -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'CollectionPage',
				'@id': `${reportsPageUrl}#collection`,
				url: reportsPageUrl,
				name: 'Mobile App Marketing Reports',
				description: reportsPageDescription,
				inLanguage: 'en',
				isPartOf: {
					'@id': 'https://appgoblin.info/#website'
				},
				about: [
					{ '@type': 'Thing', name: 'Mobile App Marketing' },
					{ '@type': 'Thing', name: 'User Acquisition' },
					{ '@type': 'Thing', name: 'Mobile Ad Networks' }
				],
				audience: [
					{ '@type': 'Audience', audienceType: 'Mobile ad buyers' },
					{ '@type': 'Audience', audienceType: 'Mobile app publishers' }
				],
				mainEntity: {
					'@id': `${reportsPageUrl}#itemlist`
				},
				publisher: {
					'@id': 'https://appgoblin.info/#organization'
				}
			},
			{
				'@type': 'ItemList',
				'@id': `${reportsPageUrl}#itemlist`,
				name: 'AppGoblin Report Index',
				numberOfItems: reports.length,
				itemListOrder: 'https://schema.org/ItemListOrderDescending',
				itemListElement: generateJsonLdArticles()
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `${reportsPageUrl}#breadcrumbs`,
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
						item: reportsPageUrl
					}
				]
			},
			{
				'@type': 'Organization',
				'@id': 'https://appgoblin.info/#organization',
				name: 'AppGoblin',
				url: 'https://appgoblin.info/',
				logo: {
					'@type': 'ImageObject',
					url: 'https://appgoblin.info/AppGoblin_Large_Logo.png'
				}
			},
			{
				'@type': 'WebSite',
				'@id': 'https://appgoblin.info/#website',
				url: 'https://appgoblin.info/',
				name: 'AppGoblin',
				publisher: {
					'@id': 'https://appgoblin.info/#organization'
				}
			}
		]
	})}<\/script>`}
</svelte:head>

<div class="mx-auto max-w-6xl space-y-12 p-6 md:space-y-16 md:p-8">
	<header class="space-y-4">
		<div>
			<h1 class="text-3xl font-bold md:text-4xl">Mobile App Marketing Reports</h1>
			<p class="mt-2 max-w-3xl text-sm md:text-base">
				Research-grade report library for mobile ad buyers and app publishers. Start with the newest
				releases, then browse each report series to compare recurring coverage areas.
			</p>
		</div>
	</header>

	{#if latestReports.length > 0}
		<section class="space-y-6 py-2">
			<div class="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
				<div>
					<h2 class="text-2xl font-bold tracking-tight md:text-3xl">Latest Reports</h2>
					<p class="mt-2 text-sm md:text-base">
						The newest releases across all report types, ordered by publication period.
					</p>
				</div>
				{#if newestReportPeriod}
					<span class="badge preset-filled-success-300-700 text-xs"
						>Newest: {newestReportPeriod}</span
					>
				{/if}
			</div>

			<div class="grid gap-4 lg:grid-cols-3">
				{#each latestReports as report}
					<a
						href={report.url}
						class="block rounded-lg border border-surface-300-700 p-5 no-underline hover:no-underline"
					>
						<div class="flex flex-wrap gap-2">
							<span class="badge preset-filled-primary-500 text-xs">{report.seriesLabel}</span>
							{#if report.period}
								<span class="badge preset-filled-surface-700-300 text-xs">{report.period}</span>
							{/if}
						</div>
						<h3 class="mt-4 text-lg font-bold">{report.displayTitle}</h3>
						<p class="mt-2 text-sm">
							{report.period && report.displayTitle !== report.title
								? report.seriesDescription
								: report.period
									? report.title
									: report.seriesDescription}
						</p>
						<p class="mt-4 text-sm font-semibold">Open report →</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<section class="space-y-6 pt-2 md:space-y-8 md:pt-4">
		<div>
			<h2 class="text-2xl font-bold tracking-tight md:text-3xl">Browse By Report Type</h2>
			<p class="mt-2 text-sm md:text-base">
				Each series keeps its own archive, making it easier to find the latest installment for a
				specific coverage area.
			</p>
		</div>

		{#each reportGroups as group}
			<section class="space-y-4 py-3 md:space-y-5">
				<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<div class="flex flex-wrap items-center gap-2">
							<h3 class="text-xl font-bold">{group.label}</h3>
							<span class="badge preset-filled-surface-700-300 text-xs">
								{group.reports.length}
								{group.reports.length === 1 ? 'report' : 'reports'}
							</span>
						</div>
						<p class="mt-1 max-w-3xl text-sm">{group.description}</p>
					</div>

					<div class="flex flex-wrap gap-2">
						{#each group.highlights as highlight}
							<span class="badge preset-outlined-surface-700-300 text-xs">{highlight}</span>
						{/each}
					</div>
				</div>

				<div class="grid gap-3 lg:grid-cols-2">
					{#each group.reports as report}
						<a
							href={report.url}
							class="block rounded-lg border border-surface-300-700 p-4 no-underline hover:no-underline"
						>
							<div class="flex flex-wrap gap-2">
								{#if report.period}
									<span class="badge preset-filled-surface-700-300 text-xs">{report.period}</span>
								{/if}
								{#if latestReportSlugs.has(report.slug)}
									<span class="badge preset-filled-success-300-700 text-xs">Latest release</span>
								{/if}
							</div>

							<div class="mt-3 flex items-start justify-between gap-3">
								<div>
									<h4 class="text-lg font-bold">{report.displayTitle}</h4>
									<p class="mt-1 text-sm">
										{report.period && report.displayTitle !== report.title
											? report.seriesDescription
											: report.period
												? report.title
												: report.seriesDescription}
									</p>
								</div>
								<span class="text-sm font-semibold">View →</span>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/each}
	</section>
</div>
