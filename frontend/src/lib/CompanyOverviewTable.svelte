<script lang="ts">
	import Pagination from './Pagination.svelte';

	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import type { CompanyOverviewApps, AppFullDetail } from '../types';
	export let entries_table: CompanyOverviewApps[] | AppFullDetail[];

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

	$: firstRowInstalls =
		entries_table &&
		entries_table.length > 0 &&
		typeof entries_table[0].installs === 'string' &&
		entries_table[0].installs != 'N/A';
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
					<th class="table-cell-fit">
						{#if firstRowInstalls}
							Installs (30d)
						{:else}
							Rating Count (30d)
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
							<a href="/apps/{row.store_id}" style="cursor: pointer;">
								{row.name}
							</a>
						</td>

						<td class="table-cell-fit">
							{#if row.installs && typeof row.installs === 'string' && row.installs != 'N/A'}
								{row.installs}
							{:else}
								{row.rating_count}
							{/if}
						</td>
						<td class="table-cell-fit">
							{#if row.installs_d30 && typeof row.installs_d30 === 'string' && row.installs_d30 != 'N/A'}
								{row.installs_d30}
							{:else}
								{row.rating_count_d30}
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			{#if totalRows > rowsPerPage}
				<Pagination {handler} />
			{/if}
		</footer>
	</div>
</div>
