<script lang="ts">
	import type { AppFullDetail } from '../types';
	import { formatNumber } from '$lib/utils/formatNumber';
	import {
		type PaginationState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';
	import { createSvelteTable } from '$lib/components/data-table/index.js';
	import { genericColumns } from '$lib/components/data-table/generic-column';
	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';

	type DataTableProps = {
		data: AppFullDetail[];
		isiOS: boolean;
	};

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

	let { data, isiOS }: DataTableProps = $props();

	const columns = genericColumns([
		{
			title: 'App',
			accessorKey: 'name',
			isSortable: true
		},
		{
			title: 'Installs',
			accessorKey: 'installs',
			isSortable: true
		},
		{
			title: 'Ratings',
			accessorKey: 'rating_count',
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
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getSortedRowModel: getSortedRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="table table-hover table-auto w-full text-xs md:text-sm">
			<thead>
				<tr>
					<th class="table-cell-fit"></th>
					<th class="table-cell-fit">App</th>
					<th class="table-cell-fit">
						{#if !isiOS}
							Installs
						{:else}
							Ratings
						{/if}
					</th>
					<th class="table-cell-fit">Rating</th>
				</tr>
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr class="px-0">
						<td class="table-cell-fit text-gray-500 text-xs md:text-sm">
							{row.index + 1 + pagination.pageIndex * pagination.pageSize}
						</td>
						<td class="table-cell-fit">
							<a href="/apps/{row.original.store_id}" style="cursor: pointer;">
								{row.original.name}
							</a>
						</td>
						<td class="table-cell-fit">
							{#if !isiOS}
								{formatNumber(row.original.installs || 0)}
							{:else}
								{formatNumber(row.original.rating_count || 0)}
							{/if}
						</td>
						<td class="table-cell-fit">
							{#if row.original.rating}
								{row.original.rating.toFixed(1)} ⭐
							{:else}
								-
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<div class="flex items-center justify-end space-x-2 py-4 gap-2">
				<Pagination tableModel={table} />
				<ExportAsCSV {table} filename="developer_apps" />
			</div>
		</footer>
	</div>
</div>
