<script lang="ts">
	import { page } from '$app/state';

	import SideBarRankings from './SideBarRankings.svelte';
	import SideBarCollections from './SideBarCollections.svelte';
	import SideBarCompanies from './SideBarCompanies.svelte';
	import SideBarFastestGrowingApps from './SideBarFastestGrowingApps.svelte';
	import type { CatData, StoreIDLookup } from '../types';

	interface Props {
		myCatData: CatData;
		storeIDLookup: StoreIDLookup;
		collectionIDLookup: Record<number, any>;
		categoryIDLookup: Record<number, any>;
	}

	let { myCatData, storeIDLookup, collectionIDLookup, categoryIDLookup }: Props = $props();

	let store = $derived.by(() => {
		const val = +(page.params.store ?? 1);
		return isNaN(val) ? 1 : val;
	});
	let collection = $derived(store === 2 ? 4 : 1);
	let category = $derived(store === 2 ? 120 : 1);
</script>

{#if page.url.pathname.startsWith('/collections')}
	<SideBarCollections {myCatData} baseUrl="/collections" {storeIDLookup} />
{/if}

{#if page.url.pathname.startsWith('/rankings')}
	<SideBarRankings {storeIDLookup} {collectionIDLookup} {categoryIDLookup} />
{/if}

{#if (page.url.pathname == '/companies' || page.url.pathname.startsWith('/companies')) && !page.url.pathname.includes('adstxt')}
	<SideBarCompanies {myCatData} />
{/if}

{#if page.url.pathname.startsWith('/fastest-growing-apps')}
	<SideBarFastestGrowingApps {myCatData} baseUrl="/fastest-growing-apps" {storeIDLookup} />
{/if}
