<script lang="ts">
	import type { CompanyFullDetails } from '../../../../types';
	import AdCard from '$lib/AdCard.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	interface Props {
		data: CompanyFullDetails;
	}

	let { data }: Props = $props();
</script>

<p class="text-sm text-surface-600-400 mb-3">
	Creative monitoring helps identify active campaigns, ad formats, and publisher reach connected to
	this company in near real-time market activity.
</p>

{#if data.companyCreatives && data.companyCreatives.length > 0}
	<WhiteCard>
		{#snippet title()}
			<span>Recent Creatives from {data.companyTree.queried_company_name}</span>
		{/snippet}
		<div class="grid grid-cols-3 gap-2 p-2">
			{#each data.companyCreatives as creative}
				<div class="card bg-surface-100-900 p-2">
					<AdCard {creative} />
				</div>
			{/each}
		</div>
	</WhiteCard>
{:else}
	<p class="text-center p-4">No creatives found for this company.</p>
{/if}
