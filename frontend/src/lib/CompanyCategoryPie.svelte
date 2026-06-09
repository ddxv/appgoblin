<script lang="ts">
	import { PieChart, Text, Tooltip } from 'layerchart';

	type CategoryItem = {
		group: string;
		category: string;
		value: number;
	};

	type GroupMode = 'all' | 'games' | 'apps';

	let {
		plotData,
		plotHeightPx = 250,
		storeLabel = 'Apps (all sources)',
		groupMode = $bindable('all')
	}: {
		plotData: CategoryItem[];
		plotHeightPx?: number;
		storeLabel?: string;
		groupMode?: GroupMode;
	} = $props();

	const palette = ['#6929C4', '#1192E8', '#005D5D', '#9F1853', '#FA4D56', '#FF832B', '#198038'];
	const MAX_SLICES = 9;

	function isGame(category: string): boolean {
		return category.startsWith('game_');
	}

	/** Apply client-side filtering to the raw category data. */
	const groupedPlotData = $derived.by(() => {
		const raw = (plotData ?? []) as CategoryItem[];
		if (raw.length === 0) return [];

		let filtered = raw.map((d) => ({ ...d }));

		if (groupMode === 'games') {
			// Show only game subcategories
			filtered = filtered.filter((item) => isGame(item.category));
		} else if (groupMode === 'apps') {
			// Show only non-game app categories
			filtered = filtered.filter((item) => !isGame(item.category) || item.category === 'None');
		}
		// 'all' mode — keep all raw categories

		// Sum values by category key (in case of duplicates after filtering)
		const merged = new Map<string, { label: string; value: number }>();
		for (const item of filtered) {
			const key = item.category;
			const label = item.group;
			if (merged.has(key)) {
				merged.get(key)!.value += item.value;
			} else {
				merged.set(key, { label, value: item.value });
			}
		}

		// Sort descending
		const entries = [...merged.entries()]
			.map(([key, { label, value }]) => ({ key, label, value }))
			.sort((a, b) => b.value - a.value);

		// Top-N truncation: keep top MAX_SLICES, rest -> "Others"
		if (entries.length > MAX_SLICES) {
			const top = entries.slice(0, MAX_SLICES - 1);
			const rest = entries.slice(MAX_SLICES - 1);
			const othersValue = rest.reduce((s, d) => s + d.value, 0);
			top.push({ key: 'others', label: 'Others', value: othersValue });
			return top;
		}

		return entries;
	});

	const totalApps = $derived(groupedPlotData.reduce((sum, item) => sum + item.value, 0));

	const centerLabel = $derived(
		groupMode === 'games' ? 'Games' : groupMode === 'apps' ? 'Apps' : storeLabel
	);

	const labeledPlotData = $derived(
		groupedPlotData.map((item, index) => ({
			...item,
			color: palette[index % palette.length],
			percentage: totalApps > 0 ? (item.value / totalApps) * 100 : 0
		}))
	);

	const formatCount = (value: number): string => {
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
		return value.toLocaleString();
	};

	const formatPercent = (value: number): string => `${value.toFixed(1)}%`;
</script>

<div class="p-1 md:p-2">
	<div class="mb-2 flex items-center gap-1.5">
		<span class="text-[10px] uppercase tracking-[0.12em] opacity-50">Show</span>
		<div class="inline-flex rounded border border-surface-300-700">
			<button
				type="button"
				class={`px-2 py-0.5 text-xs transition ${groupMode === 'all' ? 'bg-secondary-700-300 text-white' : 'hover:bg-surface-200-800'}`}
				onclick={() => (groupMode = 'all')}>All</button
			>
			<button
				type="button"
				class={`px-2 py-0.5 text-xs transition ${groupMode === 'games' ? 'bg-secondary-700-300 text-white' : 'hover:bg-surface-200-800'}`}
				onclick={() => (groupMode = 'games')}>Games</button
			>
			<button
				type="button"
				class={`px-2 py-0.5 text-xs transition ${groupMode === 'apps' ? 'bg-secondary-700-300 text-white' : 'hover:bg-surface-200-800'}`}
				onclick={() => (groupMode = 'apps')}>Apps</button
			>
		</div>
	</div>

	<PieChart
		data={labeledPlotData}
		key="key"
		value="value"
		cRange={palette}
		innerRadius={-22}
		cornerRadius={4}
		padAngle={0.03}
		padding={{ left: 80 }}
		height={plotHeightPx}
		legend={{
			orientation: 'vertical',
			placement: 'left'
		}}
	>
		{#snippet aboveMarks()}
			<Text
				value={formatCount(totalApps)}
				textAnchor="middle"
				verticalAnchor="middle"
				class="text-xl font-semibold fill-surface-50"
				dy={-4}
			/>
			<Text
				value={centerLabel}
				textAnchor="middle"
				verticalAnchor="middle"
				class="text-base"
				dy={16}
			/>
		{/snippet}

		{#snippet tooltip()}
			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>{data.label}</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="Share" value={formatPercent(data.percentage)} />
						<Tooltip.Item label="Apps" value={formatCount(data.value)} />
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</PieChart>
</div>
