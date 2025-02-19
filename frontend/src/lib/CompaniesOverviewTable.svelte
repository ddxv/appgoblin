<script lang="ts">
	import Pagination from './clientside/Pagination.svelte';
	import { DataHandler } from '@vincjo/datatables/legacy';
	import type { CompaniesOverviewEntries } from '../types';
	import ThSort from './clientside/ThSort.svelte';
	// import ThFilter from './clientside/ThFilter.svelte';

	import { page } from '$app/state';

	export let entries_table: CompaniesOverviewEntries[];

	const totalRows = entries_table.length;

	const rowsPerPage = 100;

	const handler = new DataHandler<CompaniesOverviewEntries>(entries_table, {
		rowsPerPage: rowsPerPage
	});

	const rows = handler.getRows();

	const include_open_source = page.params.type == 'development-tools';
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full">
			<thead>
				<tr>
					<th class="table-cell-fit w-0"></th>
					{#if include_open_source}
						<th class="table-cell-fit">
							<ThSort {handler} orderBy="percent_open_source"
								><p class="text-xs md:text-lg">Open Source</p></ThSort
							>
						</th>
					{/if}
					<th class="w-[50%]">
						<ThSort {handler} orderBy="company_name"
							><p class="text-xs md:text-lg">Company</p></ThSort
						>
					</th>

					<ThSort {handler} orderBy="google_sdk"
						><p class="text-xs md:text-lg">Android SDK</p></ThSort
					>
					<ThSort {handler} orderBy="apple_sdk"><p class="text-xs md:text-lg">iOS SDK</p></ThSort>
					{#if !page.params.type || page.params.type == 'ad-networks'}
						<ThSort {handler} orderBy="google_app_ads_direct"
							><p class="text-xs md:text-lg">Android AdsTxt</p></ThSort
						>
						<ThSort {handler} orderBy="apple_app_ads_direct"
							><p class="text-xs md:text-lg">iOS AdsTxt</p></ThSort
						>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each $rows as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							<p class="text-xs md:text-base">{index + 1}</p>
						</td>
						{#if include_open_source}
							<td class="text-center">
								{#if row.percent_open_source == 1}
									<div class="w-3 h-3 rounded-full bg-success-500 mx-auto"></div>
								{:else if row.percent_open_source == 0}
									<div class="w-3 h-3 rounded-full bg-error-500 mx-auto"></div>
								{:else}
									<div class="w-3 h-3 rounded-full bg-warning-500 mx-auto"></div>
								{/if}
							</td>
						{/if}

						<td class="w-0">
							<a
								href="/companies/{row.company_domain}"
								style="cursor: pointer;"
								class=" text-xs md:text-sm"
							>
								{#if row.company_name}
									{row.company_name}
									({row.company_domain})
								{:else}
									{row.company_domain}
								{/if}
							</a>
						</td>

						<td class="table-cell-fit">
							<p class="text-xs md:text-sm">
								{(row.google_sdk * 100).toFixed(2)}%
							</p>
						</td>

						<td class="table-cell-fit">
							<p class="text-xs md:text-sm">
								{(row.apple_sdk * 100).toFixed(2)}%
							</p>
						</td>

						{#if !page.params.type || page.params.type == 'ad-networks'}
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{(row.google_app_ads_direct * 100).toFixed(2)}%
								</p>
							</td>

							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{(row.apple_app_ads_direct * 100).toFixed(2)}%
								</p>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<!-- <RowCount {handler} /> -->
			{#if totalRows > rowsPerPage}
				<Pagination {handler} />
			{/if}
		</footer>
	</div>
</div>
