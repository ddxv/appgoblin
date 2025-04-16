<script lang="ts">
	let { data } = $props();
	import FastestGrowingAppsTable from '$lib/FastestGrowingAppsTable.svelte';
</script>

<div>
	<h1 class="text-3xl text-primary-900-100">Fastest Growing Apps</h1>
	<p class="text-sm text-primary-900-100">
		AppGoblin's weekly list of the fastest growing apps on the Apple and Google Play App Stores.
	</p>
	{#await data.growthApps}
		<p>Loading...</p>
	{:then growthApps}
		<div class="card preset-tonal">
			<FastestGrowingAppsTable data={growthApps.apps} />
		</div>
	{/await}
</div>
