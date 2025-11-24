<script lang="ts">
	import type { AppGlobalMetrics } from '../../../../../types';
	import AppMetricPlot from '$lib/AppMetricPlot.svelte';
	interface Props {
		data: { appGlobalMetrics: AppGlobalMetrics[] };
	}
	let { data }: Props = $props();
</script>

<div class="mx-auto max-w-7xl space-y-4">
	{#await data.appGlobalMetrics}
		Loading historical data...
	{:then histdata}
		<AppMetricPlot data={histdata} />
	{/await}
</div>
