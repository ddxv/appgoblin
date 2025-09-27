<script lang="ts">
	import WhiteCard from './WhiteCard.svelte';
	import CompanyOverviewTable from './CompanyOverviewTable.svelte';
	import { formatNumberLocale } from '$lib/utils/formatNumber';

	let { detailsData, tableData, category, isSecondaryDomain = false } = $props();
</script>

<div class="grid grid-cols-1">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<WhiteCard>
			{#snippet title()}
				Android Top Apps
			{/snippet}
			{#if tableData.android.apps && tableData.android.apps.length > 0}
				<CompanyOverviewTable data={tableData.android.apps} isiOS={false} />
			{:else}
				<p class="text-sm md:text-lg mb-2">No Android apps found for this company.</p>
			{/if}
		</WhiteCard>
		{#if !isSecondaryDomain}
			<WhiteCard>
				{#snippet title()}
					iOS Top Apps
				{/snippet}
				{#if tableData.ios.apps && tableData.ios.apps.length > 0}
					<CompanyOverviewTable data={tableData.ios.apps} isiOS={true} />
				{:else}
					<p class="text-sm md:text-lg mb-2">No iOS apps found for this company.</p>
				{/if}
			</WhiteCard>
		{/if}
	</div>
</div>
