<script lang="ts">
	import { page } from '$app/state';

	function getBaseUrl(url: string, type: string) {
		const parts = url.split('/').filter(Boolean);
		let newUrl = url;

		if (type) {
			// This is working on /companies/types/[type]
			// returns current url as baseUrl

			if (parts.length == 4) {
				// This is working on /companies/types/[type]/[category]
				newUrl = `/companies/types/${parts[2]}`;
			}
		} else if (parts[0] === 'companies') {
			if (parts.length == 1) {
				// This triggers on /companies
				// console.log("newURL hardcoded");
				newUrl = '/companies/categories';
			} else if (parts.length == 2) {
				// this is not used
			} else if (parts.length == 3) {
				if (parts[2] == 'overall') {
					newUrl = `/companies/${parts[1]}`;
				} else {
					// this is working on /companies/[company]/[category]
					// this is working on /companies/categories[category]
					// console.log("newURL 3", parts.slice(2).join('/'));
					newUrl = `/companies/${parts[1]}`;
				}
			}
		}
		// console.log("newURL",newUrl);

		return newUrl;
	}

	let baseUrl = $derived(getBaseUrl(page.url.pathname.toString(), page.params.type));

	import type { CatData } from '../types';
	interface Props {
		myCatData: CatData;
	}

	let { myCatData }: Props = $props();

	import SideBarCatsListBoxItem from './SideBarCatsListBoxItem.svelte';

	import { homeCategorySelection } from '../stores';
	let localHomeCategorySelect = $state($homeCategorySelection);
	$effect(() => {
		homeCategorySelection.set(localHomeCategorySelect);
	});

	$effect(() => {
		if (page.params.category) {
			localHomeCategorySelect = page.params.category;
		} else {
			localHomeCategorySelect = 'overall';
		}
	});

	import CardFirst from './CardFirst.svelte';
</script>

<div class="p-1 md:p-2">
	<CardFirst>
		{#snippet header()}
			<h4 class="h5 md:h4">App Categories</h4>
		{/snippet}
		{#if myCatData}
			{#each Object.entries(myCatData.categories) as [_prop, values]}
				{#if values.id && (Number(values.android) > 0 || values.name == 'Games')}
					{#if values.id != 'overall'}
						<a href="{baseUrl}/{values.id}" class="text-tertiary-900-100 hover:underline">
							<SideBarCatsListBoxItem {values} {localHomeCategorySelect} />
						</a>
					{:else if baseUrl == '/companies/categories' && values.id == 'overall'}
						<a href="/companies" class="text-tertiary-900-100 hover:underline">
							<SideBarCatsListBoxItem {values} {localHomeCategorySelect} />
						</a>
					{:else}
						<a href={baseUrl} class="text-tertiary-900-100 hover:underline">
							<SideBarCatsListBoxItem {values} {localHomeCategorySelect} />
						</a>
					{/if}
				{/if}
			{/each}
		{/if}
	</CardFirst>
</div>
