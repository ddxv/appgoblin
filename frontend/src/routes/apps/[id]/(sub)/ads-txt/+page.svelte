<script lang="ts">
	import AdsTxtTable from '$lib/AdsTxtTable.svelte';

	let { data } = $props();
</script>

<div class="card preset-tonal p-2 md:p-16 mt-2 md:mt-4">
	{#await data.myAdsTxt}
		Loading App-Ads.txt data...
	{:then adstxt}
		{#if adstxt.direct_entries && adstxt.direct_entries.length > 0}
			<div class="card preset-tonal mt-2 md:mt-4 md:p-4">
				<h4 class="h4 md:h3 p-2 mt-2">Direct App-Ads.Txt</h4>
				<AdsTxtTable entries_table={adstxt.direct_entries} />
			</div>
		{/if}
		{#if adstxt.reseller_entries && adstxt.reseller_entries.length > 0}
			<div class="card preset-tonal mt-2 md:mt-4 md:p-4">
				<h4 class="h4 md:h3 p-2 mt-2">Reseller App-Ads.Txt Entries</h4>
				<AdsTxtTable entries_table={adstxt.reseller_entries} />
			</div>
		{/if}
	{/await}
</div>
