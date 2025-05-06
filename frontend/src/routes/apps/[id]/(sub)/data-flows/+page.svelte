<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import AppAPICallsTable from '$lib/AppAPICallsTable.svelte';

	import type { AppAPIsOverview } from '../../../../../types';

	let { data }: { data: AppAPIsOverview } = $props();
</script>

<div class="card preset-tonal p-2 md:p-16 mt-2 md:mt-4">
	<h4 class="h4 md:h3 p-2">API Calls</h4>
	This is a stripped down overview of the API calls recorded after installing the app for the first time
	and opening the app for 1 minute.
	{#await data.apis}
		Loading API data...
	{:then apis}
		{#if typeof apis == 'string'}
			<p>API data not yet available for this app.</p>
		{:else if apis.apis && Object.keys(apis.apis).length > 0}
			<WhiteCard>
				{#snippet title()}
					APIs
				{/snippet}
				<AppAPICallsTable data={apis.apis} />
			</WhiteCard>
		{/if}
	{/await}
</div>
