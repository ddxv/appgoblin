<script lang="ts">
	import StoreIcon from './StoreIcon.svelte';
	import { formatNumber } from '$lib/utils/formatNumber';
	import type { SdkOverview } from '../types';
	import { createAppTable } from '$lib/components/data-table/index.js';
	import { genericColumns } from '$lib/components/data-table/generic-column';

	let { entries_table }: { entries_table: SdkOverview[] } = $props();

	function tableHasRemoved(table: SdkOverview[]) {
		return table.some((row) => row.is_removed != null);
	}

	const baseColumns = [
		{ title: 'Matched SDK String', accessorKey: 'value_name', isSortable: true },
		{ title: 'App', accessorKey: 'app_name', isSortable: true },
		{ title: 'Store', accessorKey: 'store', isSortable: true },
		{ title: 'Category', accessorKey: 'category', isSortable: true },
		{ title: 'Developer', accessorKey: 'developer_name', isSortable: true },
		{ title: 'Installs', accessorKey: 'installs', isSortable: true },
		{ title: 'Monthly Installs', accessorKey: 'installs_sum_4w', isSortable: true },
		{ title: 'Removed', accessorKey: 'is_removed', isSortable: true }
	];

	const table = createAppTable({
		get data() {
			return entries_table;
		},
		get columns() {
			return genericColumns(
				baseColumns.filter(
					(column) => column.accessorKey !== 'is_removed' || tableHasRemoved(entries_table)
				)
			);
		}
	});
</script>

<div class="table-container space-y-4 p-2 md:p-4">
	<div class="overflow-x-auto pl-0">
		<table class="table table-hover table-auto w-full text-xs md:text-sm">
			<thead>
				<tr>
					<th class="table-cell-fit">#</th>
					<th class="table-cell-fit">Matched SDK String</th>
					<th class="table-cell-fit">App</th>
					<th class="table-cell-fit">Store</th>
					<th class="table-cell-fit">Category</th>
					<th class="table-cell-fit">Developer</th>
					<th class="table-cell-fit">Installs</th>
					<th class="table-cell-fit">Monthly Installs</th>
					{#if tableHasRemoved(entries_table)}<th class="table-cell-fit">Removed</th>{/if}
				</tr>
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr class="px-0">
						<td class="table-cell-fit text-gray-500">{row.index + 1}</td>
						<td class="table-cell-fit truncate max-w-48">
							<a href={`/sdks/${row.original.value_name}`} rel="nofollow"
								>{row.original.value_name}</a
							>
						</td>
						<td class="table-cell-fit">
							<a href={`/apps/${row.original.store_id}`} class="flex items-center gap-2">
								<img
									src={row.original.app_icon_url}
									alt={row.original.app_name}
									class="w-8 h-8 rounded"
								/>
								<div class="flex flex-col">
									{row.original.app_name}
									<p class="text-xs text-surface-900-100">{row.original.developer_name ?? '-'}</p>
								</div>
							</a>
						</td>
						<td class="table-cell-fit"><StoreIcon store={row.original.store} /></td>
						<td class="table-cell-fit">{row.original.category ?? '-'}</td>
						<td class="table-cell-fit">{row.original.developer_name ?? '-'}</td>
						<td class="table-cell-fit">{formatNumber(row.original.installs)}</td>
						<td class="table-cell-fit">{formatNumber(row.original.installs_sum_4w)}</td>
						{#if tableHasRemoved(entries_table)}<td class="table-cell-fit"
								>{row.original.is_removed === true ? 'Yes' : '-'}</td
							>{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
