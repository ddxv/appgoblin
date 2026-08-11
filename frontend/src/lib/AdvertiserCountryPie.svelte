<script lang="ts">
	import { PieChart, Text, Tooltip } from 'layerchart';

	type CountryItem = {
		country_code: string;
		advertiser_count: number;
	};

	let {
		plotData,
		plotHeightPx = 250
	}: {
		plotData: CountryItem[];
		plotHeightPx?: number;
	} = $props();

	const palette = [
		'#6929C4',
		'#1192E8',
		'#005D5D',
		'#9F1853',
		'#FA4D56',
		'#FF832B',
		'#198038',
		'#002D9C',
		'#EE5396',
		'#8A3FFC'
	];
	const MAX_SLICES = 10;

	const groupedPlotData = $derived.by(() => {
		const raw = (plotData ?? []) as CountryItem[];
		if (raw.length === 0) return [];

		const entries = raw
			.map((d) => {
				const code = d.country_code || 'Unknown';
				return {
					key: code,
					label: code === 'Unknown' ? code : `${countryFlag(code)} ${code}`,
					value: d.advertiser_count
				};
			})
			.sort((a, b) => b.value - a.value);

		if (entries.length > MAX_SLICES) {
			const top = entries.slice(0, MAX_SLICES - 1);
			const rest = entries.slice(MAX_SLICES - 1);
			const othersValue = rest.reduce((s, d) => s + d.value, 0);
			top.push({ key: 'others', label: 'Others', value: othersValue });
			return top;
		}

		return entries;
	});

	const totalAdvertisers = $derived(groupedPlotData.reduce((sum, item) => sum + item.value, 0));

	const labeledPlotData = $derived(
		groupedPlotData.map((item, index) => ({
			...item,
			color: palette[index % palette.length],
			percentage: totalAdvertisers > 0 ? (item.value / totalAdvertisers) * 100 : 0
		}))
	);

	const formatCount = (value: number): string => {
		if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
		if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
		return value.toLocaleString();
	};

	const formatPercent = (value: number): string => `${value.toFixed(1)}%`;

	function countryFlag(code: string): string {
		if (!code || code === 'Others') return '';
		return code
			.toUpperCase()
			.split('')
			.map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
			.join('');
	}
</script>

<div class="p-1 md:p-2">
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
				value={formatCount(totalAdvertisers)}
				textAnchor="middle"
				verticalAnchor="middle"
				class="text-xl font-semibold fill-surface-50"
				dy={-4}
			/>
			<Text
				value="Advertisers"
				textAnchor="middle"
				verticalAnchor="middle"
				class="text-base"
				dy={16}
			/>
		{/snippet}

		{#snippet tooltip()}
			<Tooltip.Root>
				{#snippet children({ data })}
					<Tooltip.Header>
						{data.label === 'Others' ? 'Others' : `${countryFlag(data.label)} ${data.label}`}
					</Tooltip.Header>
					<Tooltip.List>
						<Tooltip.Item label="Share" value={formatPercent(data.percentage)} />
						<Tooltip.Item label="Advertisers" value={formatCount(data.value)} />
					</Tooltip.List>
				{/snippet}
			</Tooltip.Root>
		{/snippet}
	</PieChart>
</div>
