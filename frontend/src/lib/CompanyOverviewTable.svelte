<script lang="ts">
	import Pagination from './Pagination.svelte';

	import { Check, X } from 'lucide-svelte';

	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import type { CompanyOverviewApps, AppFullDetail } from '../types';
	export let entries_table: CompanyOverviewApps[] | AppFullDetail[];
	export let isiOS: boolean = false;

	const totalRows = entries_table.length;

	const rowsPerPage = 100;

	function tableHasAdsTxt(table: CompanyOverviewApps[]) {
		return !table.every((row) => row.app_ads_direct == false);
	}

	const handler = new DataHandler<CompanyOverviewApps>([], {
		rowsPerPage: rowsPerPage,
		totalRows: totalRows
	});
	const rows = handler.getRows();

	handler.onChange((state: State) =>
		Promise.resolve(
			entries_table.slice(
				0 + (state.pageNumber - 1) * state.rowsPerPage,
				state.rowsPerPage * state.pageNumber
			)
		)
	);

	handler.invalidate();
	console.log(`TABLE Company: ${totalRows}`);
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
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
					{#if tableHasAdsTxt(entries_table)}
						<th class="table-cell-fit">App-Ads.txt</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each $rows as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							{index + 1}
						</td>
						<td class="table-cell-fit">
							<a href="/apps/{row.store_id}" style="cursor: pointer;">
								{row.name}
							</a>
						</td>

						<td class="table-cell-fit">
							{#if !isiOS}
								{row.installs_d30}
							{:else}
								{row.rating_count_d30}
							{/if}
						</td>
						<td class="table-cell-fit">
							{#if row.sdk == true}
								<Check class="w-4 h-4 text-green-400" />
							{:else if row.sdk == false}
								<X class="w-4 h-4 text-red-400" />
							{:else}
								-
							{/if}
						</td>
						{#if !isiOS}
							<td class="table-cell-fit">
								{#if row.api_call == true}
									<Check class="w-4 h-4 text-green-400" />
								{:else if row.api_call == false}
									<X class="w-4 h-4 text-red-400" />
								{:else}
									-
								{/if}
							</td>
						{/if}
						{#if tableHasAdsTxt(entries_table)}
							<td class="table-cell-fit">
								{#if row.app_ads_direct == true}
									<Check class="w-4 h-4 text-green-400" />
								{:else if row.app_ads_direct == false}
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
			{#if totalRows > rowsPerPage}
				<Pagination {handler} />
			{/if}
		</footer>
	</div>
</div>
