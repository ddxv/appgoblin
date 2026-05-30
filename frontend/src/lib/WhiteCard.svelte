<script lang="ts">
	import type { Snippet } from 'svelte';
	let { title, children }: { title?: Snippet; children: Snippet } = $props();
</script>

<section class="rounded-lg preset-outlined-surface-100-900 overflow-hidden">
	{#if title}
		<header class="card-header bg-surface-100-900 md:p-2">
			<h3 class="text-large md:text-2xl">
				{@render title?.()}
			</h3>
		</header>
	{/if}
	<div class="card-content">
		{@render children()}
	</div>
</section>
