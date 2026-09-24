<script lang="ts">
	import ManifestItemUnknownsList from '$lib/ManifestItemUnknownsList.svelte';
	import SdkVersionSummary from '$lib/SdkVersionSummary.svelte';
	let { data }: { data: any } = $props();
</script>

<div class="p-2 md:p-16 mt-2 md:mt-4">
	<h2 class="h1 md:h3 p-2">Unmapped SDKs / Unknown</h2>

	<SdkVersionSummary sdkVersionSummary={data.sdkVersionSummary} />

	{#if typeof data.myPackageInfo == 'string'}
		<p>Permissions, SDKs and trackers info not yet available for this app.</p>
	{:else}
		{#if data.myPackageInfo.leftovers && Object.keys(data.myPackageInfo.leftovers).length > 0}
			<div class="p-2 mt-4">
				<p>
					These are untagged strings found in the app. If you recognize any of these please reach
					out to have it added. Some of these may represent SDKs that are not yet mapped to a known
					company, or they may be unrelated config or obfuscated code.
				</p>
			</div>

			<ManifestItemUnknownsList items={data.myPackageInfo.leftovers} />
		{:else}
			<p>No unknown SDKs found.</p>
		{/if}
	{/if}
</div>
