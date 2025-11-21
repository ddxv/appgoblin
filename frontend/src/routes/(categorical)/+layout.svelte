<script lang="ts">
	import { Dialog, Portal } from '@skeletonlabs/skeleton-svelte';
	import SideBar from '$lib/SideBar.svelte';
	let { data, children } = $props();
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

	<div class="md:hidden sticky bottom-0 bg-surface-50-950 p-2">
		<!-- Small screen version of the side bar -->
		<Dialog>
			<Dialog.Trigger class="btn preset-filled">APP FILTERS</Dialog.Trigger>
			<Portal>
				<Dialog.Positioner class="fixed inset-0 z-50 flex justify-start">
					<Dialog.Content
						class="h-screen card bg-surface-100-900 w-sm p-4 space-y-4 shadow-xl max-w-[320px]"
					>
						<SideBar
							myCatData={data.appCats}
							storeIDLookup={data.storeIDLookup}
							collectionIDLookup={data.collectionIDLookup}
							categoryIDLookup={data.categoryIDLookup}
						/>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog>
	</div>
</div>
