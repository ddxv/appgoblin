<script lang="ts">
	import type { ColumnFiltersState, SortingState } from '@tanstack/svelte-table';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { RankedApps } from '../types';
	import AppCard from './AppCard.svelte';

	import {
		createAppTable,
		createTableState,
		FlexRender
	} from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps = {
		data: RankedApps[];
	};

	const [pagination, onPaginationChange] = createTableState({ pageIndex: 0, pageSize: 25 });
	const [sorting, onSortingChange] = createTableState<SortingState>([]);
	const [columnFilters, onColumnFiltersChange] = createTableState<ColumnFiltersState>([]);
	const [globalFilter, onGlobalFilterChange] = createTableState('');

	let { data }: DataTableProps = $props();

	const columns = genericColumns([
		{
			title: 'Rank',
			accessorKey: 'rank',
			isSortable: true
		},
		{
			title: 'Name',
			accessorKey: 'name',
			isSortable: true
		}
	]);

	const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
		const name = row.original.name?.toLowerCase() ?? '';
		const query = filterValue.toLowerCase();
		return name.includes(query);
	};

	const table = createAppTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination();
			},
			get sorting() {
				return sorting();
			},
			get columnFilters() {
				return columnFilters();
			},
			get globalFilter() {
				return globalFilter();
			}
		},
		globalFilterFn,
		onSortingChange,
		onColumnFiltersChange,
		onPaginationChange,
		onGlobalFilterChange
	});
</script>

<div class="table-container">
	<div class="flex items-center p-2">
		<input
			placeholder="Filter apps..."
			value={globalFilter()}
			oninput={(e) => {
				const value = e.currentTarget.value;
				table.setGlobalFilter(value);
			}}
			class="bg-surface-50-950 max-w-sm p-1"
		/>
	</div>
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full">
			<thead>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th class="">
								{#if !header.isPlaceholder}
									<FlexRender {header} />
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr>
						<td class="text-sm md:text-base"
							><span class="ml-2 md:ml-8">{row.original.rank}</span></td
						>
						<td class="py-2">
							<AppCard app={row.original as RankedApps} showHeader={false} />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<div class="flex items-center justify-end space-x-2 py-4">
				<Pagination tableModel={table} />
				<ExportAsCSV {table} filename="appgoblin_apps" />
			</div>
		</footer>
	</div>
</div>
