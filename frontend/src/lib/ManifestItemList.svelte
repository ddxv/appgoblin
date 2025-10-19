<script lang="ts">
	import type { CompanySDKParts } from '../types';
	import WhiteCard from './WhiteCard.svelte';
	import CompanyButton from './CompanyButton.svelte';
	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		items: CompanySDKParts;
	}

	let { items = {} }: Props = $props();

	const androidNameFont = 'text-xs md:text-sm px-8 md:px-16';
	const xmlPathFont = 'text-base px-4 md:px-8';

	let accordionValue = $state(['allclosed']);
</script>

<div class="">
	<ul>
		<div
			class="grid grid-cols-1 md:grid-cols-{Object.keys(items).length === 1
				? '1'
				: '2'} gap-2 md:gap-4"
		>
			<!-- {"bytedance.com": {"com.bytedance.sdk": {"application/acitivity":["com.bytedance.sdk.analytics"]}}} -->

			{#each Object.entries(items) as [companyDomain, companyObj]}
				<!-- For trackers and networks -->
				<WhiteCard>
					{#snippet title()}
						<div class="text-lg text-bold p-2">
							<CompanyButton companyName={companyDomain} {companyDomain} />
						</div>
					{/snippet}
					{#each Object.entries(companyObj) as [sdkShort, sdkShortObj]}
						<Accordion
							value={accordionValue}
							onValueChange={(e) => (accordionValue = e.value)}
							multiple
						>
							<Accordion.Item value={sdkShort}>
								<!-- Control -->
								{#snippet control()}<p class={androidNameFont}>{sdkShort}</p>{/snippet}
								<!-- Panel -->
								{#snippet panel()}
									<li>
										<!-- <p class={xmlPathFont}>{sdkShort}</p> -->
										<ul>
											{#each Object.entries(sdkShortObj) as [xmlPath, androidNames]}
												{#each androidNames as androidName}
													<li>
														{xmlPath}:<a
															href={`/sdks/${androidName}`}
															class={androidNameFont}
															rel="nofollow">{androidName}</a
														>
													</li>
												{/each}
											{/each}
										</ul>
									</li>
								{/snippet}
							</Accordion.Item>
						</Accordion>
					{/each}
				</WhiteCard>
			{/each}
		</div>
	</ul>
</div>
