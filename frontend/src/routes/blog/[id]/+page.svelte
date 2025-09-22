<script lang="ts">
	let { data } = $props();
</script>

<article class="mx-48 p-8 post">
	{@html data.contentHTML}
</article>
