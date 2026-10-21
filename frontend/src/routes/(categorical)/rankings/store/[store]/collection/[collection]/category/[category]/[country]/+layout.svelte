<script lang="ts">
	import MainContent from '$lib/MainContent.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<MainContent>
	{@render children?.()}
</MainContent>
