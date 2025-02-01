<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import type { UnknownSDKs } from '../types';
	import WhiteCard from './WhiteCard.svelte';
	interface Props {
		items: UnknownSDKs;
	}

	let { items = {} }: Props = $props();

	const androidNameFont = 'text-xs md:text-sm px-8 md:px-16';
	// const xmlPathFont = 'text-base px-4 md:px-8';

	let accordionValue = $state(['allclosed']);
</script>

<div class="max-w-sm lg:max-w-full overflow-x-scroll">
	<ul>
		<div
			class="grid grid-cols-1 md:grid-cols-{Object.keys(items).length === 1
				? '1'
				: '2'} gap-2 md:gap-4"
		>
			<!-- {"bytedance.com": {"application/acitivity":["com.bytedance.sdk.analytics"]}} -->
			{#each Object.entries(items) as [sdkShort, sdkShortValue]}
				<li>
					<Accordion value={accordionValue} multiple>
						<Accordion.Item value="club">
							<!-- Control -->
							{#snippet control()}<p class={androidNameFont}>{sdkShort}</p>{/snippet}
							<!-- Panel -->
							{#snippet panel()}
								{#each Object.entries(sdkShortValue) as [xmlPath, sdkParts]}
									{#each sdkParts as androidName}
										<ul>
											<li>
												{xmlPath}:<a href={`/sdks/${androidName}`} class={androidNameFont}
													>{androidName}</a
												>
											</li>
										</ul>
									{/each}
								{/each}
							{/snippet}
						</Accordion.Item>
					</Accordion>
				</li>
			{/each}
		</div>
	</ul>
</div>
