<script lang="ts">
	let { data } = $props();
	import FastestGrowingAppsTable from '$lib/FastestGrowingAppsTable.svelte';
</script>

<div>
	<h1>Fastest Growing Apps</h1>
	<p>This is the fastest growing apps page</p>
	{#await data.growthApps}
		<p>Loading...</p>
	{:then growthApps}
		<div>
			<FastestGrowingAppsTable data={growthApps.apps} />
		</div>
	{/await}
</div>
