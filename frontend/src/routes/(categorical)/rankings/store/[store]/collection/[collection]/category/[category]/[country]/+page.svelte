<script lang="ts">
	import {
		storeIDLookup,
		collectionIDLookup,
		categoryIDLookup,
		countries
	} from '../../../../../../../../../../stores.js';

	import type { StoreCategoryRanks } from '../../../../../../../../../../types.js';

	import { page } from '$app/state';
	import RankChart from '$lib/RankChart.svelte';
	import AppRankTable from '$lib/AppRankTable.svelte';
	interface Props {
		data: StoreCategoryRanks;
	}

	let { data }: Props = $props();

	let store = $derived(+page.params.store);
	let collection = $derived(+page.params.collection);
	let category = $derived(+page.params.category);

	let country = $state(page.params.country || 'US');

	const title = `Top App Rankings: Android & iOS | Free ASO Tools | AppGoblin`;
	const description = `Explore top ranking apps on Android and iOS to analyze which apps and games are at the top of the app store charts. Sort by category and view historical data all for free. Get valuable ASO insights for your app strategy with AppGoblin.`;
</script>

<svelte:head>
	<!-- Title -->
	<title>
		App Ranks {storeIDLookup[store].store_name}
		{collectionIDLookup[store][collection].collection_name} for {categoryIDLookup[collection][
			category
		].category_name} in {country}
	</title>
	<!-- Standard meta tags -->
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="app rankings, top apps, Google Play charts, iOS App Store charts, free, ASO, marketing, competitor analysis, app category rankings, app performance tracking, mobile app trends"
	/>

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />

	<!-- Additional meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<div class="card p-2 md:p-8">
	<!-- <h1 class="h4 md:h3 p-4"> -->
	<h1 class="text-2xl font-bold text-primary-900-100">
		<p>
			{storeIDLookup[store].store_name}
			{collectionIDLookup[store][collection].collection_name}
			{categoryIDLookup[collection][category].category_name}
		</p>
		<p>
			Country: {country}
		</p>
	</h1>
	<div class="card preset-tonal p-1 md:p-2">
		<div class="max-w-sm">
			<p class=" p-1 md:p-2 text-primary-900-100">Select Country</p>
			<select
				class="select p-1 md:p-2 m-2"
				bind:value={country}
				onchange={() => {
					const newUrl = `/rankings/store/${store}/collection/${collection}/category/${category}/${country}`;
					window.location.href = newUrl;
				}}
			>
				{#each Object.entries(countries) as [key, value]}
					<option value={key}>{value}</option>
				{/each}
			</select>
		</div>
		{#await data.history}
			Loading rank history...
		{:then history}
			<div class="card">
				<RankChart plotData={history.history} maxValue={10} />
			</div>
		{:catch}
			Failed to load history
		{/await}
	</div>
	<br />
	<div class="card preset-tonal p-2 md:p-4">
		{#await data.ranks}
			Loading App Ranks...
		{:then ranks}
			{#if ranks && ranks.ranks.length > 0}
				<AppRankTable data={ranks.ranks} />
			{:else}
				No data found
			{/if}
		{:catch}
			Problem loading data
		{/await}
	</div>
</div>
