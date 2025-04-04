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
	<meta
		name="description"
		content="Explore top-ranking apps on Google Play and iOS App Store. View monthly charts, category rankings, and historical data. Get valuable ASO insights for your app strategy with AppGoblin."
	/>
	<meta
		name="keywords"
		content="app rankings, top apps, Google Play charts, iOS App Store charts, app store optimization, ASO, app category rankings, app performance tracking, mobile app trends"
	/>

	<!-- Open Graph meta tags -->
	<meta
		property="og:title"
		content="Top-Ranking Apps on Google Play & iOS | Monthly Charts & ASO Insights"
	/>
	<meta
		property="og:description"
		content="Discover the top-performing apps across Google Play and iOS App Store. Access monthly ranking charts, category top 100 lists, and historical data to enhance your ASO strategy with AppGoblin."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="Top App Rankings: Google Play & iOS | Monthly Charts for ASO | AppGoblin"
	/>
	<meta
		name="twitter:description"
		content="Explore top-ranking apps on Google Play and iOS. View monthly charts, category top 100 lists, and historical ranking data. Optimize your ASO strategy with AppGoblin's insights."
	/>
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />

	<!-- Additional meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={page.url.href} />
</svelte:head>

<div class="card p-2 md:p-8">
	<h1 class="h4 md:h3 p-4">
		<p>
			{storeIDLookup[store].store_name}
			{collectionIDLookup[store][collection].collection_name} Apps
		</p>
		Category: {categoryIDLookup[collection][category].category_name} Country:
		{country}
	</h1>
	<div class="max-w-sm">
		<select
			class="select"
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

	{#await data.ranks}
		Loading App Ranks...
	{:then ranks}
		{#await data.history}
			Loading rank history...
		{:then history}
			<div class="card">
				<RankChart plotData={history.history} maxValue={10} />
			</div>
		{:catch}
			Failed to load history
		{/await}
		<div class="p-2 md:p-4"></div>
		<AppRankTable tableData={ranks}></AppRankTable>
	{:catch}
		Problem loading data
	{/await}
</div>

<a href="/"><p>Back to Home</p></a>
