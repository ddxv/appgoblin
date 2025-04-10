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

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { CompaniesOverviewEntries } from '../types';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps<CompaniesOverviewEntries, TValue> = {
		data: CompaniesOverviewEntries[];
	};

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 50 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	let globalFilter = $state<string>('');

	let { data }: DataTableProps<CompaniesOverviewEntries, TValue> = $props();

	import { page } from '$app/state';

	const include_open_source = page.params.type == 'development-tools';

	const columns = genericColumns([
		...(include_open_source
			? [
					{
						title: 'Open Source',
						accessorKey: 'percent_open_source',
						isSortable: true
					}
				]
			: []),
		{
			title: 'Company',
			accessorKey: 'company_name',
			isSortable: true
		},
		{
			title: 'Domain',
			accessorKey: 'company_domain',
			isSortable: true
		},
		{
			title: 'Android SDK',
			accessorKey: 'google_sdk',
			isSortable: true
		},
		{
			title: 'iOS SDK',
			accessorKey: 'apple_sdk',
			isSortable: true
		},
		...(!page.params.type || page.params.type == 'ad-networks'
			? [
					{
						title: 'Android AdsTxt',
						accessorKey: 'google_app_ads_direct',
						isSortable: true
					},
					{
						title: 'iOS AdsTxt',
						accessorKey: 'apple_app_ads_direct',
						isSortable: true
					}
				]
			: [])
	]);

	const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
		const name = row.original.company_name?.toLowerCase() ?? '';
		const domain = row.original.company_domain?.toLowerCase() ?? '';
		const query = filterValue.toLowerCase();
		return name.includes(query) || domain.includes(query);
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
			placeholder="Filter companies..."
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
							{#if header.column.id == 'company_name'}
								<th class="w-[50%]">
									{#if !header.isPlaceholder}
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									{/if}
								</th>
							{:else}
								<th class="">
									{#if !header.isPlaceholder}
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									{/if}
								</th>
							{/if}
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr class="px-0">
						<!-- <td class="table-cell-fit">
							<p class="text-xs md:text-base">{row.index + 1}</p>
						</td> -->
						{#if include_open_source}
							<td class="text-center">
								{#if row.original.percent_open_source == 1}
									<div class="w-3 h-3 rounded-full bg-success-500 mx-auto"></div>
								{:else if row.original.percent_open_source == 0}
									<div class="w-3 h-3 rounded-full bg-error-500 mx-auto"></div>
								{:else}
									<div class="w-3 h-3 rounded-full bg-warning-500 mx-auto"></div>
								{/if}
							</td>
						{/if}

						<td class="w-0">
							<a
								href="/companies/{row.original.company_domain}"
								style="cursor: pointer;"
								class=" text-xs md:text-sm"
							>
								{#if row.original.company_name}
									{row.original.company_name}
									({row.original.company_domain})
								{:else}
									{row.original.company_domain}
								{/if}
							</a>
						</td>

						<td class="table-cell-fit">
							<p class="text-xs md:text-sm">
								{(row.original.google_sdk * 100).toFixed(2)}%
							</p>
						</td>

						<td class="table-cell-fit">
							<p class="text-xs md:text-sm">
								{(row.original.apple_sdk * 100).toFixed(2)}%
							</p>
						</td>

						{#if !page.params.type || page.params.type == 'ad-networks'}
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{(row.original.google_app_ads_direct * 100).toFixed(2)}%
								</p>
							</td>

							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{(row.original.apple_app_ads_direct * 100).toFixed(2)}%
								</p>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<div class="flex items-center justify-end space-x-2 py-4">
				<Pagination tableModel={table} />
				<ExportAsCSV {table} filename="appgoblin_companies" />
			</div>
		</footer>
	</div>
</div>
