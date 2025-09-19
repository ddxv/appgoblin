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
	import CreativeModal from '$lib/CreativeModal.svelte';

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

	let globalFilter = $state<string>('');

	// Video modal state
	let showVideoModal = $state(false);
	let selectedVideoUrl = $state('');
	let selectedVideoTitle = $state('');

	let { data }: DataTableProps<RankedApps, TValue> = $props();

	const columns = genericColumns([
		{
			title: 'Creative',
			accessorKey: 'md5_hash',
			isSortable: true
		},
		{
			title: 'Seen In Publishers',
			accessorKey: 'pubs',
			isSortable: true
		},

		{
			title: 'Ad Networks',
			accessorKey: 'host_domain',
			isSortable: true
		}
	]);

	const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
		const name =
			row.original.pubs
				.map((pub: any) => pub.name)
				.join(', ')
				?.toLowerCase() ?? '';
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

	// Function to open video modal
	function openVideoModal(storeId: string, md5Hash: string, title: string, extension: string) {
		selectedVideoUrl = `https://media.appgoblin.info/creatives/raw/${storeId}/${md5Hash}.${extension}`;
		selectedVideoTitle = title + '.' + selectedVideoUrl;
		showVideoModal = true;
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
							<div class="flex flex-col gap-2">
								<button
									class="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer relative group"
									onclick={() =>
										openVideoModal(
											page.params.id!,
											row.original.md5_hash,
											`Creative: ${row.original.md5_hash}`,
											row.original.file_extension
										)}
								>
									<div class="relative">
										<img
											src="https://media.appgoblin.info/creatives/thumbs/{row.original
												.md5_hash}.jpg"
											class="w-24 md:w-64 h-auto object-cover rounded text-xs"
											alt="Creative: {row.original.md5_hash}"
										/>
										<!-- Play button overlay -->
										<div
											class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded opacity-30 group-hover:opacity-60 transition-opacity duration-200"
										>
											<div class="bg-white bg-opacity-90 rounded-full p-2 md:p-3">
												<svg
													class="w-4 h-4 md:w-6 md:h-6 text-gray-800"
													fill="currentColor"
													viewBox="0 0 24 24"
												>
													<path d="M8 5v14l11-7z" />
												</svg>
											</div>
										</div>
									</div>
								</button>
								<span class="text-xs text-surface-600-400">{row.original.file_extension}</span>
							</div>
						</td>

						<td>
							<div class="grid grid-cols-2 md:grid-cols-4 gap-1">
								{#each row.original.pubs.slice(0, 16) as pub}
									<a href="/apps/{pub.store_id}">
										<div class="col-1 items-center">
											<img
												src={pub.icon_url_100 || pub.icon_url_512}
												alt={pub.name}
												width="200"
												class="w-12 md:w-24 h-auto object-cover rounded"
												referrerpolicy="no-referrer"
											/>
										</div>
									</a>
								{/each}
							</div>
						</td>

						<td>
							<div class="flex flex-col gap-1">
								<CompanyButton
									companyName={`Host: ${row.original.host_domain}`}
									companyDomain={row.original.host_domain_company_domain}
									companyLogoUrl={row.original.company_logo_url_host_domain}
									size="md"
								/>
								<CompanyButton
									companyName={`Ad: ${row.original.ad_domain}`}
									companyDomain={row.original.ad_domain_company_domain}
									companyLogoUrl={row.original.company_logo_url_ad_domain}
									size="md"
								/>
							</div>
							<p class="text-primary-600-400 my-2">Additional Ad Domain URLs:</p>
							<div class="grid grid-cols-2 gap-2">
								{#each row.original.additional_ad_domain_urls as url}
									{#if url !== row.original.ad_domain_company_domain && url !== row.original.host_domain_company_domain && url !== row.original.mmp_domain && url !== row.original.ad_domain && url !== row.original.host_domain}
										<CompanyButton companyName={url} companyDomain={url} size="sm" />
									{/if}
								{/each}
								{#if row.original.mmp_name}
									{row.original.mmp_name}
								{/if}
								<p class="text-primary-600-400">Last Seen:</p>
								{row.original.run_at}
							</div>
							<a href={`ad-placements/${row.original.vhash}`}>
								<button class="btn preset-tonal btn-md">Creative Full Details</button>
							</a>
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

<!-- Video Modal -->
<CreativeModal
	bind:isOpen={showVideoModal}
	creativeUrl={selectedVideoUrl}
	title={selectedVideoTitle}
/>
