<script>
	import CreativesTable from '$lib/CreativesTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<!-- Title -->
	<title>Ad Creatives - AppGoblin</title>

	<!-- Standard meta tags -->
	<meta
		name="description"
		content="Explore ad creatives, competitor analytics, and more on AppGoblin. Discover mobile advertising trends and creative strategies."
	/>
	<meta
		name="keywords"
		content="ad creatives, mobile advertising, app marketing, advertising insights, competitor analytics, AppGoblin"
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

	{#await data.creatives}
		loading...
	{:then creatives}
		<WhiteCard>
			{#if creatives && creatives.by_creative.length > 0}
				<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
					{#each creatives.by_creative.slice(0, 8) as creative}
						<img
							src="https://appgoblin-data.sgp1.digitaloceanspaces.com/creatives/thumbs/{creative.md5_hash}.jpg"
							alt=""
							onerror={(e) => (e.target.style.display = 'none')}
						/>
					{/each}
				</div>
			{:else}
				<p>No apps found</p>
			{/if}
		</WhiteCard>
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<WhiteCard>
				{#if creatives && creatives.by_publisher.length > 0}
					<CreativesTable data={creatives.by_publisher} />
				{:else}
					<p>No apps found</p>
				{/if}
			</WhiteCard>
		</div>
	{/await}
</div>
