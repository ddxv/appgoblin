<script>
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
	<link rel="canonical" href="https://appgoblin.info/apps/{data.myapp.id}/ad-creatives" />
</svelte:head>

<div class="p-2 px-2 md:p-8">
	<h1 class="text-3xl font-bold text-primary-900-100">{data.myapp.name}: Ad Creatives</h1>
	<p>
		This is an overview of the creatives that are advertising for {data.myapp.name}. Below are the
		thumbnails of the images and videos found.
	</p>

	<br />
	{#await data.creatives}
		loading...
	{:then creatives}
		<WhiteCard>
			{#if creatives && creatives.by_creative.length > 0}
				<div class="grid grid-cols-2 md:grid-cols-4 gap-2">
					{#each creatives.by_creative as creative}
						<div class="flex flex-col items-center justify-center">
							<div class="card">
								<img
									src="https://appgoblin-data.sgp1.digitaloceanspaces.com/creatives/thumbs/{creative.md5_hash}.jpg"
									alt=""
								/>
								<p>{creative.file_extension}</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p>
					No ad creatives found. This means that AppGoblin has not found any ads that this app is
					running in other apps.
				</p>
			{/if}
		</WhiteCard>
	{/await}
</div>
