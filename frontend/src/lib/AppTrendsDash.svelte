<script lang="ts">
	import { BarChart, AreaChart, LineChart } from 'layerchart';
	import type { AppGlobalMetrics } from '../types';
	import { format, PeriodType } from '@layerstack/utils';

	// Star rating colors (1-star to 5-star order)
	const red = '#E53935';
	const orange = '#FB8C00';
	const yellow = '#FDD835';
	const lightgreen = '#7CB342';
	const darkgreen = '#2E7D32';
	const starColors = [red, orange, yellow, lightgreen, darkgreen]; // 1-star to 5-star
	const keyColors = starColors;

	interface SeriesEntry {
		key: string;
		label: string;
		color: string;
	}

	function generateSeriesKeys(
		data: AppGlobalMetrics[],
		keyColors: string[],
		titleMetric: string
	): SeriesEntry[] {
		// Keys ordered from 1-star to 5-star to match color array
		const isNew = titleMetric.startsWith('new_');
		const uniqueKeys: (keyof AppGlobalMetrics)[] = isNew
			? ['new_one_star', 'new_two_star', 'new_three_star', 'new_four_star', 'new_five_star']
			: ['one_star', 'two_star', 'three_star', 'four_star', 'five_star'];

		// Calculate total value for each key
		const keyTotals = uniqueKeys.map((key) => ({
			key,
			total: data.reduce((sum, row) => sum + (Number(row[key]) || 0), 0)
		}));

		// Map to final format with proper color matching
		const seriesKeys = keyTotals.slice(0, keyColors.length).map((entry, index) => ({
			key: entry.key,
			label: entry.key
				? String(entry.key).charAt(0).toUpperCase() + String(entry.key).slice(1).replace('_', ' ')
				: titleMetric,
			color: keyColors[index]
		}));

		return seriesKeys;
	}

	interface Props {
		data: AppGlobalMetrics[];
		isIOS: boolean;
	}
	let { data, isIOS }: Props = $props();

	const renderContext = 'svg';

	// State for toggles
	let starsExpanded = $state(false);
	let showNewStars = $state(false);

	// Generate series keys based on whether we're showing new or cumulative
	let seriesKeysBar = $derived(
		showNewStars
			? generateSeriesKeys(data, keyColors, 'new_one_star')
			: generateSeriesKeys(data, keyColors, 'one_star')
	);

	// Format helpers
	const formatNumber = (num: number): string => {
		if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
		if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
		return num.toFixed(0);
	};

	const formatPercent = (num: number): string => {
		return num.toFixed(2) + '%';
	};

	// Calculate summary stats
	const latestData = $derived(data[data.length - 1]);

	// Calculate trend direction
	const getTrendIcon = (value: number) => (value >= 0 ? '↑' : '↓');
	const getTrendColor = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600');
</script>

