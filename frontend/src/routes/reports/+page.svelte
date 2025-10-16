<script lang="ts">
	type ReportEntry = {
		slug: string;
		url: string;
		title: string;
		period: string | null;
		sortValue: number;
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

	function toTitleCase(value: string): string {
		return value
			.split('-')
			.filter(Boolean)
			.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
			.join(' ');
	}

	const reportModules = import.meta.glob('./*/+page.svelte');

	const reports: ReportEntry[] = Object.keys(reportModules)
		.map((path) => {
			const match = path.match(/\.\/([^/]+)\/\+page\.svelte$/);
			const slug = match ? match[1] : path;
			const segments = slug.split('-');
			const yearIndex = segments.findIndex((segment) => /^\d{4}$/.test(segment));

			let title = toTitleCase(slug);
			let period: string | null = null;
			let sortValue = 0;

			if (yearIndex !== -1) {
				const nameParts = segments.slice(0, yearIndex);
				const periodParts = segments.slice(yearIndex);
				const year = Number(periodParts[0]);
				const monthSegment = periodParts[1] ?? '';
				const monthIndex = monthNames.indexOf(monthSegment.toLowerCase());

				title = nameParts.length > 0 ? toTitleCase(nameParts.join('-')) : toTitleCase(slug);

				if (!Number.isNaN(year)) {
					sortValue = year * 100 + (monthIndex >= 0 ? monthIndex + 1 : 0);
					if (monthIndex >= 0) {
						const monthName = monthSegment.charAt(0).toUpperCase() + monthSegment.slice(1);
						period = `${monthName} ${year}`;
					} else {
						const additional = periodParts.slice(1).map(toTitleCase).join(' ');
						period = [additional, year].filter(Boolean).join(' ').trim() || `${year}`;
					}
				}
			}

			return {
				slug,
				url: `/reports/${slug}`,
				title,
				period,
				sortValue
			};
		})
		.sort((a, b) => {
			if (b.sortValue !== a.sortValue) return b.sortValue - a.sortValue;
			return a.title.localeCompare(b.title);
		});
</script>

<svelte:head>
	<title>AppGoblin Reports</title>
	<meta
		name="description"
		content="Browse AppGoblin intelligence reports and deep dives into advertising performance."
	/>
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-16">
	<header class="text-center mb-16">
		<span
			class="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white"
		>
			Insights Library
		</span>
		<h1 class="mt-6 text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
			Reports &amp; Analysis
		</h1>
		<p class="mt-4 text-lg text-surface-600 dark:text-surface-400">
			Explore curated reports covering user acquisition trends, creative performance, and ad network
			benchmarks.
		</p>
	</header>

	{#if reports.length === 0}
		<div
			class="rounded-xl border border-dashed border-surface-300 bg-surface-50 p-8 text-center text-surface-500 dark:border-surface-700 dark:bg-surface-900/50 dark:text-surface-400"
		>
			No reports are available yet. Check back soon!
		</div>
	{:else}
		<section class="grid gap-6 md:grid-cols-2">
			{#each reports as report}
				<a
					href={report.url}
					class="group block h-full rounded-xl border border-surface-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-400 hover:shadow-lg dark:border-surface-700 dark:bg-surface-900"
				>
					<div class="flex items-start justify-between">
						<h2
							class="text-xl font-semibold text-surface-900 transition group-hover:text-purple-600 dark:text-surface-100"
						>
							{report.title}
						</h2>
						<span class="text-sm font-medium text-purple-500 group-hover:text-purple-600">
							View
						</span>
					</div>
					{#if report.period}
						<p
							class="mt-3 text-sm font-medium uppercase tracking-wide text-surface-500 dark:text-surface-400"
						>
							{report.period}
						</p>
					{/if}
					<p class="mt-4 text-sm text-surface-600 dark:text-surface-400">
						Dive into advertising performance insights, network share, and creative trends for this
						reporting period.
					</p>
					<div
						class="mt-6 flex items-center gap-2 text-sm font-semibold text-purple-500 group-hover:gap-3"
					>
						<span>Read report</span>
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
							<path
								d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 9H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z"
							/>
						</svg>
					</div>
				</a>
			{/each}
		</section>
	{/if}
</div>
