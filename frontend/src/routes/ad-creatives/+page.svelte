<script>
	import { page } from '$app/state';
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
		content="Explore ad creatives and advertising insights on AppGoblin. Discover mobile advertising trends and creative strategies."
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

<div class="p-2 px-8 md:px-32 lg:px-72">
	<h1 class="text-3xl font-bold text-primary-900-100">Ad Creatives</h1>

	<br />

	<div class="card preset-filled-surface-100-900 p-2 md:p-8">
		<h2 class="h2 p-2 md:p-4">Coming Soon</h2>
		<div class="p-4">
			<p>
				This page is under development. We're working on bringing you comprehensive ad creative
				insights and analytics.
			</p>
		</div>
	</div>

	<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
		<h1 class="text-2xl font-bold">Ad Creatives</h1>
		{#await data.creatives}
			loading...
		{:then creatives}
			<WhiteCard>
				{#if creatives && creatives.length > 0}
					<AdvertiserCreativeRankingsTable data={creatives} />
				{:else}
					<p>No apps found</p>
				{/if}
			</WhiteCard>
		{/await}
	</div>
</div>
