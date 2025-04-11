<script lang="ts" generics="TData, TValue">
	import {
		type ColumnDef,
		type PaginationState,
		type SortingState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';
	import type { KeywordScore } from '../types';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps<KeywordScore, TValue> = {
		data: KeywordScore[];
	};

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);

	let { data }: DataTableProps<KeywordScore, TValue> = $props();

	const columns = genericColumns([
		{ title: 'Keyword', accessorKey: 'keyword_text', isSortable: true },
		{
			title: 'Competitiveness Score',
			accessorKey: 'competitiveness_score',
			isSortable: true
		},
		{
			title: '30 Day Best Rank',
			accessorKey: 'd30_best_rank',
			isSortable: true
		}
	]);

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
				<ExportAsCSV {table} filename="appgoblin_data" />
			</div>
		</footer>
	</div>
</div>
