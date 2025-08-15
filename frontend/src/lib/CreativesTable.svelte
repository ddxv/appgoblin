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

	import CompanyButton from '$lib/CompanyButton.svelte';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { RankedApps } from '../types';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';
	import { page } from '$app/state';

	type DataTableProps<RankedApps, TValue> = {
		data: RankedApps[];
	};

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 20 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	let vhash = page.params.vhash;

	let globalFilter = $state<string>('');

	let { data }: DataTableProps<RankedApps, TValue> = $props();

	const columns = genericColumns([
		{
			title: 'Creative',
			accessorKey: 'md5_hash',
			isSortable: true
		},
		{
			title: 'File Type',
			accessorKey: 'file_extension',
			isSortable: true
		},

		{
			title: 'Publisher',
			accessorKey: 'pub_name',
			isSortable: true
		},

		{
			title: 'Ad Networks',
			accessorKey: 'host_domain',
			isSortable: true
		},
		{
			title: 'Additional Ad Domain URLs',
			accessorKey: 'additional_ad_domain_urls',
			isSortable: true
		},

		{
			title: 'MMP',
			accessorKey: 'mmp_name',
			isSortable: true
		},

		{
			title: 'Scanned At',
			accessorKey: 'run_at',
			isSortable: true
		}
	]);

	const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
		const name = row.original.pub_name?.toLowerCase() ?? '';
		const query = filterValue.toLowerCase();
		return name.includes(query);
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
			placeholder="Filter apps..."
			value={globalFilter}
			oninput={(e) => {
				const value = e.currentTarget.value;
				table.setGlobalFilter(value);
			}}
			class="max-w-sm p-1"
		/>
	</div>
	<div class="overflow-x-auto pl-0">
		<table class="table table-hover table-auto w-full">
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
					<tr class="px-0 text-xs md:text-base">
						<td>
							{#if vhash != row.original.vhash}
								<a href={`ad-placements/${row.original.vhash}`}>
									<img
										src="https://appgoblin-data.sgp1.digitaloceanspaces.com/creatives/thumbs/{row
											.original.md5_hash}.jpg"
										class="w-24 md:w-64 h-auto object-cover rounded text-xs"
										alt="Creative: {row.original.md5_hash}"
									/>
									{row.original.md5_hash}
								</a>
							{:else}
								<img
									src="https://appgoblin-data.sgp1.digitaloceanspaces.com/creatives/thumbs/{row
										.original.md5_hash}.jpg"
									class="w-24 md:w-64 h-auto object-cover rounded text-xs"
									alt="Creative: {row.original.md5_hash}"
								/>
								{row.original.md5_hash}
							{/if}
						</td>

						<td>{row.original.file_extension}</td>
						<td>
							<a href="/apps/{row.original.pub_store_id}">
								<div class="col-1 items-center">
									<img
										src={row.original.pub_icon_url_512}
										alt={row.original.pub_name}
										width="200"
										class="w-12 md:w-24 h-auto object-cover rounded"
										referrerpolicy="no-referrer"
									/>
									<h3 class="p-2">{row.original.pub_name}</h3>
								</div>
							</a>
						</td>

						<td>
							<div class="flex flex-col gap-1">
								<CompanyButton
									companyName={`Host: ${row.original.host_domain_company_name} (${row.original.host_domain})`}
									companyDomain={row.original.host_domain_company_domain}
									size="sm"
								/>
								<CompanyButton
									companyName={`Ad: ${row.original.ad_domain_company_name} (${row.original.ad_domain})`}
									companyDomain={row.original.ad_domain_company_domain}
									size="sm"
								/>
							</div>
						</td>
						<td class="flex flex-col gap-1"
							>{#each row.original.additional_ad_domain_urls as url}
								{#if url !== row.original.ad_domain_company_domain && url !== row.original.host_domain_company_domain && url !== row.original.mmp_domain && url !== row.original.ad_domain && url !== row.original.host_domain}
									<div class="grid grid-cols-2 gap-1">
										<CompanyButton companyName={url} companyDomain={url} size="sm" />
									</div>
								{/if}
							{/each}
						</td>
						<td>{row.original.mmp_name}</td>
						<td>{row.original.run_at}</td>
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
