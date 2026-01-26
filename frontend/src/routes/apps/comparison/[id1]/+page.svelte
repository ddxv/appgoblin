<script lang="ts">
	import AppComparisonSlot from '$lib/AppComparisonSlot.svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ app1, history1, histogram1, sdks1, companyTypes, searchResult1, searchResult2 } = data);

	function handleSlot1Change(app: any) {
		// Replace app1
		console.log('Slot 1 selected:', app);
		if (!app.store_id) {
			console.error('Missing store_id in selected app:', app);
			alert('Error: Selected app does not have a store ID. Please check console.');
			return;
		}
		goto(`/apps/comparison/${app.store_id}`);
	}

	function handleSlot2Change(app: any) {
		// Add app2
		goto(`/apps/comparison/${app1.store_id}/${app.store_id}`);
	}
</script>

<div class="container mx-auto space-y-4 p-1 md:p-4">
	<h1 class="mb-4 text-xl md:text-3xl font-bold">App Comparison</h1>

	<div class="grid grid-cols-2 gap-1 md:gap-8">
		<!-- SLOT 1 -->
		<AppComparisonSlot
			app={app1}
			history={history1}
			histogram={histogram1}
			sdks={sdks1}
			{companyTypes}
			onAppSelected={handleSlot1Change}
			slotId="1"
			searchResult={searchResult1}
		/>

		<!-- SLOT 2 -->
		<AppComparisonSlot onAppSelected={handleSlot2Change} slotId="2" searchResult={searchResult2} />
	</div>
</div>
