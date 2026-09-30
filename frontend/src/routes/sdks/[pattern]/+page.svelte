<script lang="ts">
	import { page } from '$app/state';
	let pattern = page.params.pattern;
	import SDKOverviewTable from '$lib/SDKOverviewTable.svelte';
	import SDKPatternCompany from '$lib/SDKPatternCompany.svelte';
	let { data } = $props();
	import WhiteCard from '$lib/WhiteCard.svelte';
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="p-2 md:p-4 space-y-4 md:space-y-6">
	<header class="px-2 md:px-4">
		<p class="text-sm uppercase tracking-wider text-surface-600-400">SDK pattern</p>
		<h1 class="text-3xl md:text-4xl font-bold break-all">{pattern}</h1>
	</header>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 px-2 md:px-4">
		<WhiteCard>
			{#snippet title()}
				Info
			{/snippet}
			<p class="p-2 md:p-4 text-sm md:text-base">
				These are apps and companies that had some part of an Android Manifest, Info.plist,
				directories or files that matched this string.
			</p>
		</WhiteCard>

		{#await data.matchedCompanies}
			loading
		{:then myMatchedCompanies}
			{#if myMatchedCompanies.companies.length > 0}
				<SDKPatternCompany matches={myMatchedCompanies.companies} />
			{:else}
				<p class="p-2 md:p-4 text-sm md:text-base">
					No companies matched this string, if you know how to match this string, please contact us
					on Discord.
				</p>
			{/if}
		{/await}
	</div>

	{#await data.matchedApps}
		loading
	{:then myMatchedApps}
		<section class="px-2 md:px-4">
			<WhiteCard>
				{#snippet title()}
					Matching Apps <span class="text-sm font-normal text-surface-600-400"
						>({myMatchedApps.apps.length})</span
					>
				{/snippet}
				{#if myMatchedApps.apps.length > 0}
					<SDKOverviewTable entries_table={myMatchedApps.apps} />
				{:else}
					<p class="p-4 text-sm md:text-base">No matching apps found.</p>
				{/if}
			</WhiteCard>
		</section>
	{/await}
</div>
