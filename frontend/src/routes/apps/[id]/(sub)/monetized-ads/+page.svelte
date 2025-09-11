<script>
	import CreativesTable from '$lib/CreativesTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<!-- Title -->
	<title>{data.myapp.name} Ad Monetized Creatives</title>

	<!-- Standard meta tags -->
	<meta
		name="description"
		content="Explore the ad creatives used shown by {data.myapp
			.name} for app monetization from the mobile app ad networks they work with."
	/>
	<meta
		name="keywords"
		content="app monetization, ad creatives, mobile advertising, app marketing, advertising insights, competitor analytics, AppGoblin"
	/>

	<!-- Open Graph meta tags -->
	<meta property="og:title" content="{data.myapp.name} Ad Monetized Creatives - AppGoblin" />
	<meta
		property="og:description"
		content="Explore the ad creatives used shown by {data.myapp
			.name} for app monetization from the mobile app ad networks they work with."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/apps/{data.myapp.id}/monetized-ads" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Ad Creatives - AppGoblin" />
	<meta
		name="twitter:description"
		content="Explore ad creatives and advertising insights on AppGoblin."
	/>
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />

	<!-- Additional meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/apps/{data.myapp.id}/monetized-ads" />
</svelte:head>

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
