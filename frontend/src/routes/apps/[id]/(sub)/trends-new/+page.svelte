<script lang="ts">
	import type { AppGlobalMetrics } from '../../../../../types';
	import AppTrendsDashboard from '$lib/AppTrendsDash.svelte';

	interface Props {
		data: { appGlobalMetrics: AppGlobalMetrics[] };
	}
	let { data }: Props = $props();
</script>

<div class="mx-auto max-w-7xl space-y-4">
	{#await data.appGlobalMetrics}
		<div class="flex h-64 items-center justify-center">
			<div class="text-lg text-gray-500">Loading historical data...</div>
		</div>
	{:then histdata}
		<AppTrendsDashboard data={histdata} isIOS={data.isIOS} />
	{/await}
</div>
