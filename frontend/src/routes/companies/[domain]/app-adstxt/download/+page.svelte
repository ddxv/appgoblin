<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let { data }: { data: { downloadUrl: string | null } } = $props();

	onMount(() => {
		if (data.downloadUrl) {
			window.location.href = data.downloadUrl;
		}
	});
</script>

<section class="space-y-3">
	<h2 class="text-xl font-semibold">App-ads.txt Download</h2>
	<p>Download for {page.params.domain} app-ads.txt. Download should start automatically.</p>
	{#if data.downloadUrl}
		<p>
			If it didn't start,
			<a href={data.downloadUrl} download target="_blank" rel="noopener noreferrer"
				>click here to download</a
			>.
		</p>
	{:else}
		<p>Download is not available (missing configuration).</p>
	{/if}
</section>
