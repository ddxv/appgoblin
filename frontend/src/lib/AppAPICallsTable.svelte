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

	import { countryCodeToEmoji } from './utils/countryCodeToEmoji';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { AppAPIs } from '../types';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps<AppAPIs, TValue> = {
		data: AppAPIs;
	};

	function formatDate(date: string) {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false
		});
	}

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 50 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	let globalFilter = $state<string>('');

	let { data }: DataTableProps<AppAPIs, TValue> = $props();

	const columns = genericColumns([
		{
			title: 'Called At',
			accessorKey: 'called_at',
			isSortable: true
		},
		{
			title: 'URL',
			accessorKey: 'url',
			isSortable: true
		},
		{ title: 'Servers', accessorKey: 'servers', isSortable: true },
		{ title: 'Content Type', accessorKey: 'response_mime_type', isSortable: true },
		{ title: 'Ad Creative Found', accessorKey: 'creative_md5_hash', isSortable: true }
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
					<tr class="px-0 text-xs md:text-sm overflow-x-auto">
						<td>
							{formatDate(row.original.called_at)}
						</td>
						<td class="flex flex-col space-y-1">
							{#if row.original.company_name}
								<CompanyButton
									companyName={row.original.company_name}
									companyDomain={row.original.tld_url}
								/>
							{:else}
								<CompanyButton
									companyName={row.original.tld_url}
									companyDomain={row.original.tld_url}
								/>
							{/if}
							<p class="text-xs md:text-sm break-all">{row.original.url}</p>
						</td>
						<td>{countryCodeToEmoji(row.original.country)} {row.original.servers}</td>
						<td class="flex-col"
							><p>Request: {row.original.request_mime_type}</p>
							<p>Response: {row.original.response_mime_type}</p></td
						>
						<td
							>{#if row.original.creative_md5_hash}
								<img
									src={'https://media.appgoblin.info/creatives/thumbs/' +
										row.original.creative_md5_hash +
										'.jpg'}
									alt={row.original.creative_md5_hash}
									class="w-16 h-auto object-contain rounded-lg shadow-md"
								/>
							{/if}
						</td>
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
