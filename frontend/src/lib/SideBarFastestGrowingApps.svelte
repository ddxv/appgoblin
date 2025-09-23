<script lang="ts">
	import { page } from '$app/state';

	let baseUrl = '/fastest-growing-apps';

	import { storeIDLookup } from '../stores';

	import type { CatData } from '../types';
	interface Props {
		myCatData: CatData;
	}
	let store = $state('google');

	$effect(() => {
		store = page.params.store!;
	});
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

	const buttonSelectedClass =
		'preset-outlined-primary-900-100 text-left relative text-primary-900-100 rounded-md p-2';
	const buttonDeselectedClass =
		'p-1 md:p-2 text-tertiary-900-100 text-left hover:text-primary-900-100';

	function classesActiveStore(store: string) {
		return page.params.store.toLowerCase() == store.toLowerCase()
			? buttonSelectedClass
			: buttonDeselectedClass;
	}
</script>

<div class="p-1 md:p-2">
	<CardFirst>
		{#snippet header()}
			<h4 class="h5 md:h4">Stores</h4>
		{/snippet}
		<nav class="list-nav">
			<ul>
				{#each Object.entries(storeIDLookup) as [_prop, values]}
					<li>
						<a
							href={`/fastest-growing-apps/${values.store_name.toLowerCase()}/${localHomeCategorySelect}`}
						>
							<p class={classesActiveStore(values.store_name)}>
								{values.store_name}
							</p>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</CardFirst>
</div>

<div class="p-1 md:p-2">
	<CardFirst>
		{#snippet header()}
			<h4 class="h5 md:h4">App Categories</h4>
		{/snippet}
		{#if myCatData}
			{#each Object.entries(myCatData.categories) as [_prop, values]}
				{#if values.id && (Number(values.android) > 0 || values.name == 'Games')}
					<a href="{baseUrl}/{store}/{values.id}" class="text-tertiary-900-100 hover:underline">
						<SideBarCatsListBoxItem {values} {localHomeCategorySelect} />
					</a>
				{/if}
			{/each}
		{/if}
	</CardFirst>
</div>
