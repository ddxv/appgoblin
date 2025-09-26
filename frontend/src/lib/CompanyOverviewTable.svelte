<script lang="ts" generics="TValue">
	import {
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';

	import Check from 'lucide-svelte/icons/check';
	import X from 'lucide-svelte/icons/x';

	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { CompanyOverviewApps } from '../types';
	import { formatNumber } from '$lib/utils/formatNumber';
	import { createSvelteTable } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps<RankedApps, TValue> = {
		data: RankedApps[];
		isiOS: boolean;
	};

	function tableHasAdsTxt(table: CompanyOverviewApps[]) {
		return !table.every((row) => row.app_ads_direct == false);
	}

	let { data, isiOS }: DataTableProps<CompanyOverviewApps, TValue> = $props();

	const columns = genericColumns([
		{
			title: 'App',
			accessorKey: 'name',
			isSortable: true
		},
		{
			title: 'Monthly Installs',
			accessorKey: 'installs_d30',
			isSortable: true
		},

		{
			title: 'Monthly Ratings',
			accessorKey: 'rating_count_d30',
			isSortable: true
		},
		{
			title: 'SDK',
			accessorKey: 'sdk',
			isSortable: true
		},
		{
			title: 'API Calls',
			accessorKey: 'api_call',
			isSortable: true
		},
		{
			title: 'App-Ads.txt',
			accessorKey: 'app_ads_direct',
			isSortable: true
		}
	]);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,

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
							Monthly Installs
						{:else}
							Monthly iOS Ratings
						{/if}
					</th>
					<th class="table-cell-fit">SDK</th>
					{#if !isiOS}
						<th class="table-cell-fit">API Calls</th>
					{/if}
					{#if tableHasAdsTxt(data)}
						<th class="table-cell-fit">App-Ads.txt</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr class="px-0">
						<td class="table-cell-fit text-gray-500 text-xs md:text-sm">
							{row.index + 1}
						</td>
						<td class="table-cell-fit">
							<a href="/apps/{row.original.store_id}" style="cursor: pointer;">
								{row.original.name}
							</a>
						</td>

						<td class="table-cell-fit">
							{#if !isiOS}
								{formatNumber(row.original.installs_d30)}
							{:else}
								{formatNumber(row.original.rating_count_d30)}
							{/if}
						</td>
						<td class="table-cell-fit">
							{#if row.original.sdk == true}
								<Check class="w-4 h-4 text-green-400" />
							{:else if row.original.sdk == false}
								<X class="w-4 h-4 text-red-400" />
							{:else}
								-
							{/if}
						</td>
						{#if !isiOS}
							<td class="table-cell-fit">
								{#if row.original.api_call == true}
									<Check class="w-4 h-4 text-green-400" />
								{:else if row.original.api_call == false}
									<X class="w-4 h-4 text-red-400" />
								{:else}
									-
								{/if}
							</td>
						{/if}
						{#if tableHasAdsTxt(data)}
							<td class="table-cell-fit">
								{#if row.original.app_ads_direct == true}
									<Check class="w-4 h-4 text-green-400" />
								{:else if row.original.app_ads_direct == false}
									<X class="w-4 h-4 text-red-400" />
								{:else}
									-
								{/if}
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<div class="flex items-center justify-end space-x-2 py-4 gap-2">
				<ExportAsCSV {table} filename="appgoblin_apps" />
				<span class="text-xs md:text-sm text-gray-500">
					For full client list see <a href="/about">about pricing page</a>.
				</span>
			</div>
		</footer>
	</div>
</div>
