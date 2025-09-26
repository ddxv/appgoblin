<script>
	import CreativesTable from '$lib/CreativesTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
</script>

<div class="p-2 px-2 md:px-8 lg:px-16">
	<h1 class="text-3xl font-bold text-primary-900-100">
		Monetized Ad Creatives shown by {data.myapp.name}
	</h1>
	<p>
		These are ad creatives used for monetization by {data.myapp.name}. The advertiser apps are the
		apps paid for the creatives.
	</p>

	<br />

	{#await data.creatives}
		loading...
	{:then creatives}
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<WhiteCard>
				{#if creatives && creatives.by_publisher.length > 0}
					<CreativesTable data={creatives.by_publisher} is_monetization={true} />
				{:else}
					<p>No ad monetized creatives found.</p>
				{/if}
			</WhiteCard>
		</div>
	{/await}
</div>
