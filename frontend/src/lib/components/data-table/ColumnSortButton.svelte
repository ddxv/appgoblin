<script lang="ts">
	import ChevronUp from 'lucide-svelte/icons/chevron-up';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';

	interface Props {
		columnTitle: string;
		sortDirection?: boolean | 'asc' | 'desc';
		[key: string]: any;
	}

	let { columnTitle, sortDirection = false, ...restProps }: Props = $props();

	const iconSize = 16;
</script>

<button {...restProps}>
	<span class="flex items-center gap-1">
		{columnTitle}
		{#if sortDirection === 'asc'}
			<ChevronUp size={iconSize} />
		{:else if sortDirection === 'desc'}
			<ChevronDown size={iconSize} />
		{:else}
			<ChevronsUpDown size={iconSize} />
		{/if}
	</span>
</button>
