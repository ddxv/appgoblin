<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import { renderComponent } from '$lib/components/data-table/index.js';
	import { mkConfig, generateCsv, download } from 'export-to-csv';

	import ColumnSortButton from '$lib/components/data-table/ColumnSortButton.svelte';

	import Pagination from '$lib/components/data-table/Pagination.svelte';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';
	import type { KeywordScore } from '../types';

	const columns: ColumnDef<KeywordScore>[] = [
		{
			accessorKey: 'keyword_text',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Keyword',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false); // Set to ascending
						} else if (currentSort === 'asc') {
							column.toggleSorting(true); // Set to descending
						} else {
							column.clearSorting(); // Clear sorting (back to unsorted)
						}
					}
				})
		},
		{
			accessorKey: 'competitiveness_score',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: 'Competitiveness Score',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false); // Set to ascending
						} else if (currentSort === 'asc') {
							column.toggleSorting(true); // Set to descending
						} else {
							column.clearSorting(); // Clear sorting (back to unsorted)
						}
					}
				})
		},
		{
			accessorKey: 'd30_best_rank',
			header: ({ column }) =>
				renderComponent(ColumnSortButton, {
					columnTitle: '30 Day Best Rank',
					sortDirection: column.getIsSorted(),
					onclick: () => {
						const currentSort = column.getIsSorted();
						if (currentSort === false) {
							column.toggleSorting(false); // Set to ascending
						} else if (currentSort === 'asc') {
							column.toggleSorting(true); // Set to descending
						} else {
							column.clearSorting(); // Clear sorting (back to unsorted)
						}
					}
				})
		}
	];

	type DataTableProps<KeywordScore, TValue> = {
		// columns: ColumnDef<TData, TValue>[];
		data: KeywordScore[];
	};

	let { data }: DataTableProps<KeywordScore, TValue> = $props();
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			}
		},

		getSortedRowModel: getSortedRowModel(),
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},

		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel()
	});

	const csvConfig = mkConfig({
		fieldSeparator: ',',
		filename: 'appgoblin_data', // export file name (without .csv)
		decimalSeparator: '.',
		useKeysAsHeaders: true
	});

	const exportDataCSV = (rows: Row<_>[]) => {
		const rowData = rows.map((row) => row.original);
		const csv = generateCsv(csvConfig)(rowData);
		download(csvConfig)(csv);
	};
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
			<thead>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr>
						<td class="table-cell-fit">
							<a href="/keywords/en/{row.original.keyword_text}"> {row.original.keyword_text}</a>
						</td>
						<td class="table-cell-fit">
							{row.original.competitiveness_score}
							<p class="inline text-xs text-secondary-400-600">{row.original.app_count} apps</p>
						</td>
						<td class="table-cell-fit">
							{row.original.d30_best_rank}
						</td>
					</tr>
				{:else}
					<tr>
						<td colspan={columns.length} class="h-24 text-center">No results.</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<div class="flex items-center justify-end space-x-2 py-4">
				<Pagination tableModel={table} />
				<button
					type="button"
					class="btn btn-sm preset-outlined-primary-100-900 p-0"
					onclick={() => exportDataCSV(table.getFilteredRowModel().rows)}
				>
					Download CSV
				</button>
			</div>
		</footer>
	</div>
</div>
