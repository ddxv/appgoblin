<script lang="ts">
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';

	import { plotColors } from '../stores';

	let myInterval;
	let topPadding;
	let rightPadding;

	interface Props {
		plotData: any;
		maxValue?: number | undefined;
		narrowBool?: boolean;
	}

	let { plotData, maxValue = undefined, narrowBool = false }: Props = $props();

	const dimensions = ['crawled_date'];

	if (maxValue && maxValue <= 10) {
		myInterval = 1;
	} else {
		myInterval = undefined;
	}

	const defaultSeries: echarts.SeriesOption = {
		type: 'line',
		symbolSize: 20,
		smooth: true,
		emphasis: {
			focus: 'series'
		},
		lineStyle: {
			width: 4
		}
	};

	function makeSeries(plotData: Object[]) {
		const numberOfSeries = Object.keys(plotData[plotData.length - 1]).length - 1;
		const myArray = [];
		for (let i = 0; i < numberOfSeries; i++) {
			myArray.push(defaultSeries);
		}
		return myArray;
	}

	const plotSeries = makeSeries(plotData);

	let myChartDiv: HTMLDivElement;
	let myChart: echarts.ECharts;
	if (narrowBool) {
		// Legend at top!
		topPadding = 40;
		rightPadding = 20;
	} else {
		// No Legend at top, at right
		topPadding = 20;
		rightPadding = 55;
	}

	let gridoption: echarts.GridComponentOption = {
		left: 50,
		top: topPadding,
		right: rightPadding,
		bottom: 40
		// containLabel: true
	};

	let chartoption: echarts.EChartsOption = $state({
		color: plotColors,
		dataset: { source: plotData },
		dimensions: dimensions,
		grid: gridoption,
		tooltip: {
			trigger: 'item'
		},
		xAxis: {
			type: 'category',
			splitLine: {
				show: true
			},
			axisLabel: {
				margin: 10,
				fontSize: 18
			}
			// boundaryGap: false,
			//data: myX
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				margin: 10,
				fontSize: 22,
				formatter: '#{value}'
			},
			inverse: true,
			min: 1,
			interval: myInterval,
			max: maxValue
		},
		series: plotSeries
	});

	if (narrowBool) {
		// Legend at top!
		chartoption['legend'] = {};
	} else {
		// No Legend at top, at right
		defaultSeries['endLabel'] = {
			show: true,
			formatter: '{a}',
			distance: 20,
			valueAnimation: true
		};
	}

	onMount(() => {
		myChart = echarts.init(myChartDiv, 'dark');

		const myInterval = maxValue && maxValue <= 10 ? 1 : undefined;

		const chartOption: echarts.EChartsOption = {
			color: plotColors,
			dataset: { source: plotData },
			dimensions: ['crawled_date'],
			grid: { left: 50, top: topPadding, right: rightPadding, bottom: 40 },
			tooltip: { trigger: 'item' },
			xAxis: {
				type: 'category',
				splitLine: { show: true },
				axisLabel: { margin: 10, fontSize: 18 }
			},
			yAxis: {
				type: 'value',
				axisLabel: { margin: 10, fontSize: 22, formatter: '#{value}' },
				inverse: true,
				min: 1,
				interval: myInterval,
				max: maxValue
			},
			series: plotSeries,
			legend: narrowBool ? {} : undefined
		};

		myChart.setOption(chartOption);

		const resizeFn = () => myChart.resize();
		window.addEventListener('resize', resizeFn);

		return () => {
			window.removeEventListener('resize', resizeFn);
			myChart.dispose();
		};
	});
</script>

<div class="w-full h-96" bind:this={myChartDiv}></div>
