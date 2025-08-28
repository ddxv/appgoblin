<script lang="ts">
	import Pagination from './Pagination.svelte';

	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import type { CompanyOverviewApps } from '../types';
	import { formatNumber } from '$lib/utils/formatNumber';

	export let entries_table: CompanyOverviewApps[];

	const totalRows = entries_table.length;

	const rowsPerPage = 100;

	const handler = new DataHandler<CompanyOverviewApps>([], {
		rowsPerPage: rowsPerPage,
		totalRows: totalRows
	});
	const rows = handler.getRows();

	handler.onChange((state: State) =>
		Promise.resolve(
			entries_table.slice(
				0 + (state.pageNumber - 1) * state.rowsPerPage,
				state.rowsPerPage * state.pageNumber
			)
		)
	);

	handler.invalidate();
	console.log(`TABLE Company: ${totalRows}`);

	$: firstRowInstalls = entries_table && entries_table.length > 0 && entries_table[0].installs > 0;

	// Remove the local formatNumber function (lines 33-39)
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
			<thead>
				<tr>
					<th class="table-cell-fit"></th>
					<th class="table-cell-fit">Developer URL</th>
					<th class="table-cell-fit">Developer ID</th>
					<th class="table-cell-fit">Developer Name</th>
					<th class="table-cell-fit">App Count</th>
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
				{#each $rows as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							{index + 1}
						</td>
						<td class="table-cell-fit">
							{row.developer_domain_url}
						</td>
						<td class="table-cell-fit">
							<a href="/developers/{row.developer_id}" style="cursor: pointer;">
								{row.developer_id}
							</a>
						</td>
						<td class="table-cell-fit">
							<a href="/developers/{row.developer_id}" style="cursor: pointer;">
								{row.developer_name}
							</a>
						</td>
						<td class="table-cell-fit">{row.app_count}</td>
						<td class="table-cell-fit">
							{#if firstRowInstalls}
								{formatNumber(row.installs)}
							{:else}
								{formatNumber(row.rating_count)}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<!-- <RowCount {handler} /> -->
			{#if totalRows > rowsPerPage}
				<Pagination {handler} />
			{/if}
		</footer>
	</div>
</div>
