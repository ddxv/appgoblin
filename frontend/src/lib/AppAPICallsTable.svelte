<script lang="ts" generics="TData, TValue">
	import {
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';

	import CompanyButton from './CompanyButton.svelte';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { AppAPIsOverview } from '../types';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps<AppAPIsOverview, TValue> = {
		data: AppAPIsOverview[];
	};

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 40 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	let globalFilter = $state<string>('');

	let { data }: DataTableProps<AppAPIsOverview, TValue> = $props();

	const columns = genericColumns([
		{
			title: 'Company',
			accessorKey: 'company_name',
			isSortable: true
		},
		{
			title: 'TLD URL',
			accessorKey: 'tld_url',
			isSortable: true
		},
		{
			title: 'URL',
			accessorKey: 'url',
			isSortable: true
		},
		{
			title: 'Count',
			accessorKey: 'count',
			isSortable: true
		}
	]);

	const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
		const tld_url = row.original.tld_url?.toLowerCase() ?? '';
		const url = row.original.url?.toLowerCase() ?? '';
		const query = filterValue.toLowerCase();
		return tld_url.includes(query) || url.includes(query);
	};

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
			},
			get columnFilters() {
				return columnFilters;
			},
			get globalFilter() {
				return globalFilter;
			}
		},

		getSortedRowModel: getSortedRowModel(),

		globalFilterFn,

		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},

		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onGlobalFilterChange: (updater) => {
			globalFilter = typeof updater === 'function' ? updater(globalFilter) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});
</script>

<div class="table-container">
	<div class="flex items-center p-2">
		<input
			placeholder="Filter URLs..."
			value={globalFilter}
			oninput={(e) => {
				const value = e.currentTarget.value;
				table.setGlobalFilter(value);
			}}
			class="max-w-sm p-1"
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
					<tr class="px-0">
						<td>
							{#if row.original.company_name}
								<CompanyButton
									companyName={row.original.company_name}
									companyDomain={row.original.tld_url}
								/>
							{:else}
								{row.original.tld_url}
							{/if}
						</td>
						<td>{row.original.url}</td>
						<td>{row.original.count}</td>
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
