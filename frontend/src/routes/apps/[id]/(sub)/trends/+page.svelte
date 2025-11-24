<script lang="ts">
	import type { AppGlobalMetrics, AppCountryMetrics } from '../../../../../types';
	import AppTrendsDashboard from '$lib/AppTrendsDash.svelte';

	interface Props {
		data: { appMetrics: AppGlobalMetrics[] | AppCountryMetrics[]; isIOS: boolean };
	}
	let { data }: Props = $props();
</script>

<div class="mx-auto max-w-7xl space-y-4">
	{#if data.appMetrics && data.appMetrics.length > 0}
		<AppTrendsDashboard data={data.appMetrics} isIOS={data.isIOS} />
	{:else}
		<div class="flex h-64 items-center justify-center">
			<div class="text-lg text-gray-500">No historical data found.</div>
		</div>
	{/if}
</div>
