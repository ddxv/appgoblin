<script lang="ts">
	import type { Networks } from '../types';
	import type { Trackers } from '../types';
	import WhiteCard from './WhiteCard.svelte';
	import CompanyButton from './CompanyButton.svelte';
	interface Props {
		items?: Record<string, string[]> | Trackers | Networks;
	}

	let { items = {} }: Props = $props();

	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	const androidNameFont = 'text-xs md:text-sm px-8 md:px-16';
	const xmlPathFont = 'text-base px-4 md:px-8';

	// const value = $state(['club']);
</script>

<div class="max-w-sm lg:max-w-full overflow-x-scroll">
	<ul>
		<div
			class="grid grid-cols-1 md:grid-cols-{Object.keys(items).length === 1
				? '1'
				: '2'} gap-2 md:gap-4"
		>
			{#each Object.entries(items) as [key, value]}
				<li>
					<p class={xmlPathFont}>{key}</p>
					{#each Object.entries(value) as [key2, value2]}
						{#if value2.length > 1}
							<Accordion {value} multiple>
								<Accordion.Item value="club">
									<!-- Control -->
									{#snippet lead()}<ChevronDown size={14} />{/snippet}
									{#snippet control()}<p class={androidNameFont}>{key2}</p>{/snippet}
									<!-- Panel -->
									{#snippet panel()}
										{#each value2 as androidName}
											<ul>
												<li>
													<a href={`/sdks/${androidName}`} class={androidNameFont}>{androidName}</a>
												</li>
											</ul>
										{/each}
									{/snippet}
								</Accordion.Item>
							</Accordion>
						{:else}
							<ul>
								<li>
									<a href={`/sdks/${value2}`} class={androidNameFont}>{value2}</a>
								</li>
							</ul>
						{/if}
					{/each}
				</li>
			{/each}
		</div>
	</ul>
</div>
