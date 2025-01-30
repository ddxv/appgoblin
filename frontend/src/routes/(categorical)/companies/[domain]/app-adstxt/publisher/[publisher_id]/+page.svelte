<script lang="ts">
	import { page } from '$app/state';
	import CompanyPubIDTable from '$lib/CompanyPubIDTable.svelte';
	let { data } = $props();
</script>

<div>
	<h1>Publisher ID: {page.params.publisher_id}</h1>
</div>
<div>
	{#await data.publishersApps}
		<loading class="text-center">Loading...</loading>
	{:then publishersApps}
		<CompanyPubIDTable entries_table={publishersApps} />
	{/await}
</div>
