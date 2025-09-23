<script lang="ts">
	import type { CompanyOverviewApps } from '../types';

	let { entries_table }: { entries_table: CompanyOverviewApps[] } = $props();

	let firstRowInstalls = $derived(entries_table && entries_table.length > 0);
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
			<thead>
				<tr>
					<th class="table-cell-fit"></th>
					<th class="table-cell-fit">Time App Analyzed</th>
					<th class="table-cell-fit">Version Code</th>
					<th class="table-cell-fit">Crawl Result</th>
					<th class="table-cell-fit">App</th>
					<th class="table-cell-fit">
						{#if firstRowInstalls}
							Installs
						{:else}
							Ratings
						{/if}
					</th>
				</tr>
			</thead>
			<tbody>
				{#each entries_table as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							{index + 1}
						</td>
						<td class="table-cell-fit">
							{new Date(row.sdk_crawled_at).toISOString().slice(0, 16).replace('T', ' ')}
						</td>
						<td class="table-cell-fit">
							{row.version_code}
						</td>
						<td class="table-cell-fit">
							{row.crawl_result}
						</td>
						<td class="table-cell-fit">
							<a href="/apps/{row.store_id}" style="cursor: pointer;">
								{row.name}
							</a>
						</td>

						<td class="table-cell-fit">
							{#if row.installs && row.installs != 0}
								{row.installs}
							{:else}
								{row.rating_count}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
