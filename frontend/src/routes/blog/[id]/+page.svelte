<script lang="ts">
	let { data } = $props();
</script>

<article class="prose prose-lg mx-auto p-4">
	{@html data.contentHTML}
</article>
