<script lang="ts">
	import { BarChart, Chart, Svg, Axis, Bars } from 'layerchart';
	import type { AppGlobalMetrics } from '../types';
	import { scaleBand, scaleTime } from 'd3-scale';
	import { format, PeriodType } from '@layerstack/utils';

	interface Props {
		data: AppGlobalMetrics[];
	}
	let { data }: Props = $props();
	// const data = [
	// 	{ snapshot_date: new Date('2025-01-01T00:00'), installs: 30 },
	// 	{ snapshot_date: new Date('2025-02-01T00:00'), installs: 50 },
	// 	{ snapshot_date: new Date('2025-03-01T00:00'), installs: 40 },
	// 	{ snapshot_date: new Date('2025-04-01T00:00'), installs: 70 },
	// 	{ snapshot_date: new Date('2025-05-01T00:00'), installs: 60 },
	// 	{ snapshot_date: new Date('2025-06-01T00:00'), installs: 90 }
	// ];
	const renderContext = 'svg';
</script>

<h3 class="h4 md:h3 p-2">Barchart</h3>
<div class="h-[400px] p-4">
	<BarChart
		{data}
		x="snapshot_date"
		y="installs"
		props={{
			xAxis: {
				ticks: (scale) => scaleTime(scale.domain(), scale.range()).ticks()
			}
		}}
		{renderContext}
	/>
</div>

<h3 class="h4 md:h3 p-2">Chart</h3>
<div class="h-[300px] p-4">
	<Chart
		{data}
		x="snapshot_date"
		xScale={scaleBand().padding(0.4)}
		y="installs"
		yDomain={[0, null]}
		yNice={4}
		padding={{ left: 16, bottom: 24 }}
	>
		<Svg>
			<Axis placement="left" grid rule />
			<Axis
				placement="bottom"
				format={(d) => format(d, PeriodType.Day, { variant: 'short' })}
				rule
			/>
			<Bars strokeWidth={1} class="fill-primary-900-100" />
		</Svg>
	</Chart>
</div>
