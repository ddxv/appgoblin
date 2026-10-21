<script lang="ts">
	import AppsCard from '$lib/AppGroupCard.svelte';
	import { page } from '$app/state';

	let { data } = $props();
</script>

<svelte:head>
	<link rel="canonical" href={page.url.href} />

	<title>{data.newApps.title} App Stats & Info</title>

	<meta
		name="description"
		content="Explore newest apps in {data.newApps
			.title} app analytics and market trends for Google and Apple App Stores. See which apps have been released in the past week, month, year, or all time."
	/>
	<meta
		name="keywords"
		content="new apps, market reserach, new ios apps, new android apps, new app analytics, app market data, mobile app rankings, app reviews, download statistics, Google Play data, Apple iTunes app data, app comparison, mobile app insights"
	/>
	<meta name="robots" content="index, follow" />
	<meta property="og:title" content="{data.newApps.title} App Stats & Info" />
	<meta
		property="og:description"
		content="Explore newest apps in {data.newApps
			.title} with AppGoblin — app analytics and market trends for Google and Apple App Stores."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{data.newApps.title} App Stats & Info" />
	<meta
		name="twitter:description"
		content="Explore newest apps in {data.newApps.title} with AppGoblin."
	/>
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
</svelte:head>

<div class="p-2 px-2 md:px-16 lg:px-32">
	<h1 class="text-3xl">{data.newApps.title}</h1>
	<p class="text-sm">
		AppGoblin's {data.newApps.title} list of the fastest growing apps on the Apple and Google Play App
		Stores.
	</p>
	<div class="preset-filled-surface-100-900">
		<AppsCard apps={data.newApps} />
	</div>
</div>
