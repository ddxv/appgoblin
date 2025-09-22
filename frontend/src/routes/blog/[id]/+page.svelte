<script lang="ts">
	let { data } = $props();
</script>

<!-- <article class="prose prose-lg mx-auto p-4 post"> -->
<article class="mx-48 p-8 post">
	{@html data.contentHTML}
</article>

<!-- <style>
	.post :global {
		h2 {
			@apply !h2;
		}
	}
</style> -->
