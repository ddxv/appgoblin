<script lang="ts" generics="TData, TValue">
	import { getCoreRowModel, getSortedRowModel } from '@tanstack/table-core';

	import type { RankedApps } from '../types';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';

	type DataTableProps<RankedApps, TValue> = {
		data: RankedApps[];
	};

	let { data }: DataTableProps<RankedApps, TValue> = $props();

	const columns = genericColumns([
		{
			title: 'Advertiser',
			accessorKey: 'advertiser_name',
			isSortable: true
		},
		{
			title: 'Top Creatives',
			accessorKey: 'top_md5_hashes',
			isSortable: true
		}
	]);

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,

		getSortedRowModel: getSortedRowModel(),

		getCoreRowModel: getCoreRowModel()
	});
</script>

<div class="table-container">
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
					<tr class="px-0">
						<td class="text-xs md:text-base">
							<a href="/apps/{row.original.advertiser_store_id}/ad-placements">
								<div class="col-1">
									<img
										src={row.original.advertiser_icon_url_512}
										alt={row.original.advertiser_name}
										class="w-8 md:w-16 h-auto object-cover rounded"
										referrerpolicy="no-referrer"
									/>
								</div>
								{row.original.advertiser_name}
							</a>
						</td>
						<td>
							<div class="overvlow-y-auto">
								<div class="grid grid-cols-2 md:grid-cols-4 gap-1">
									{#each row.original.top_md5_hashes.slice(0, 4) as md5_hash}
										<a href="/apps/{row.original.advertiser_store_id}/ad-placements">
											<img
												src="https://appgoblin-data.sgp1.digitaloceanspaces.com/creatives/thumbs/{md5_hash}.jpg"
												alt=""
												class="w-12 md:w-24 h-auto"
											/>
										</a>
									{/each}
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
