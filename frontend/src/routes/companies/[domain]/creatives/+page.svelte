<script lang="ts">
	import type { CompanyFullDetails } from '../../../../types';
	import AdCard from '$lib/AdCard.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	interface Props {
		data: CompanyFullDetails;
	}

	let { data }: Props = $props();
</script>

<section class="mb-4 space-y-2">
	<h2 class="text-xl font-semibold">Creative Signals</h2>
	<p class="text-sm mb-3">
		Creative monitoring helps identify active campaigns, ad formats, and publisher reach connected
		to this company in near real-time market activity.
	</p>
</section>

{#if data.companyCreatives && data.companyCreatives.length > 0}
	<WhiteCard>
		{#snippet title()}
			<span
				>Recent Creatives from {data.companyTree.company_name ||
					data.companyTree.company_domain ||
					data.companyTree.queried_domain}</span
			>
		{/snippet}
		<div class="grid grid-cols-3 gap-2 p-2">
			{#each data.companyCreatives as creative}
				<div class="card p-2">
					<AdCard {creative} />
				</div>
			{/each}
		</div>
	</WhiteCard>
{:else}
	<p class="text-center p-4">No creatives found for this company.</p>
{/if}
