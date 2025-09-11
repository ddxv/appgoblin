<script>
	import CreativesTable from '$lib/CreativesTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	let { data } = $props();
	import { page } from '$app/state';
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
	<link
		rel="canonical"
		href="https://appgoblin.info/apps/{data.myapp.id}/ad-placements/{page.params.vhash}"
	/>
</svelte:head>

<div class="p-2 px-2 md:px-16 lg:px-72">
	<h1 class="text-3xl font-bold text-primary-900-100">{data.myapp.name}: Ad Placements</h1>
	<p>
		This is an overview of the records of ad placements advertising for {data.myapp.name}. The
		publishing apps are the apps that were opened and where the creatives were found.
	</p>

	<br />

	{#await data.creativerecords}
		loading...
	{:then creativerecords}
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<WhiteCard>
				{#if creativerecords && creativerecords.by_publisher.length > 0}
					<CreativesTable data={creativerecords.by_publisher} is_monetization={false} />
				{:else}
					<p>No apps found</p>
				{/if}
			</WhiteCard>
		</div>
	{/await}
</div>
