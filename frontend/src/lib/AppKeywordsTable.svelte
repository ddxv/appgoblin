<script lang="ts">
	import Pagination from './Pagination.svelte';

	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import type { KeywordScore } from '../types';

	let { entries_table } = $props();

	// const totalRows = entries_table.length;

	const rowsPerPage = 100;

	const handler = new DataHandler<KeywordScore>([], {
		rowsPerPage: rowsPerPage
		// totalRows: totalRows
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
	// console.log(`TABLE Company: ${totalRows}`);
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
			<thead>
				<tr>
					<th class="table-cell-fit">Keyword</th>
					<th class="table-cell-fit">App Count</th>
					<!-- <th class="table-cell-fit">Total Apps</th> -->
					<th class="table-cell-fit">Competitiveness Score</th>
					<th class="table-cell-fit">30 Day Best Rank</th>
				</tr>
			</thead>
			<tbody>
				{#each $rows as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							<a href="/keywords/en/{row.keyword_text}"> {row.keyword_text}</a>
						</td>
						<td class="table-cell-fit">
							{row.app_count}
						</td>
						<!-- <td class="table-cell-fit">
							{row.total_apps}
						</td> -->
						<td class="table-cell-fit">
							{row.competitiveness_score}
						</td>
						<td class="table-cell-fit">
							{row.d30_best_rank}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<!-- {#if totalRows > rowsPerPage}
				<Pagination {handler} />
			{/if} -->
		</footer>
	</div>
</div>
