<script lang="ts">
	import type { CompanyFullDetails } from '../../../../types';
	import MediationAdaptersTable from '$lib/MediationAdaptersTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	interface Props {
		data: CompanyFullDetails;
	}

	let { data }: Props = $props();
</script>

<section class="mb-4 space-y-2">
	<h2 class="text-xl font-semibold">Mediation Adapters</h2>
	<p class="text-sm mb-3">
		Mediation adapters reveal monetization connectivity between ad networks and apps. Use this table
		to assess adapter breadth, potential demand paths, and stack overlap with competitors.
	</p>
</section>

{#if data.companyDetails && data.companyDetails.mediation_adapters}
	<WhiteCard>
		{#snippet title()}
			<span
				>{data.companyTree.company_name ||
					data.companyTree.company_domain ||
					data.companyTree.queried_domain}'s Mediation Adapters</span
			>
		{/snippet}
		<MediationAdaptersTable adapters={data.companyDetails.mediation_adapters} />
	</WhiteCard>
{:else}
	<p class="text-center p-4">No mediation adapters found for this company.</p>
{/if}
