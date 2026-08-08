	<script lang="ts">
		import ManifestItemUnknownsList from '$lib/ManifestItemUnknownsList.svelte';
		let { data }: { data: any } = $props();
	</script>

	<div class="p-2 md:p-16 mt-2 md:mt-4">
		<h2 class="h1 md:h3 p-2">Unmapped SDKs / Unknown</h2>

		{#if typeof data.myPackageInfo == 'string'}
			<p>Permissions, SDKs and trackers info not yet available for this app.</p>
		{:else}
			{#if data.myPackageInfo.leftovers && Object.keys(data.myPackageInfo.leftovers).length > 0}
				<div class="p-2">
					<p>If you recognize any of these please reach out to have it added.</p>
				</div>
				<ManifestItemUnknownsList items={data.myPackageInfo.leftovers} />
			{:else}
				<p>No unknown SDKs found.</p>
			{/if}
		{/if}
	</div>
