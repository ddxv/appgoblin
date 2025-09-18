<script>
	import AdvertiserCreativeRankingsTable from '$lib/AdvertiserCreativeRankingsTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<!-- Title -->
	<title>Ad Creatives - AppGoblin</title>

	<!-- Standard meta tags -->
	<meta
		name="description"
		content="Explore ad creatives and monetized ads on AppGoblin. See the top mobile ad buyers this month and their creative strategies."
	/>
	<meta
		name="keywords"
		content="ad creatives, mobile advertising, app marketing, advertising insights, AppGoblin"
	/>

	<!-- Open Graph meta tags -->
	<meta property="og:title" content="Ad Creatives - AppGoblin" />
	<meta
		property="og:description"
		content="Explore ad creatives and advertising insights on AppGoblin."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/ad-creatives" />
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
	<link rel="canonical" href="https://appgoblin.info/ad-creatives" />
</svelte:head>

<div class="p-2 px-2 md:px-16 lg:px-32">
	<h1 class="text-3xl font-bold text-primary-900-100">Top Mobile Ad Buyers & Their Ad Creatives</h1>

	<br />

	<div class="p-4">
		<p>
			These are top mobile ad buyers (advertisers) from this month. The top advertisers and their
			creatives are based on actual ads seen in publishing apps in the past month.
		</p>
	</div>

	<WhiteCard>
		{#if data.creatives && data.creatives.length > 0}
			<AdvertiserCreativeRankingsTable data={data.creatives} />
		{:else}
			<p>No apps found</p>
		{/if}
	</WhiteCard>
</div>
