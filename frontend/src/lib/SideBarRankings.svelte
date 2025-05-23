<script lang="ts">
	import { page } from '$app/state';
	import CardFirst from './CardFirst.svelte';
	import { homeCollectionSelection } from '../stores';
	import { homeStoreSelection } from '../stores';
	import { homeCategorySelection } from '../stores';

	import { storeIDLookup, collectionIDLookup, categoryIDLookup } from '../stores';

	const buttonSelectedClass = 'btn preset-outlined-primary-900-100 relative text-primary-900-100';
	const buttonDeselectedClass = 'p-1 md:p-2 hover:text-primary-900-100';

	let localHomeCollectionSelect = $homeCollectionSelection;
	let localHomeStoreSelect = $state($homeStoreSelection);
	let localHomeCategorySelect = $state($homeCategorySelection);

	let country = $state(page.params.country);

	let classesActive = $derived((href: string) =>
		page.url.pathname.startsWith(href) ? buttonSelectedClass : buttonDeselectedClass
	);

	// Reactive statement to update the store when localValue changes
	$effect(() => {
		homeCollectionSelection.set(localHomeCollectionSelect);
	});
	$effect(() => {
		homeStoreSelection.set(localHomeStoreSelect);
	});
	$effect(() => {
		if (page.params.category) {
			localHomeCategorySelect = page.params.category;
		}
	});
	$effect(() => {
		homeCategorySelection.set(localHomeCategorySelect);
	});
	// For adtech
	let store = $state(1);
	$effect(() => {
		store = +page.params.store;
	});
	let collection = $state(1);
	$effect(() => {
		collection = +page.params.collection;
	});
	let category = $state(1);
	$effect(() => {
		category = +page.params.category;
	});
	// Logic to adjust collection and category based on the store's value
	$effect(() => {
		// If store is not a number (NaN), default it to 1
		if (isNaN(store)) {
			store = 1;
		}

		switch (store) {
			case 2:
				collection = 4;
				category = 120;
				break;
			case 1:
			default: // Defaults for store=1 or any other value not explicitly handled
				collection = 1;
				category = 1;
				break;
		}
	});
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
							href={`/rankings/store/${values.store_id}${
								values.store_id == 1
									? `/collection/1/category/1/${country}`
									: values.store_id == 2
										? `/collection/4/category/120/${country}`
										: '' // default value or path for other store_ids if needed
							}`}
						>
							<p class={classesActive(`/rankings/store/${values.store_id}/`)}>
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
			<h4 class="h5 md:h4">Collections</h4>
		{/snippet}
		<nav class="list-nav">
			<ul>
				{#each Object.entries(collectionIDLookup[store]) as [id, values]}
					<li>
						<a
							href={`/rankings/store/${store}/collection/${values.collection_id}/category/${category}/${country}`}
						>
							<p
								class={classesActive(
									`/rankings/store/${store}/collection/${values.collection_id}/`
								)}
							>
								{values.collection_name}
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
			<h4 class="h5 md:h4">Categories</h4>
		{/snippet}
		<nav class="list-nav">
			<ul>
				{#each Object.entries(categoryIDLookup[collection]) as [id, values]}
					<li>
						<a
							href={`/rankings/store/${store}/collection/${collection}/category/${values.category_id}/${country}`}
						>
							<p
								class={classesActive(
									`/rankings/store/${store}/collection/${collection}/category/${values.category_id}`
								)}
							>
								{values.category_name}
							</p>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</CardFirst>
</div>
