<script lang="ts">
	import IconiOs from './svg/IconiOS.svelte';
	import IconGoogle from './svg/IconGoogle.svelte';

	let { store }: { store: string } = $props();
</script>

<div>
	{#if store.startsWith('Google')}
		<IconGoogle size="16" />
	{:else}
		<IconiOs size="16" />
	{/if}
</div>
