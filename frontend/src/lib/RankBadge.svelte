<script lang="ts">
	import Trophy from 'lucide-svelte/icons/trophy';
	import Award from 'lucide-svelte/icons/award';

	interface Props {
		rank: number; // 1-based
		class?: string;
		numberClass?: string;
	}

	let { rank, class: extraClass = '', numberClass = '' }: Props = $props();

	const iconClass = 'w-5 h-5 md:w-6 md:h-6';
</script>

{#if rank === 1}
	<Trophy class={`${iconClass} text-amber-400 ${extraClass}`} />
{:else if rank === 2 || rank === 3}
	<Award
		class={`${iconClass} ${rank === 2 ? 'text-surface-400' : 'text-amber-600'} ${extraClass}`}
	/>
{:else}
	<span
		class={`${numberClass || 'text-xs md:text-lg font-semibold text-surface-500-400'} ${extraClass}`}
	>
		{rank}
	</span>
{/if}
