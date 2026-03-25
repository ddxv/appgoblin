<script lang="ts">
	import { BarChart, AreaChart, LineChart } from 'layerchart';
	import type { AppGlobalMetrics, AppCountryMetrics } from '../types';
	import { format, PeriodType } from '@layerstack/utils';
	import { countryCodeToEmoji } from './utils/countryCodeToEmoji';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { goto } from '$app/navigation';

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
		data: (AppGlobalMetrics | AppCountryMetrics)[],
		keyColors: string[],
		titleMetric: string
	): SeriesEntry[] {
		// Keys ordered from 1-star to 5-star to match color array
		const isNew = titleMetric.startsWith('weekly_') && titleMetric.endsWith('_star');
		const uniqueKeys = isNew
			? [
					'weekly_one_star',
					'weekly_two_star',
					'weekly_three_star',
					'weekly_four_star',
					'weekly_five_star'
				]
			: ['one_star', 'two_star', 'three_star', 'four_star', 'five_star'];

		// Calculate total value for each key
		const keyTotals = uniqueKeys.map((key) => ({
			key,
			total: data.reduce((sum, row) => sum + (Number(row[key as keyof typeof row]) || 0), 0)
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
		data: AppGlobalMetrics[] | AppCountryMetrics[];
		selectedCountry: string;
		availableCountries: { code: string; name: string }[];
	}
	let { data, selectedCountry, availableCountries }: Props = $props();

	const layer = 'svg';

	// State for toggles
	let starsExpanded = $state(false);
	let showNewStars = $state(false);

	async function onRegionChange(event: Event) {
		const region = (event.currentTarget as HTMLSelectElement).value;

		if (region === 'global') {
			await goto('?', { keepFocus: true, noScroll: true });
			return;
		}

		await goto(`?country=${encodeURIComponent(region)}`, { keepFocus: true, noScroll: true });
	}

	// Filter data by selected scope
	const filteredData = $derived.by((): AppGlobalMetrics[] => {
		return (data ?? []) as unknown as AppGlobalMetrics[];
	});

	const hasField = (row: unknown, key: string) => {
		if (!row || typeof row !== 'object') return false;
		return key in (row as Record<string, unknown>);
	};
	const latestRow = $derived(filteredData[filteredData.length - 1]);

	// Metric keys selected by available fields in payload
	const xAxisKey = $derived(hasField(latestRow, 'week_start') ? 'week_start' : 'snapshot_date');
	const getDate = (d: (AppGlobalMetrics | AppCountryMetrics) | undefined) => {
		if (!d) return '';
		const row = d as unknown as Record<string, unknown>;
		return (row.week_start as string) ?? (row.snapshot_date as string) ?? '';
	};
	const ratingCountKey = $derived(
		hasField(latestRow, 'cumulative_ratings') ? 'cumulative_ratings' : 'rating_count'
	);
	const newRatingCountKey = $derived(
		hasField(latestRow, 'weekly_ratings') ? 'weekly_ratings' : 'weekly_rating_count'
	);
	const getRatingCount = (d: (AppGlobalMetrics | AppCountryMetrics) | undefined) =>
		(d ? Number((d as unknown as Record<string, unknown>)[ratingCountKey]) : 0) || 0;

	// Generate series keys based on whether we're showing new or cumulative
	let seriesKeysBar = $derived(
		showNewStars
			? generateSeriesKeys(filteredData, keyColors, 'new_one_star')
			: generateSeriesKeys(filteredData, keyColors, 'one_star')
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

	// Calculate summary stats from filtered data
	const latestData = $derived(filteredData[filteredData.length - 1]);
	const earliestData = $derived(filteredData[0]);
	const hasInstallMetrics = $derived('cumulative_installs' in (latestData ?? {}));

	// Calculate overall trend from earliest to latest
	const calculateOverallChange = (latest: number, earliest: number): number => {
		if (!earliest || earliest === 0) return 0;
		return ((latest - earliest) / earliest) * 100;
	};

	// Calculate 1-star to 5-star ratio
	const calculateStarRatio = (data: typeof latestData): number => {
		const oneStars = data?.one_star ?? 0;
		const fiveStars = data?.five_star ?? 0;
		if (fiveStars === 0) return 0;
		return oneStars / fiveStars;
	};

	const calculateStarShare = (data: typeof latestData, star: 'one_star' | 'five_star'): number => {
		const oneStars = data?.one_star ?? 0;
		const twoStars = data?.two_star ?? 0;
		const threeStars = data?.three_star ?? 0;
		const fourStars = data?.four_star ?? 0;
		const fiveStars = data?.five_star ?? 0;
		const total = oneStars + twoStars + threeStars + fourStars + fiveStars;

		if (total === 0) return 0;
		const value = star === 'one_star' ? oneStars : fiveStars;
		return (value / total) * 100;
	};

	// Calculate trend direction
	const getTrendIcon = (value: number) => (value >= 0 ? '↑' : '↓');
	const getTrendColor = (value: number) => (value >= 0 ? 'text-green-600' : 'text-red-600');
	// Inverted color for 1-star share (lower is better)
	const getNegativeShareColor = (value: number) => (value <= 0 ? 'text-green-600' : 'text-red-600');
</script>

<!-- Header with Summary Cards -->
<div class="mb-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">App Trends</h1>

		<div class="flex items-center gap-3">
			<label for="region-select" class="text-sm font-medium">Region:</label>
			<select
				id="region-select"
				value={selectedCountry}
				onchange={onRegionChange}
				class="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				<option value="global">🌍 Global</option>
				{#each availableCountries as country}
					<option value={country.code}>{countryCodeToEmoji(country.code)} {country.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Summary Cards -->
	<div
		class="grid grid-cols-1 gap-4 md:grid-cols-2"
		class:lg:grid-cols-5={hasInstallMetrics}
		class:lg:grid-cols-4={!hasInstallMetrics}
	>
		<!-- Date Range Card -->
		<div class="rounded-lg border p-5">
			<div class="mb-2 text-sm font-medium opacity-70">Tracking Period</div>
			<div class="mb-1 text-lg font-bold">
				{format(getDate(earliestData), PeriodType.Day, { variant: 'short' })}
			</div>
			<div class="mb-2 text-center text-xs opacity-50">to</div>
			<div class="text-lg font-bold">
				{format(getDate(latestData), PeriodType.Day, { variant: 'short' })}
			</div>
			<div class="mt-3 text-xs opacity-70">
				{filteredData.length} data points
			</div>
		</div>

		{#if hasInstallMetrics}
			<div class="rounded-lg border p-5 shadow-sm">
				<div class="text-sm font-medium opacity-70">Total Installs</div>
				<div class="my-3 text-3xl font-bold">
					{formatNumber((latestData as AppGlobalMetrics)?.cumulative_installs ?? 0)}
				</div>
				<div class="flex items-center justify-between text-xs">
					<div class="opacity-70">
						From: <span class="font-semibold"
							>{formatNumber((earliestData as AppGlobalMetrics)?.cumulative_installs ?? 0)}</span
						>
					</div>
					<div
						class="font-semibold {getTrendColor(
							calculateOverallChange(
								(latestData as AppGlobalMetrics)?.cumulative_installs ?? 0,
								(earliestData as AppGlobalMetrics)?.cumulative_installs ?? 0
							)
						)}"
					>
						{getTrendIcon(
							calculateOverallChange(
								(latestData as AppGlobalMetrics)?.cumulative_installs ?? 0,
								(earliestData as AppGlobalMetrics)?.cumulative_installs ?? 0
							)
						)}
						{formatPercent(
							Math.abs(
								calculateOverallChange(
									(latestData as AppGlobalMetrics)?.cumulative_installs ?? 0,
									(earliestData as AppGlobalMetrics)?.cumulative_installs ?? 0
								)
							)
						)}
					</div>
				</div>
			</div>
		{/if}

		<div class="rounded-lg border p-5 shadow-sm">
			<div class="text-sm font-medium opacity-70">Average Rating</div>
			<div class="my-3 text-3xl font-bold">{(latestData?.rating ?? 0).toFixed(2)} ⭐</div>
			<div class="flex items-center justify-between text-xs">
				<div class="opacity-70">
					From: <span class="font-semibold">{(earliestData?.rating ?? 0).toFixed(2)} ⭐</span>
				</div>
				<div
					class="font-semibold {getTrendColor(
						calculateOverallChange(latestData?.rating ?? 0, earliestData?.rating ?? 0)
					)}"
				>
					{getTrendIcon(calculateOverallChange(latestData?.rating ?? 0, earliestData?.rating ?? 0))}
					{formatPercent(
						Math.abs(calculateOverallChange(latestData?.rating ?? 0, earliestData?.rating ?? 0))
					)}
				</div>
			</div>
		</div>

		<div class="rounded-lg border p-5 shadow-sm">
			<div class="text-sm font-medium opacity-70">Total Ratings</div>
			<div class="my-3 text-3xl font-bold">{formatNumber(getRatingCount(latestData))}</div>
			<div class="flex items-center justify-between text-xs">
				<div class="opacity-70">
					From: <span class="font-semibold">{formatNumber(getRatingCount(earliestData))}</span>
				</div>
				<div
					class="font-semibold {getTrendColor(
						calculateOverallChange(getRatingCount(latestData), getRatingCount(earliestData))
					)}"
				>
					{getTrendIcon(
						calculateOverallChange(getRatingCount(latestData), getRatingCount(earliestData))
					)}
					{formatPercent(
						Math.abs(
							calculateOverallChange(getRatingCount(latestData), getRatingCount(earliestData))
						)
					)}
				</div>
			</div>
		</div>

		<!-- Rating Sentiment Mix Card -->
		<div class="rounded-lg border p-5 shadow-sm">
			<div class="text-sm font-medium opacity-70">Rating Sentiment Mix</div>
			<div class="my-2 text-lg font-bold">
				1★ Share: {calculateStarShare(latestData, 'one_star').toFixed(1)}%
			</div>
			<div class="text-sm font-semibold opacity-80">
				5★ Share: {calculateStarShare(latestData, 'five_star').toFixed(1)}%
			</div>
			<div class="mt-1 text-xs opacity-70">
				Neg/Pos ratio: {calculateStarRatio(latestData).toFixed(3)}
			</div>
			<div class="mt-3 flex items-center justify-between text-xs">
				<div class="opacity-70">
					From: <span class="font-semibold"
						>{calculateStarShare(earliestData, 'one_star').toFixed(1)}%</span
					> 1★
				</div>
				<div
					class="font-semibold {getNegativeShareColor(
						calculateOverallChange(
							calculateStarShare(latestData, 'one_star'),
							calculateStarShare(earliestData, 'one_star')
						)
					)}"
				>
					{getTrendIcon(
						calculateOverallChange(
							calculateStarShare(latestData, 'one_star'),
							calculateStarShare(earliestData, 'one_star')
						)
					)}
					{formatPercent(
						Math.abs(
							calculateOverallChange(
								calculateStarShare(latestData, 'one_star'),
								calculateStarShare(earliestData, 'one_star')
							)
						)
					)}
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Main Content -->
<div class="space-y-8">
	<!-- Installs Section -->
	{#if hasInstallMetrics}
		<div class="rounded-lg border p-6">
			<h2 class="mb-6 text-xl font-bold">Install Analytics</h2>
			<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div>
					<h3 class="mb-3 text-sm font-semibold">Cumulative Installs</h3>
					<div class="h-[300px]">
						<AreaChart
							data={filteredData}
							x={xAxisKey}
							y="cumulative_installs"
							{layer}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
								yAxis: { format: (d) => formatNumber(d) }
							}}
						/>
					</div>
				</div>

				<div>
					<h3 class="mb-3 text-sm font-semibold">Weekly Installs</h3>
					<div class="h-[300px]">
						<BarChart
							data={filteredData}
							x={xAxisKey}
							y="weekly_installs"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="weekly_installs_rate_of_change"
							{layer}
							props={{
								xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
								yAxis: { format: (d) => d.toFixed(2) + '%' }
							}}
						/>
					</div>
				</div>
			</div>
		</div>

		{#if selectedCountry === 'global'}
			<!-- Engagement & Revenue Section -->
			<div class="rounded-lg border p-6">
				<h2 class="mb-6 text-xl font-bold">Engagement & Revenue</h2>
				<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<div>
						<h3 class="mb-3 text-sm font-semibold">Weekly Active Users</h3>
						<div class="h-[300px]">
							<BarChart
								data={filteredData}
								x={xAxisKey}
								y="weekly_active_users"
								{layer}
								props={{
									xAxis: {
										format: (d) => format(d, PeriodType.Day, { variant: 'short' }),
										ticks: 5
									},
									yAxis: { format: (d) => formatNumber(d) }
								}}
							/>
						</div>
					</div>

					<div>
						<h3 class="mb-3 text-sm font-semibold">Weekly Ad Revenue</h3>
						<div class="h-[300px]">
							<BarChart
								data={filteredData}
								x={xAxisKey}
								y="weekly_ad_revenue"
								{layer}
								props={{
									xAxis: {
										format: (d) => format(d, PeriodType.Day, { variant: 'short' }),
										ticks: 5
									},
									yAxis: { format: (d) => formatNumber(d) }
								}}
							/>
						</div>
					</div>

					<div>
						<h3 class="mb-3 text-sm font-semibold">Weekly IAP Revenue</h3>
						<div class="h-[300px]">
							<BarChart
								data={filteredData}
								x={xAxisKey}
								y="weekly_iap_revenue"
								{layer}
								props={{
									xAxis: {
										format: (d) => format(d, PeriodType.Day, { variant: 'short' }),
										ticks: 5
									},
									yAxis: { format: (d) => formatNumber(d) }
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}
	{/if}

	<!-- Ratings Section -->
	<div class="rounded-lg border p-6">
		<h2 class="mb-6 text-xl font-bold">Rating Analytics</h2>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<div>
				<h3 class="mb-3 text-sm font-semibold">Average Rating</h3>
				<div class="h-[300px]">
					<LineChart
						data={filteredData}
						x={xAxisKey}
						y="rating"
						{layer}
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
						data={filteredData}
						x={xAxisKey}
						y={ratingCountKey}
						{layer}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => formatNumber(d) }
						}}
					/>
				</div>
			</div>

			<div>
				<h3 class="mb-3 text-sm font-semibold">Weekly Ratings</h3>
				<div class="h-[300px]">
					<BarChart
						data={filteredData}
						x={xAxisKey}
						y={newRatingCountKey}
						{layer}
						props={{
							xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
							yAxis: { format: (d) => formatNumber(d) }
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
						<Switch onCheckedChange={() => (showNewStars = !showNewStars)}>
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Label>Daily Ratings</Switch.Label>
							<Switch.HiddenInput />
						</Switch>
					</div>

					<!-- Count vs Percentage Toggle -->
					<div class="flex items-center gap-3">
						<Switch onCheckedChange={() => (starsExpanded = !starsExpanded)}>
							<Switch.Control>
								<Switch.Thumb />
							</Switch.Control>
							<Switch.Label>Percentage</Switch.Label>
							<Switch.HiddenInput />
						</Switch>
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
					data={filteredData}
					x={xAxisKey}
					series={seriesKeysBar}
					seriesLayout={starsExpanded ? 'stackExpand' : 'stack'}
					{layer}
					props={{
						xAxis: { format: (d) => format(d, PeriodType.Day, { variant: 'short' }), ticks: 5 },
						yAxis: { format: (d) => (starsExpanded ? d.toFixed(0) + '%' : formatNumber(d)) }
					}}
				/>
			</div>
		</div>

		<!-- Star Distribution Overview -->
		<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
			<div class="rounded border p-4" style="border-color: {darkgreen};">
				<div class="text-xs font-medium">5 Stars ⭐⭐⭐⭐⭐</div>
				<div class="mt-2 text-xl font-bold">
					{formatNumber(latestData?.five_star ?? 0)}
				</div>
				<div class="mt-1 text-xs">
					+{formatNumber(latestData?.new_five_star ?? 0)}
				</div>
			</div>
			<div class="rounded border p-4" style="border-color: {lightgreen};">
				<div class="text-xs font-medium">4 Stars ⭐⭐⭐⭐</div>
				<div class="mt-2 text-xl font-bold">
					{formatNumber(latestData?.four_star ?? 0)}
				</div>
				<div class="mt-1 text-xs">
					+{formatNumber(latestData?.new_four_star ?? 0)}
				</div>
			</div>
			<div class="rounded border p-4" style="border-color: {yellow};">
				<div class="text-xs font-medium">3 Stars ⭐⭐⭐</div>
				<div class="mt-2 text-xl font-bold">
					{formatNumber(latestData?.three_star ?? 0)}
				</div>
				<div class="mt-1 text-xs">
					+{formatNumber(latestData?.new_three_star ?? 0)}
				</div>
			</div>
			<div class="rounded border p-4" style="border-color: {orange};">
				<div class="text-xs font-medium">2 Stars ⭐⭐</div>
				<div class="mt-2 text-xl font-bold">
					{formatNumber(latestData?.two_star ?? 0)}
				</div>
				<div class="mt-1 text-xs">
					+{formatNumber(latestData?.new_two_star ?? 0)}
				</div>
			</div>
			<div class="rounded border p-4" style="border-color: {red};">
				<div class="text-xs font-medium">1 Star ⭐</div>
				<div class="mt-2 text-xl font-bold">
					{formatNumber(latestData?.one_star ?? 0)}
				</div>
				<div class="mt-1 text-xs">
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
							data={filteredData}
							x={xAxisKey}
							y="five_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="weekly_five_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="five_star_rate_of_change"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="four_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="weekly_four_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="four_star_rate_of_change"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="three_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="weekly_three_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="three_star_rate_of_change"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="two_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="weekly_two_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="two_star_rate_of_change"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="one_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="weekly_one_star"
							{layer}
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
							data={filteredData}
							x={xAxisKey}
							y="one_star_rate_of_change"
							{layer}
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
