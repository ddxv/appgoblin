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
</svelte:head>

<div class="p-2 px-2 md:px-16 lg:px-32">
	<h1 class="text-3xl text-primary-900-100">{data.newApps.title}</h1>
	<p class="text-sm text-primary-900-100">
		AppGoblin's {data.newApps.title} list of the fastest growing apps on the Apple and Google Play App
		Stores.
	</p>
	<div class="card preset-tonal">
		<AppsCard apps={data.newApps} />
	</div>
</div>
