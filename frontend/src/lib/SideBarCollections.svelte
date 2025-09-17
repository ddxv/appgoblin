<script lang="ts">
	import { page } from '$app/state';
	import CardFirst from './CardFirst.svelte';
	import { homeCollectionSelection } from '../stores';
	import { homeStoreSelection } from '../stores';
	import { homeCategorySelection } from '../stores';

	const buttonSelectedClass =
		'preset-outlined-primary-900-100 text-left relative text-primary-900-100 rounded-md p-2';
	const buttonDeselectedClass =
		'p-1 md:p-2 text-tertiary-900-100 text-left hover:text-primary-900-100';

	const listClass = 'flex flex-col';

	let localHomeCollectionSelect = $state('new_weekly');
	let localHomeStoreSelect = $state('google');
	let localHomeCategorySelect = $state('overall');
	import type { CatData } from '../types';

	interface Props {
		myCatData: CatData;
	}

	let { myCatData }: Props = $props();

	let classesActive = $derived((href: string) =>
		page.url.pathname.startsWith(href) ? buttonSelectedClass : buttonDeselectedClass
	);

	let classesActiveStore = $derived((store: string) =>
		localHomeStoreSelect == store ? buttonSelectedClass : buttonDeselectedClass
	);

	let classesActiveCategory = $derived((category: string) =>
		localHomeCategorySelect == category ? buttonSelectedClass : buttonDeselectedClass
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
			<h4 class="h5 md:h4">Appstores</h4>
		{/snippet}
		<div class={listClass}>
			<button value="google" onclick={() => (localHomeStoreSelect = 'google')}>
				<p class={classesActiveStore('google')}>Google</p>
			</button>
			<button value="ios" onclick={() => (localHomeStoreSelect = 'ios')}>
				<p class={classesActiveStore('ios')}>Apple</p>
			</button>
		</div>
	</CardFirst>
</div>

<div class="p-1 md:p-2">
	<CardFirst>
		{#snippet header()}
			<h4 class="h5 md:h4">Time</h4>
		{/snippet}
		<div class={listClass}>
			<a href="/collections/new_yearly">
				<p class={classesActive('/collections/new_yearly')}>New this Year</p>
			</a>
			<a href="/collections/new_monthly">
				<p class={classesActive('/collections/new_monthly')}>New this Month</p>
			</a>
			<a href="/collections/new_weekly">
				<p class={classesActive('/collections/new_weekly')}>New this Week</p>
			</a>
		</div>
	</CardFirst>
</div>

<div class="p-1 md:p-2">
	<CardFirst>
		{#snippet header()}
			<h4 class="h5 md:h4">Appstore Categories</h4>
		{/snippet}
		<div class={listClass}>
			{#if myCatData}
				{#each Object.entries(myCatData.categories) as [_prop, values]}
					{#if values.id && values.name != 'Overview'}
						<button
							class={classesActiveCategory(values.id)}
							value={values.id}
							onclick={() => (localHomeCategorySelect = values.id)}
						>
							<!-- <p class={classesActiveCategory(values.id)}>{values.name}</p> -->
							{values.name}
						</button>
					{/if}
				{/each}
			{/if}
		</div>
	</CardFirst>
</div>
