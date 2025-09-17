<script lang="ts">
	import {
		storeIDLookup,
		collectionIDLookup,
		categoryIDLookup
	} from '../../../../../../../../../../stores.js';

	import type { StoreCategoryRanks } from '../../../../../../../../../../types.js';

	import { page } from '$app/state';
	import RankChart from '$lib/RankChart.svelte';
	import AppRankTable from '$lib/AppRankTable.svelte';
	import AppCard from '$lib/AppCard.svelte';
	import { countryCodeToEmoji } from '$lib/utils/countryCodeToEmoji';
	interface Props {
		data: StoreCategoryRanks;
	}

	let { data }: Props = $props();

	let store = $derived(+page.params.store!);
	let collection = $derived(+page.params.collection!);
	let category = $derived(+page.params.category!);

	let country = $state(page.params.country || 'US');

	function getTitle(): string {
		const title =
			storeIDLookup[store].store_name +
			' ' +
			'Daily App Ranks ' +
			collectionIDLookup[store][collection].collection_name +
			' for ' +
			categoryIDLookup[collection][category].category_name +
			' in ' +
			country +
			' ';
		return title;
	}

	function getDescription(): string {
		const description =
			'Free app store charts. Top ranked ' +
			storeIDLookup[store].store_name +
			' ' +
			collectionIDLookup[store][collection].collection_name +
			' ' +
			categoryIDLookup[collection][category].category_name +
			' Apps. Sort by category and view historical data all for free. Get valuable ASO insights for your app strategy with AppGoblin.';
		return description;
	}
	const title = $derived(getTitle());
	const description = $derived(getDescription());
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="free, free aso, {storeIDLookup[store].store_name}, {collectionIDLookup[store][
			collection
		].collection_name}, {categoryIDLookup[collection][category]
			.category_name}, app rankings, top apps, Google Play charts, iOS App Store charts, free, ASO, marketing, competitor analysis, app category rankings, app performance tracking, mobile app trends"
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
	<h1 class="text-2xl grid grid-cols-4 gap-2">
		<p class="text-primary-800-200">App Store:</p>
		<p class="text-primary-800-200">Collection:</p>
		<p class="text-primary-800-200">Category:</p>
		<p class="text-primary-800-200">Country:</p>

		<p class="text-primary-900-100">
			{storeIDLookup[store].store_name}
		</p>
		<p class="text-primary-900-100">{collectionIDLookup[store][collection].collection_name}</p>
		<p class="text-primary-900-100">
			{categoryIDLookup[collection][category].category_name}
		</p>
		<p class="text-primary-900-100">
			{country}
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
				{#each Object.entries(data.countries) as [key, value]}
					<option value={key}>{countryCodeToEmoji(key)} {value}</option>
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
	<div class="card preset-tonal p-2 md:mx-16">
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
