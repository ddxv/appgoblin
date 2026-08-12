<script lang="ts">
	import type { ColumnFiltersState, SortingState } from '@tanstack/svelte-table';

	import AppAdvertiserCard from './AppAdvertiserCard.svelte';
	import AppAdvertiserCreativeCarousel from './AppAdvertiserCreativeCarousel.svelte';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { RankedApps } from '../types';

	import {
		createAppTable,
		createTableState,
		FlexRender
	} from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps = {
		data: RankedApps[];
	};

	const [pagination, onPaginationChange] = createTableState({ pageIndex: 0, pageSize: 10 });
	const [sorting, onSortingChange] = createTableState<SortingState>([]);
	const [columnFilters, onColumnFiltersChange] = createTableState<ColumnFiltersState>([]);
	const [globalFilter, onGlobalFilterChange] = createTableState('');

	let { data }: DataTableProps = $props();

	const columns = genericColumns([
		{
			title: 'Advertiser',
			accessorKey: 'name',
			isSortable: true
		},
		{
			title: 'Top Creatives',
			accessorKey: 'top_md5_hashes',
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

	function getCreativesColumnWidth(header: any) {
		if (header.column.id === 'top_md5_hashes') {
			return 'w-[50%]';
		}
		return '';
	}
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
		<table class="table table-hover table-auto w-full border-separate border-spacing-y-4">
			<thead class="text-base md:text-xl">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th class={getCreativesColumnWidth(header)}>
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
					<tr class="px-0 text-base md:text-xl">
						<td>
							<AppAdvertiserCard app={row.original} size="md" />
						</td>

						<td>
							<AppAdvertiserCreativeCarousel data={row.original} height="16" />
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
