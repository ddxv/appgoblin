<script lang="ts">
	import { BarChart, Tooltip } from 'layerchart';
	import { countryCodeToEmoji } from './utils/countryCodeToEmoji';

	type CountryItem = {
		country: string;
		app_count: number;
	};

	let {
		plotData,
		plotHeightPx = 250,
		storeLabel = 'Apps'
	}: {
		plotData: CountryItem[];
		plotHeightPx?: number;
		storeLabel?: string;
	} = $props();

	const palette = ['#6929C4', '#1192E8', '#005D5D', '#9F1853', '#FA4D56'];

	// Exclude the rolled-up 'Others' row from the bars themselves.
	const barData = $derived(
		((plotData ?? []) as CountryItem[])
			.filter((d) => d.country && d.country.toLowerCase() !== 'others')
			.map((d) => {
				const code = d.country || 'Unknown';
				const flag = countryCodeToEmoji(code);
				return {
					group: flag ? `${flag} ${code}` : code,
					value: d.app_count
				};
			})
			.sort((a, b) => b.value - a.value)
	);

	// Compute the share of apps that fall outside the plotted top countries.
	const othersNote = $derived.by(() => {
		const raw = (plotData ?? []) as CountryItem[];
		const total = raw.reduce((sum, d) => sum + d.app_count, 0);
		if (total <= 0) return null;
		const others = raw
			.filter((d) => d.country && d.country.toLowerCase() === 'others')
			.reduce((sum, d) => sum + d.app_count, 0);
		if (others <= 0) return null;
		const pct = (others / total) * 100;
		return `${pct.toFixed(0)}% from other countries`;
	});

	const chartHeight = $derived(plotHeightPx ?? Math.max(220, barData.length * 40 + 40));

	const formatCount = (value: number): string => {
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
		return value.toLocaleString();
	};
</script>

<div class="md:p-2">
	<BarChart
		data={barData}
		x="value"
		y="group"
		c="group"
		cRange={palette}
		bandPadding={0.22}
		orientation="horizontal"
		axis="y"
		rule={false}
		height={chartHeight}
		padding={{ top: 4, right: 6, bottom: 8, left: 4 }}
		props={{
			xAxis: { format: 'metric', ticks: 4 },
			yAxis: {
				tickLabelProps: {
					textAnchor: 'start',
					dx: 8,
					dy: 2,
					class: 'text-[11px] font-semibold fill-white stroke-none'
				},
				tickLength: 0
			}
		}}
	>
		{#snippet tooltip()}
			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>{data.group}</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="Apps" value={formatCount(data.value)} />
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</BarChart>

	{#if othersNote}
		<p class="mt-1 text-xs text-gray-600">{othersNote}</p>
	{/if}
</div>