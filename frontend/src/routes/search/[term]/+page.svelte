<script lang="ts">
	import { page } from '$app/state';
	import type { SearchResponse } from '../../../types';
	import AppGroupCard from '$lib/AppGroupCard.svelte';

	import CompaniesOverviewTable from '$lib/CompaniesOverviewTable.svelte';

	interface Props {
		data: SearchResponse;
	}

	let { data }: Props = $props();
	let searchTerm: string | null = $state(page.params.term || '');
</script>

<h1 class="h1">Search Results for {searchTerm}</h1>

<div class="p-4">
	{#await data.companiesResults}
		Loading ...
	{:then companiesResults}
		{#if typeof companiesResults != 'string'}
			<h2 class="h2 p-4">Companies</h2>
			{#if companiesResults.length > 0}
				<CompaniesOverviewTable data={companiesResults} />
			{:else}
				<p class="p-4">
					No adtech/business/ development tool companies found, if you expected to see something
					please let us know by sending a note on Discord or GitHub and we can add it.
				</p>
			{/if}
		{:else}
			<p>Search failed please try again ...</p>
		{/if}
	{:catch error}
		<p>Search failed please try again ... {error.message}</p>
	{/await}
</div>

<hr />

<div class="p-4">
	{#await data.results}
		Loading ...
	{:then results}
		{#if typeof results != 'string'}
			{#if results.apps.length > 0}
				<AppGroupCard apps={results} />

				<div class="card p-4 mt-4">
					<h3 class="h3">Didn't see what you're looking for?</h3>
					<p class="p-2">
						This search will also crawl the top 200 apps on Google Play and App Store and update
						AppGoblin over the next day. You can also reach out on Discord or GitHub if you have
						questions or need any support.
					</p>
				</div>
			{:else}
				<h2 class="h2 p-4">Apps</h2>
				<h3 class="h3">
					No apps found, but a search for {searchTerm} has been queued and full data from app store,
					if it exists, should be available in the coming days. Please feel free to reach out on GitHub
					or Discord if you have any questions.
				</h3>
			{/if}
		{:else}
			<p>Search failed please try again ... {results}</p>
		{/if}
	{:catch error}
		<p>Search failed please try again ... {error.message}</p>
	{/await}
</div>
