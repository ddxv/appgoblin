<script lang="ts">
	import { DonutChart } from '@carbon/charts-svelte';
	import '@carbon/charts-svelte/styles.css';

	let {
		plotData,
		plotHeightPx = '300px',
		categoryPieOptions = {
			theme: 'g90',
			toolbar: { enabled: false },
			donut: {
				center: {
					label: 'Apps'
				}
			},
			height: plotHeightPx
		}
	} = $props();
</script>

<div class="p-4">
	<DonutChart data={plotData} options={categoryPieOptions} />
</div>
