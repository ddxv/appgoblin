<script lang="ts">
	import OpenSideBarDrawer from '$lib/utils/OpenSideBarDrawer.svelte';
	import SideBar from '$lib/SideBar.svelte';

	interface Props {
		data: any;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
	<aside class="hidden md:block">
		<div>
			<SideBar
				myCatData={data.appCats}
				storeIDLookup={data.storeIDLookup}
				collectionIDLookup={data.collectionIDLookup}
				categoryIDLookup={data.categoryIDLookup}
			/>
		</div>
	</aside>

	<main>
		{@render children?.()}
	</main>
</div>

<div class="sticky bottom-0 z-10 bg-surface-50-950 p-2">
	<div class="md:hidden p-2">
		<OpenSideBarDrawer
			myCatData={data.appCats}
			storeIDLookup={data.storeIDLookup}
			collectionIDLookup={data.collectionIDLookup}
			categoryIDLookup={data.categoryIDLookup}
		/>
	</div>
</div>
