<script lang="ts">
	import type { Collections } from '../../../../types';

	import AppsCard from '$lib/AppGroupCard.svelte';

	import { homeStoreSelection } from '../../../../stores';
	import { homeCategorySelection } from '../../../../stores';
	interface Props {
		/** @type {import('../[collection]/$types').PageData} */
		data: Collections;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	{#await data.AppCollections}
		<title>App Stats & Info</title>
	{:then myapps}
		{#if typeof myapps != 'string'}
			<title>{myapps.title} App Stats & Info</title>
		{:else}
			<title>App Stats & Info</title>
		{/if}
	{/await}
	<meta
		name="description"
		content="Explore app analytics and market trends across Google Play and iTunes with AppGoblin. Dive into detailed app rankings and download statistics to inform your app strategy and discover top-performing apps."
	/>
	<meta
		name="keywords"
		content="app analytics, app market data, mobile app rankings, app reviews, download statistics, Google Play data, iTunes app data, app comparison, mobile app insights"
	/>
</svelte:head>

{#await data.AppCollections}
	<div>
		<span>Loading data...</span>
	</div>
{:then myapps}
	{#if typeof myapps != 'string'}
		<!-- <h2 class="h3 md:h2 p-2">Apps: {myapps.title}</h2> -->
		{#each Object.entries(myapps.categories) as [_key, cat]}
			{#if cat.key == $homeCategorySelection}
				<AppsCard apps={cat[$homeStoreSelection]} />
				<p class="p-2"></p>
			{/if}
		{/each}
	{:else}
		<p>Loading data failed due to internal error.</p>
	{/if}
{:catch error}
	<!-- NOTE: This is currently not displaying -->
	<p style="color: red">{error.message}</p>
{/await}
