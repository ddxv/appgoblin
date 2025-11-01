<script lang="ts">
	import { ScaleTypes, ComboChart, LineChart, type ChartTabularData } from '@carbon/charts-svelte';
	import '@carbon/charts-svelte/styles.css';

	const carbonTheme = 'g90';

	interface Props {
		plotdata: ChartTabularData;
		plotType: string;
	}

	const red = '#E53935';
	const orange = '#FB8C00';
	const yellow = '#FDD835';
	const lightgreen = '#7CB342';
	const darkgreen = '#2E7D32';

	let { plotdata, plotType }: Props = $props();

	function getMaxYValue() {
		if (plotdata && plotdata.length > 0) {
			// Group data by date and sum positive values for each date
			const dateGroups = new Map();

			plotdata.forEach((item) => {
				if (item.value > 0) {
					const date = item.snapshot_date.toString();
					if (!dateGroups.has(date)) {
						dateGroups.set(date, 0);
					}
					dateGroups.set(date, dateGroups.get(date) + item.value);
				}
			});

			// Find the maximum sum across all dates
			const dateSums = Array.from(dateGroups.values());
			return dateSums.length > 0 ? Math.max(...dateSums) : 0;
		}
		return 0;
	}

	let maxYValue = $derived(getMaxYValue());

	const changeOptions = {
		toolbar: { enabled: false },
		theme: carbonTheme,
		axes: {
			bottom: {
				title: 'Date',
				mapsTo: 'snapshot_date',
				scaleType: ScaleTypes.TIME
			},
			left: {
				title: 'Rate of Change from Previous Week',
				mapsTo: 'value',
				// percentage: true,
				ticks: {
					formatter: (x: number | Date) => `${x}%`
				},
				scaleType: ScaleTypes.LINEAR,
				correspondingDatasets: ['Rating Rate of Change']
			}
		},
		// curve: 'curveMonotoneX',
		height: '400px',
		comboChartTypes: [
			{
				type: 'grouped-bar',
				correspondingDatasets: [
					'Rating Rate of Change',
					'Installs Rate of Change',
					'Rating Count Rate of Change',
					'Review Count Rate of Change'
				]
				// 	options: {
				// 		points: {
				// 			radius: 5
				// 		}
				// 	}
			}
		]
	};
	const installOptions = {
		toolbar: { enabled: false },
		theme: carbonTheme,
		axes: {
			bottom: {
				title: 'Date',
				mapsTo: 'snapshot_date',
				scaleType: ScaleTypes.TIME
			},
			left: {
				mapsTo: 'value',
				title: 'Installs',
				scaleType: ScaleTypes.LINEAR,
				correspondingDatasets: ['Installs Daily Average']
			}
		},
		// curve: 'curveMonotoneX',
		height: '400px'
	};

	let ratings_stars_options = $derived({
		toolbar: { enabled: false },
		theme: carbonTheme,
		axes: {
			bottom: {
				title: 'Date',
				mapsTo: 'snapshot_date',
				scaleType: ScaleTypes.TIME
			},
			left: {
				mapsTo: 'value',
				title: 'Count',
				domain: [0, maxYValue],
				includeZero: true,
				scaleType: ScaleTypes.LINEAR,
				correspondingDatasets: ['One Star', 'Two Star', 'Three Star', 'Four Star', 'Five Star']
			}
		},
		// curve: 'curveMonotoneX',
		height: '400px',
		timeScale: {
			addSpaceOnEdges: 1
		},
		bars: { width: 8 },
		color: {
			pairing: {
				option: 2
			},
			scale: {
				'One Star': red,
				'Two Star': orange,
				'Three Star': yellow,
				'Four Star': lightgreen,
				'Five Star': darkgreen
			}
		},
		comboChartTypes: [
			{
				type: 'stacked-bar',
				correspondingDatasets: ['One Star', 'Two Star', 'Three Star', 'Four Star', 'Five Star'],
				options: {
					points: {
						radius: 5
					}
				}
			}
		]
	});

	let ratings_stars_new_options = $derived({
		toolbar: { enabled: false },
		theme: carbonTheme,
		axes: {
			bottom: {
				title: 'Date',
				mapsTo: 'snapshot_date',
				scaleType: ScaleTypes.TIME
			},
			left: {
				mapsTo: 'value',
				title: 'Count',
				domain: [0, maxYValue],
				scaleType: ScaleTypes.LINEAR,
				correspondingDatasets: [
					'New One Star',
					'New Two Star',
					'New Three Star',
					'New Four Star',
					'New Five Star'
				]
			}
		},
		timeScale: {
			addSpaceOnEdges: 1
		},
		bars: { width: 8 },
		height: '400px',
		color: {
			pairing: {
				option: 2
			},
			scale: {
				'New One Star': red,
				'New Two Star': orange,
				'New Three Star': yellow,
				'New Four Star': lightgreen,
				'New Five Star': darkgreen
			}
		},
		comboChartTypes: [
			{
				type: 'stacked-bar',
				correspondingDatasets: [
					'New One Star',
					'New Two Star',
					'New Three Star',
					'New Four Star',
					'New Five Star'
				],
				options: {
					points: {
						radius: 5
					}
				}
			}
		]
	});
	const numberOptions = {
		toolbar: { enabled: false },
		theme: carbonTheme,
		axes: {
			bottom: {
				title: 'Date',
				mapsTo: 'snapshot_date',
				scaleType: ScaleTypes.TIME
			},
			left: {
				mapsTo: 'value',
				title: 'Count',
				scaleType: ScaleTypes.LINEAR,
				correspondingDatasets: [
					'Installs Daily Average',
					'Rating Count Daily Average',
					'One Star',
					'Two Star',
					'Three Star',
					'Four Star',
					'Five Star',
					'New One Star',
					'New Two Star',
					'New Three Star',
					'New Four Star',
					'New Five Star'
				]
			}
		},
		// curve: 'curveMonotoneX',
		height: '400px',
		comboChartTypes: [
			{
				type: 'stacked-bar',
				correspondingDatasets: [
					'Installs Daily Average',
					'Rating Count Daily Average',
					'Review Count Daily Average',
					'One Star',
					'Two Star',
					'Three Star',
					'Four Star',
					'Five Star',
					'New One Star',
					'New Two Star',
					'New Three Star',
					'New Four Star',
					'New Five Star'
				],
				options: {
					points: {
						radius: 5
					}
				}
			}
		]
	};
</script>

{#if plotType == 'change'}
	<ComboChart data={plotdata} options={changeOptions} />
{:else if plotType == 'number'}
	<ComboChart data={plotdata} options={numberOptions} />
{:else if plotType == 'installs'}
	<LineChart data={plotdata} options={installOptions} />
{:else if plotType == 'ratings'}
	<ComboChart data={plotdata} options={numberOptions} />
{:else if plotType == 'ratings_stars'}
	<ComboChart data={plotdata} options={ratings_stars_options} />
{:else if plotType == 'ratings_stars_new'}
	<ComboChart data={plotdata} options={ratings_stars_new_options} />
{/if}
