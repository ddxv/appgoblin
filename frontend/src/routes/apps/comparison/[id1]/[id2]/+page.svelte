<script lang="ts">
	import type { PageData } from './$types';
	import AppComparisonSlot from '$lib/AppComparisonSlot.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	$: ({
		app1,
		app2,
		history1,
		history2,
		histogram1,
		histogram2,
		sdks1,
		sdks2,
		companyTypes,
		searchResult1,
		searchResult2
	} = data);

	function handleSlot1Change(app: any) {
		// Swap app 1, keep app 2
		console.log('handleSlot1Change', app.store_id);
		goto(`/apps/comparison/${app.store_id}/${app2.store_id}`);
	}

	function handleSlot2Change(app: any) {
		// Keep app 1, swap app 2
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
		<AppComparisonSlot
			app={app2}
			history={history2}
			histogram={histogram2}
			sdks={sdks2}
			{companyTypes}
			onAppSelected={handleSlot2Change}
			slotId="2"
			searchResult={searchResult2}
		/>
	</div>
</div>
