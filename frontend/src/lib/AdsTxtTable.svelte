<script lang="ts">
	import type { ColumnFiltersState, SortingState } from '@tanstack/svelte-table';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { AdsTxtEntries } from '../types';
	import CompanyButton from './CompanyButton.svelte';

	import {
		createAppTable,
		createTableState,
		FlexRender
	} from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps = {
		data: AdsTxtEntries[];
	};

	const [pagination, onPaginationChange] = createTableState({ pageIndex: 0, pageSize: 50 });
	const [sorting, onSortingChange] = createTableState<SortingState>([]);
	const [columnFilters, onColumnFiltersChange] = createTableState<ColumnFiltersState>([]);
	const [globalFilter, onGlobalFilterChange] = createTableState('');

	let { data }: DataTableProps = $props();

	const columns = genericColumns([
		{
			title: 'Company',
			accessorKey: 'company',
			isSortable: true
		},

		{
			title: 'Publisher ID',
			accessorKey: 'publisher_id',
			isSortable: true
		},
		{
			title: 'Crawled At',
			accessorKey: 'developer_domain_crawled_at',
			isSortable: true
		}
	]);

	const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
		const company = row.original.company?.toLowerCase() ?? '';
		const domain = row.original.ad_domain_url?.toLowerCase() ?? '';
		const publisherId = row.original.publisher_id?.toLowerCase() ?? '';
		const query = filterValue.toLowerCase();
		return company.includes(query) || domain.includes(query) || publisherId.includes(query);
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
			value={globalFilter}
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
						<td class="table-cell-fit text-sm md:text-base">
							{#if row.original.company}
								<CompanyButton
									companyName={row.original.company}
									companyDomain={row.original.ad_domain_url}
								/>
							{:else}
								<CompanyButton
									companyDomain={row.original.ad_domain_url}
									companyName={row.original.ad_domain_url}
								/>
							{/if}
						</td>
						<td class="table-cell-fit text-sm md:text-base max-w-[100px] truncate">
							<a
								href={`/companies/${row.original.ad_domain_url}/app-adstxt/publisher/${row.original.publisher_id}`}
								rel="nofollow">{row.original.publisher_id}</a
							>
						</td>
						<td class="table-cell-fit text-sm md:text-base">
							{new Date(row.original.developer_domain_crawled_at).toLocaleDateString('en-CA')}
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
