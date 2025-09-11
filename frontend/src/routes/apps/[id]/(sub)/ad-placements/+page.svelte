<script>
	import CreativesTable from '$lib/CreativesTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
</script>

<svelte:head>
	<!-- Title -->
	<title>{data.myapp.name} Ad Creatives</title>

	<!-- Standard meta tags -->
	<meta
		name="description"
		content="Explore {data.myapp
			.name} ad creatives used to aquire new users on ad networks and their publisher apps."
	/>
	<meta
		name="keywords"
		content="{data.myapp
			.name}, ad creatives, mobile advertising, app marketing, advertising insights, competitor analytics, AppGoblin"
	/>

	<!-- Open Graph meta tags -->
	<meta property="og:title" content="{data.myapp.name} Ad Creatives - AppGoblin" />
	<meta
		property="og:description"
		content="Explore {data.myapp
			.name} ad creatives used to aquire new users on ad networks and their publisher apps."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/apps/{data.myapp.id}/ad-creatives" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{data.myapp.name} Ad Creatives - AppGoblin" />
	<meta
		name="twitter:description"
		content="Explore {data.myapp
			.name} ad creatives used to aquire new users on ad networks and their publisher apps."
	/>
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />

	<!-- Additional meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/apps/{data.myapp.id}/ad-placements" />
</svelte:head>

<div class="p-2 px-2 md:px-16 lg:px-72">
	<h1 class="text-3xl font-bold text-primary-900-100">Ad Placements for {data.myapp.name}</h1>
	<p>
		These are ad spots that were bought by {data.myapp.name}. The publishing apps are the apps that
		where the creatives for {data.myapp.name} were found.
	</p>

	<br />

	{#await data.creatives}
		loading...
	{:then creatives}
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<WhiteCard>
				{#if creatives && creatives.by_publisher.length > 0}
					<CreativesTable data={creatives.by_publisher} is_monetization={false} />
				{:else}
					<p>
						No app ad placements found. This means that AppGoblin has not found any ads that this
						app is running in other apps.
					</p>
				{/if}
			</WhiteCard>
		</div>
	{/await}
</div>
