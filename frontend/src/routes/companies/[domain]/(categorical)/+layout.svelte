<script lang="ts">
	import MainContent from '$lib/MainContent.svelte';

	let { data, children } = $props();
</script>

<MainContent>
	{@render children?.()}
</MainContent>
