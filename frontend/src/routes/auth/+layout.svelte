<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="mx-auto w-full max-w-md space-y-8 px-8">
	{@render children?.()}
</div>
