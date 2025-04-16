<script lang="ts">
	import { page } from '$app/state';

	let baseUrl = '/fastest-growing-apps';

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
					{:else if values.id == 'overall'}
						<a href="/fastest-growing-apps/overall" class="text-tertiary-900-100 hover:underline">
							<SideBarCatsListBoxItem {values} {localHomeCategorySelect} />
						</a>
						<!-- {:else}
						<a href={baseUrl} class="text-tertiary-900-100 hover:underline">
							<SideBarCatsListBoxItem {values} {localHomeCategorySelect} />
						</a> -->
					{/if}
				{/if}
			{/each}
		{/if}
	</CardFirst>
</div>
