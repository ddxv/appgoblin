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

	import AppCard from './AppCard.svelte';

	import CompanyButton from './CompanyButton.svelte';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { RankedApps } from '../types';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps<RankedApps, TValue> = {
		data: RankedApps[];
	};

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	let globalFilter = $state<string>('');

	let { data }: DataTableProps<RankedApps, TValue> = $props();

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
			class="max-w-sm p-1"
		/>
	</div>
	<div class="overflow-x-auto pl-0">
		<table class="table table-hover table-auto w-full">
			<thead class="text-base md:text-xl">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th class={getCreativesColumnWidth(header)}>
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
					<tr class="px-0 text-base md:text-xl">
						<td>
							<div class="grid grid-cols-1 gap-2">
								<AppCard app={row.original} showHeader={false} />
								<div>
									<p class="text-primary-100-900">
										Ads Last Seen:<span class="text-primary-900-100 mx-2"
											>{row.original.last_seen}</span
										>
									</p>
									<p class="text-primary-100-900">
										Creatives:<span class="text-primary-900-100 mx-2"
											>{row.original.unique_creatives}</span
										>
									</p>
									<p class="text-primary-100-900">
										Apps seen publishing ads:<span class="text-primary-900-100 mx-2"
											>{row.original.unique_publishers}</span
										>
									</p>
									{#if row.original.mmp_domains && row.original.mmp_domains.length > 0}
										<p class="text-primary-100-900">
											MMPs:<span class="text-primary-900-100 mx-2"
												>{row.original.mmp_domains.length}</span
											>
										</p>
									{/if}

									<p class="text-primary-100-900">
										File Types:<span class="text-primary-900-100 mx-2"
											>{row.original.file_types.join(', ')}</span
										>
									</p>
									{#if row.original.ad_networks && row.original.ad_networks.length > 0}
										<p class="text-primary-100-900">Ad Networks:</p>
										<div class="grid grid-cols-2 md:grid-cols-3">
											{#each row.original.ad_networks as ad_network}
												<CompanyButton
													companyDomain={ad_network.domain}
													companyLogoUrl={ad_network.company_logo_url}
													size="lg"
												/>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</td>

						<td>
							<div class="overflow-x-auto relative">
								<div
									class="flex gap-3 snap-x snap-mandatory overflow-x-auto scrollbar-hide border-2 border-surface-100-900 p-4 pr-4"
								>
									{#each row.original.top_md5_hashes.slice(0, 6) as md5_hash}
										<a
											href="/apps/{row.original.advertiser_store_id}/ad-placements"
											class="snap-start shrink-0"
										>
											<card class="card-hover">
												<div class="card-header justify-center">
													<img
														src="https://media.appgoblin.info/creatives/thumbs/{md5_hash}.jpg"
														alt="Creative for {row.original.advertiser_name}"
														class="h-88 w-full object-cover rounded-lg"
													/>
												</div>
											</card>
										</a>
									{/each}
								</div>
								<div
									class="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-surface-100-900 to-transparent"
								></div>
							</div>
							<!-- <div class="overflow-auto">
								<div class="flex gap-1 overflow-x-auto">
									{#each row.original.top_md5_hashes.slice(0, 6) as md5_hash}
										<a href="/apps/{row.original.advertiser_store_id}/ad-placements">
											<card class="card-hover">
												<div class="card-header justify-center">
													<img
														src="https://media.appgoblin.info/creatives/thumbs/{md5_hash}.jpg"
														alt="Creative for {row.original.advertiser_name}"
														class="h-88 w-full object-middle object-none rounded-lg"
													/>
												</div>
											</card>
										</a>
									{/each}
								</div>
							</div> -->
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
