<script lang="ts">
	import Pagination from './clientside/Pagination.svelte';
	import ThSort from './clientside/ThSort.svelte';

	import { DataHandler } from '@vincjo/datatables/legacy';
	import type { KeywordScore } from '../types';

	let { entries_table }: { entries_table: KeywordScore[] } = $props();

	const totalRows = entries_table.length;

	const rowsPerPage = 10;

	const handler = new DataHandler<KeywordScore>(entries_table, {
		rowsPerPage: rowsPerPage
	});

	const rows = handler.getRows();
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
			<thead>
				<tr>
					<th class="table-cell-fit"> <ThSort {handler} orderBy="keyword_text">Keyword</ThSort></th>
					<th class="table-cell-fit">
						<ThSort {handler} orderBy="competitiveness_score">Competitiveness Score</ThSort></th
					>
					<th class="table-cell-fit"
						><ThSort {handler} orderBy="d30_best_rank">30 Day Best Rank</ThSort></th
					>
				</tr>
			</thead>
			<tbody>
				{#each $rows as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							<a href="/keywords/en/{row.keyword_text}"> {row.keyword_text}</a>
						</td>
						<!-- <td class="table-cell-fit">
							{row.total_apps}
						</td> -->
						<td class="table-cell-fit">
							{row.competitiveness_score}
							<p class="inline text-xs text-secondary-400-600">{row.app_count} apps</p>
						</td>
						<td class="table-cell-fit">
							{row.d30_best_rank}
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
