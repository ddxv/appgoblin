<script lang="ts">
	import { goto } from '$app/navigation';
	import type { AppFullDetails } from '../../../../types';
	import RankChart from '$lib/RankChart.svelte';
	import { countryCodeToEmoji } from '$lib/utils/countryCodeToEmoji';

	interface Props {
		data: AppFullDetails;
	}
	import { page } from '$app/state';
	let { data }: Props = $props();

	let country = $state(page.url.searchParams.get('country'));
	let countryTitle = $derived(data.countries[country as keyof typeof data.countries]);

	function updateCountry(newCountry: string) {
		country = newCountry;
		const url = new URL(window.location.href);
		url.searchParams.set('country', newCountry);
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	data.myranksOverview.then((ranks) => {
		if (country == '' && ranks.countries && ranks.countries.length > 0) {
			country = ranks.countries[0];
		}
	});
</script>

<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<div>
			<h4 class="h4 md:h3 p-2">Highest Ranks Past 90 Days</h4>
			{#await data.myranksOverview}
				Loading app ranks...
			{:then ranks}
				{#if typeof ranks == 'string'}
					{ranks}
					<p>
						No official ranks available for this app. This app is not ranked on the store's top 200
						apps for it's categories.
					</p>
				{:else if ranks.best_ranks && ranks.best_ranks.length > 0}
					{#each ranks.best_ranks.slice(0, 25) as myrow}
						<div class="px-4">
							#{myrow.best_rank}
							in: {myrow.collection}
							{myrow.category}
							({countryCodeToEmoji(myrow.country)}
							{data.countries[myrow.country as keyof typeof data.countries]})
						</div>
					{/each}
					{#if ranks.best_ranks.length > 10}
						<div class="px-4 mt-2 text-surface-600">
							+ {ranks.best_ranks.length - 10} more rankings
						</div>
					{/if}
				{/if}
			{:catch}
				<p>The server caught an error.</p>
			{/await}
		</div>
		<div class="">
			<h4 class="h4 md:h3 p-2 mt-2">App Store Ranks: {countryTitle}</h4>
			{#await data.myranksOverview then ranks}
				<div class="max-w-sm">
					<p class="p-2">Breakdown App Store Ranks by Country</p>
					<select
						class="select p-1 md:p-2 m-2"
						bind:value={country}
						onchange={(e) => updateCountry(e.currentTarget.value)}
					>
						{#if typeof ranks != 'string' && ranks.countries && ranks.countries.length > 0}
							{#each ranks.countries as countryCode}
								<option value={countryCode}
									>{countryCodeToEmoji(countryCode)}
									{data.countries[countryCode as keyof typeof data.countries]}</option
								>
							{/each}
						{:else}
							{#each Object.keys(data.countries) as countryCode}
								<option value={countryCode}
									>{countryCodeToEmoji(countryCode)}
									{data.countries[countryCode as keyof typeof data.countries]}</option
								>
							{/each}
						{/if}
					</select>
				</div>
			{/await}
			{#await data.myranks}
				Loading app ranks...
			{:then ranks}
				{#if typeof ranks == 'string'}
					<p>
						No official ranks available for this app. This app is not ranked on the store's top 200
						apps for it's categories.
					</p>
				{:else if ranks.history && ranks.history.length > 0}
					<div class="card preset-tonal mt-2 md:mt-4">
						<RankChart plotData={ranks.history} narrowBool={true} />
					</div>
				{:else}
					<p>No ranking data available for this app.</p>
				{/if}
			{/await}
		</div>
	</div>
</div>
