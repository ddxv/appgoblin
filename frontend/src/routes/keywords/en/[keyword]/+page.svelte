<script lang="ts">
	import AppRankTable from '$lib/AppRankTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
	import { page } from '$app/state';
</script>

<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
	<h1 class="text-2xl font-bold">Keyword Details for {page.params.keyword}</h1>
</div>

<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
	<h1 class="text-2xl font-bold">
		Top 30 Apps for <span class="text-primary-900-100">'{page.params.keyword}'</span>
	</h1>
	{#await data.keywordApps}
		loading...
	{:then keywordApps}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
			<WhiteCard>
				{#snippet title()}
					Android
				{/snippet}
				<AppRankTable tableData={keywordApps.apple} />
			</WhiteCard>
			<WhiteCard>
				{#snippet title()}
					iOS
				{/snippet}
				<AppRankTable tableData={keywordApps.google} />
			</WhiteCard>
		</div>
	{/await}
</div>
