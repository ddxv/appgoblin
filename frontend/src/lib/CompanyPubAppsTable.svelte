<script lang="ts">
	import type { SDKAppsOverview } from '../types';
	import { formatNumber } from '$lib/utils/formatNumber';

	let { entries_table }: { entries_table: SDKAppsOverview[] } = $props();

	let firstRowInstalls = $derived(
		entries_table && entries_table.length > 0 && entries_table[0].installs > 0
	);

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
			<thead>
				<tr>
					<th class="table-cell-fit"></th>
					<th class="table-cell-fit">App</th>
					<th class="table-cell-fit">
						{#if firstRowInstalls}
							Installs
						{:else}
							Ratings
						{/if}
					</th>
					<th class="table-cell-fit">App-Ads.txt Last Crawled</th>
				</tr>
			</thead>
			<tbody>
				{#each entries_table as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							{index + 1}
						</td>
						<td class="table-cell-fit">
							<a href="/apps/{row.store_id}" style="cursor: pointer;">
								{row.app_name}
							</a>
						</td>

						<td class="table-cell-fit">
							{#if firstRowInstalls}
								{formatNumber(row.installs)}
							{:else}
								{formatNumber(row.rating_count)}
							{/if}
						</td>
						<td class="table-cell-fit">
							{formatDate(row.developer_domain_crawled_at)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
