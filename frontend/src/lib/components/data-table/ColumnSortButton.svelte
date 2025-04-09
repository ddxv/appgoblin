<script lang="ts">
	import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-svelte';

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
