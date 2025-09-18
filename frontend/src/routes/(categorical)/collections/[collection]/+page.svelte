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
	{#if typeof data.AppCollections != 'string'}
		<title>{data.AppCollections.title} App Stats & Info</title>

		<meta
			name="description"
			content="Explore newest apps in {data.AppCollections
				.title} app analytics and market trends for Google and Apple App Stores. See which apps have been released in the past week, month, year, or all time."
		/>
		<meta
			name="keywords"
			content="new apps, market reserach, new ios apps, new android apps, new app analytics, app market data, mobile app rankings, app reviews, download statistics, Google Play data, iTunes app data, app comparison, mobile app insights"
		/>
	{:else}
		<title>New Apps</title>
	{/if}
</svelte:head>

{#if typeof data.AppCollections != 'string'}
	{#each Object.entries(data.AppCollections.categories) as [_key, cat]}
		{#if cat.key == $homeCategorySelection}
			<AppsCard apps={cat[$homeStoreSelection]} />
			<p class="p-2"></p>
		{/if}
	{/each}
{:else}
	<p>Loading data failed due to internal error.</p>
{/if}