<!-- Header with Summary Cards -->
<div class="mb-8">
	<h1 class="mb-6 text-2xl font-bold">App Performance Dashboard</h1>

	<!-- Summary Cards -->
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
		<div class="rounded-lg border p-4">
			<div class="text-sm opacity-70">Total Installs</div>
			<div class="mt-2 text-2xl font-bold">{formatNumber(latestData?.installs ?? 0)}</div>
			<div class="mt-1 flex items-center text-sm">
				<span class={getTrendColor(latestData?.installs_rate_of_change ?? 0)}>
					{getTrendIcon(latestData?.installs_rate_of_change ?? 0)}
					{formatPercent(Math.abs(latestData?.installs_rate_of_change ?? 0))}
				</span>
				<span class="ml-2 opacity-70">+{formatNumber(latestData?.new_installs ?? 0)} new</span>
			</div>
		</div>

		<div class="rounded-lg border p-4">
			<div class="text-sm opacity-70">Average Rating</div>
			<div class="mt-2 text-2xl font-bold">{(latestData?.rating ?? 0).toFixed(2)} ⭐</div>
			<div class="mt-1 flex items-center text-sm">
				<span class={getTrendColor(latestData?.rating_rate_of_change ?? 0)}>
					{getTrendIcon(latestData?.rating_rate_of_change ?? 0)}
					{formatPercent(Math.abs(latestData?.rating_rate_of_change ?? 0))}
				</span>
				<span class="ml-2 opacity-70">{(latestData?.new_rating ?? 0).toFixed(3)} change</span>
			</div>
		</div>

		<div class="rounded-lg border p-4">
			<div class="text-sm opacity-70">Total Ratings</div>
			<div class="mt-2 text-2xl font-bold">{formatNumber(latestData?.rating_count ?? 0)}</div>
			<div class="mt-1 flex items-center text-sm">
				<span class={getTrendColor(latestData?.rating_count_rate_of_change ?? 0)}>
					{getTrendIcon(latestData?.rating_count_rate_of_change ?? 0)}
					{formatPercent(Math.abs(latestData?.rating_count_rate_of_change ?? 0))}
				</span>
				<span class="ml-2 opacity-70">+{formatNumber(latestData?.new_rating_count ?? 0)} new</span>
			</div>
		</div>

		<div class="rounded-lg border p-4">
			<div class="text-sm opacity-70">Total Reviews</div>
			<div class="mt-2 text-2xl font-bold">{formatNumber(latestData?.review_count ?? 0)}</div>
			<div class="mt-1 flex items-center text-sm">
				<span class={getTrendColor(latestData?.review_count_rate_of_change ?? 0)}>
					{getTrendIcon(latestData?.review_count_rate_of_change ?? 0)}
					{formatPercent(Math.abs(latestData?.review_count_rate_of_change ?? 0))}
				</span>
				<span class="ml-2 opacity-70">+{formatNumber(latestData?.new_review_count ?? 0)} new</span>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="space-y-8">
	<!-- Installs Section -->
	{#if !isIOS}
		<div class="rounded-lg border p-6">
			<h2 class="mb-6 text-xl font-bold">Install Analytics</h2>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<h3 class="mb-3 text-sm font-semibold">Cumulative Installs</h3>
					<div class="h-[300px]">
						<AreaChart
							{data}
							x="snapshot_date"
							y="installs"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold">New Installs (Period Change)</h3>
					<div class="h-[300px]">
						<BarChart
							{data}
							x="snapshot_date"
							y="new_installs"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold">Install Growth Rate (%)</h3>
					<div class="h-[300px]">
						<LineChart
							{data}
							x="snapshot_date"
							y="installs_rate_of_change"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
								yAxis: { format: (d) => d.toFixed(2) + '%' }
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Ratings Section -->
	<div class="rounded-lg border p-6">
		<h2 class="mb-6 text-xl font-bold">Rating Analytics</h2>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div>
				<h3 class="mb-3 text-sm font-semibold">Average Rating</h3>
				<div class="h-[300px]">
					<LineChart
						{data}
						x="snapshot_date"
						y="rating"
						{renderContext}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => d.toFixed(2) }
						}}
					/>
				</div>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">Total Rating Count</h3>
				<div class="h-[300px]">
					<AreaChart
						{data}
						x="snapshot_date"
						y="rating_count"
						{renderContext}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => formatNumber(d) }
						}}
					/>
				</div>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">New Ratings (Period Change)</h3>
				<div class="h-[300px]">
					<BarChart
						{data}
						x="snapshot_date"
						y="new_rating_count"
						{renderContext}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => formatNumber(d) }
						}}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Reviews Section -->
	<div class="rounded-lg border p-6">
		<h2 class="mb-6 text-xl font-bold">Review Analytics</h2>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div>
				<h3 class="mb-3 text-sm font-semibold">Total Reviews</h3>
				<div class="h-[300px]">
					<AreaChart
						{data}
						x="snapshot_date"
						y="review_count"
						{renderContext}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => formatNumber(d) }
						}}
					/>
				</div>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">New Reviews (Period Change)</h3>
				<div class="h-[300px]">
					<BarChart
						{data}
						x="snapshot_date"
						y="new_review_count"
						{renderContext}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => formatNumber(d) }
						}}
					/>
				</div>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">Review Growth Rate (%)</h3>
				<div class="h-[300px]">
					<LineChart
						{data}
						x="snapshot_date"
						y="review_count_rate_of_change"
						{renderContext}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => d.toFixed(2) + '%' }
						}}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Sentiment Analysis Section -->
	<div class="rounded-lg border p-6">
		<div class="mb-6">
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-bold">Star Rating Sentiment Analysis</h2>

				<!-- Toggle Switches -->
				<div class="flex items-center gap-6">
					<!-- Cumulative vs New Toggle -->
					<div class="flex items-center gap-3">
						<span class="text-sm opacity-70">Cumulative</span>
						<button
							onclick={() => (showNewStars = !showNewStars)}
							class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
							class:bg-purple-600={showNewStars}
							class:bg-gray-300={!showNewStars}
							role="switch"
							aria-checked={showNewStars}
							aria-label="Toggle between cumulative and new star ratings"
						>
							<span
								class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
								class:translate-x-6={showNewStars}
								class:translate-x-1={!showNewStars}
							></span>
						</button>
						<span class="text-sm opacity-70">New</span>
					</div>

					<!-- Count vs Percentage Toggle -->
					<div class="flex items-center gap-3">
						<span class="text-sm opacity-70">Count</span>
						<button
							onclick={() => (starsExpanded = !starsExpanded)}
							class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
							class:bg-blue-600={starsExpanded}
							class:bg-gray-300={!starsExpanded}
							role="switch"
							aria-checked={starsExpanded}
							aria-label="Toggle between count and percentage view"
						>
							<span
								class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
								class:translate-x-6={starsExpanded}
								class:translate-x-1={!starsExpanded}
							></span>
						</button>
						<span class="text-sm opacity-70">Percentage</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Stacked Bar Chart -->
		<div class="mb-6">
			<h3 class="mb-3 text-sm font-semibold">
				{showNewStars ? 'New Star Ratings per Period' : 'Cumulative Star Rating Distribution'} Over Time
			</h3>
			<div class="h-[350px]">
				<BarChart
					{data}
					x="snapshot_date"
					series={seriesKeysBar}
					seriesLayout={starsExpanded ? 'stackExpand' : 'stack'}
					{renderContext}
					props={{
						xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
						yAxis: { format: (d) => (starsExpanded ? d.toFixed(0) + '%' : formatNumber(d)) }
					}}
				/>
			</div>
		</div>

		<!-- Star Distribution Overview -->
		<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
			<div
				class="rounded border p-4"
				style="background-color: {darkgreen}20; border-color: {darkgreen};"
			>
				<div class="text-xs font-medium" style="color: {darkgreen};">5 Stars ⭐⭐⭐⭐⭐</div>
				<div class="mt-2 text-xl font-bold" style="color: {darkgreen};">
					{formatNumber(latestData?.five_star ?? 0)}
				</div>
				<div class="mt-1 text-xs" style="color: {darkgreen};">
					+{formatNumber(latestData?.new_five_star ?? 0)}
				</div>
			</div>
			<div
				class="rounded border p-4"
				style="background-color: {lightgreen}20; border-color: {lightgreen};"
			>
				<div class="text-xs font-medium" style="color: {lightgreen};">4 Stars ⭐⭐⭐⭐</div>
				<div class="mt-2 text-xl font-bold" style="color: {lightgreen};">
					{formatNumber(latestData?.four_star ?? 0)}
				</div>
				<div class="mt-1 text-xs" style="color: {lightgreen};">
					+{formatNumber(latestData?.new_four_star ?? 0)}
				</div>
			</div>
			<div class="rounded border p-4" style="background-color: {yellow}20; border-color: {yellow};">
				<div class="text-xs font-medium" style="color: {yellow};">3 Stars ⭐⭐⭐</div>
				<div class="mt-2 text-xl font-bold" style="color: {yellow};">
					{formatNumber(latestData?.three_star ?? 0)}
				</div>
				<div class="mt-1 text-xs" style="color: {yellow};">
					+{formatNumber(latestData?.new_three_star ?? 0)}
				</div>
			</div>
			<div class="rounded border p-4" style="background-color: {orange}20; border-color: {orange};">
				<div class="text-xs font-medium" style="color: {orange};">2 Stars ⭐⭐</div>
				<div class="mt-2 text-xl font-bold" style="color: {orange};">
					{formatNumber(latestData?.two_star ?? 0)}
				</div>
				<div class="mt-1 text-xs" style="color: {orange};">
					+{formatNumber(latestData?.new_two_star ?? 0)}
				</div>
			</div>
			<div class="rounded border p-4" style="background-color: {red}20; border-color: {red};">
				<div class="text-xs font-medium" style="color: {red};">1 Star ⭐</div>
				<div class="mt-2 text-xl font-bold" style="color: {red};">
					{formatNumber(latestData?.one_star ?? 0)}
				</div>
				<div class="mt-1 text-xs" style="color: {red};">
					+{formatNumber(latestData?.new_one_star ?? 0)}
				</div>
			</div>
		</div>

		<!-- 5 Star Charts -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold" style="color: {darkgreen};">5-Star Ratings</h3>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">Total 5-Star Ratings</h4>
					<div class="h-[250px]">
						<AreaChart
							{data}
							x="snapshot_date"
							y="five_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">New 5-Star Ratings</h4>
					<div class="h-[250px]">
						<BarChart
							{data}
							x="snapshot_date"
							y="new_five_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">5-Star Growth Rate (%)</h4>
					<div class="h-[250px]">
						<LineChart
							{data}
							x="snapshot_date"
							y="five_star_rate_of_change"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => d.toFixed(2) + '%' }
							}}
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- 4 Star Charts -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold" style="color: {lightgreen};">4-Star Ratings</h3>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">Total 4-Star Ratings</h4>
					<div class="h-[250px]">
						<AreaChart
							{data}
							x="snapshot_date"
							y="four_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">New 4-Star Ratings</h4>
					<div class="h-[250px]">
						<BarChart
							{data}
							x="snapshot_date"
							y="new_four_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">4-Star Growth Rate (%)</h4>
					<div class="h-[250px]">
						<LineChart
							{data}
							x="snapshot_date"
							y="four_star_rate_of_change"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => d.toFixed(2) + '%' }
							}}
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- 3 Star Charts -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold" style="color: {yellow};">3-Star Ratings</h3>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">Total 3-Star Ratings</h4>
					<div class="h-[250px]">
						<AreaChart
							{data}
							x="snapshot_date"
							y="three_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">New 3-Star Ratings</h4>
					<div class="h-[250px]">
						<BarChart
							{data}
							x="snapshot_date"
							y="new_three_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">3-Star Growth Rate (%)</h4>
					<div class="h-[250px]">
						<LineChart
							{data}
							x="snapshot_date"
							y="three_star_rate_of_change"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => d.toFixed(2) + '%' }
							}}
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- 2 Star Charts -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold" style="color: {orange};">2-Star Ratings</h3>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">Total 2-Star Ratings</h4>
					<div class="h-[250px]">
						<AreaChart
							{data}
							x="snapshot_date"
							y="two_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">New 2-Star Ratings</h4>
					<div class="h-[250px]">
						<BarChart
							{data}
							x="snapshot_date"
							y="new_two_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">2-Star Growth Rate (%)</h4>
					<div class="h-[250px]">
						<LineChart
							{data}
							x="snapshot_date"
							y="two_star_rate_of_change"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => d.toFixed(2) + '%' }
							}}
						/>
					</div>
				</div>
			</div>
		</div>

		<!-- 1 Star Charts -->
		<div class="mb-6">
			<h3 class="mb-4 text-lg font-semibold" style="color: {red};">1-Star Ratings</h3>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">Total 1-Star Ratings</h4>
					<div class="h-[250px]">
						<AreaChart
							{data}
							x="snapshot_date"
							y="one_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">New 1-Star Ratings</h4>
					<div class="h-[250px]">
						<BarChart
							{data}
							x="snapshot_date"
							y="new_one_star"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold opacity-70">1-Star Growth Rate (%)</h4>
					<div class="h-[250px]">
						<LineChart
							{data}
							x="snapshot_date"
							y="one_star_rate_of_change"
							{renderContext}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 4 },
								yAxis: { format: (d) => d.toFixed(2) + '%' }
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
