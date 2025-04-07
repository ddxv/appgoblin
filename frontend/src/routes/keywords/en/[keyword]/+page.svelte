<script lang="ts">
	import AppRankTable from '$lib/AppRankTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
	import { page } from '$app/state';
</script>

<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
	<h1 class="text-2xl font-bold">Keyword Details for {page.params.keyword}</h1>
	<p>
		Keywords are being added April 2025. As such it may take a couple weeks to crawl all 1 million
		keywords for their rankings to populate this page. ETA for this should be end of April.
	</p>
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
				{#if keywordApps.google && keywordApps.google.ranks.length > 0}
					<AppRankTable tableData={keywordApps.google} />
				{:else}
					<p>No apps found</p>
				{/if}
			</WhiteCard>
			<WhiteCard>
				{#snippet title()}
					iOS
				{/snippet}
				{#if keywordApps.apple && keywordApps.apple.ranks.length > 0}
					<AppRankTable tableData={keywordApps.apple} />
				{:else}
					<p>No apps found</p>
				{/if}
			</WhiteCard>
		</div>
	{/await}
</div>
