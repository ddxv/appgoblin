<script lang="ts">
	import IconGoogle from './svg/IconGoogle.svelte';
	import IconiOs from './svg/IconiOS.svelte';

	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import type { CompanyOverviewApps } from '../types';

	export let entries_table: CompanyOverviewApps[];

	const totalRows = entries_table.length;

	const rowsPerPage = 100;

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
</script>

<div class="table-container space-y-4">
	<div class="overflow-x-auto pl-0">
		<table class="md:table table-hover md:table-compact table-auto w-full text-xs">
			<thead>
				<tr>
					<th class="table-cell-fit">Store</th>
					<th class="table-cell-fit">App</th>
					<th class="table-cell-fit">Time App Requested</th>
					<th class="table-cell-fit">Time App Analyzed</th>
					<th class="table-cell-fit">Crawl Result</th>
					<th class="table-cell-fit">Installs</th>
					<th class="table-cell-fit">Ratings</th>
				</tr>
			</thead>
			<tbody>
				{#each $rows as row, index}
					<tr class="px-0">
						<td class="table-cell-fit">
							{#if row.store == 1}
								<IconGoogle size="16" />
							{:else}
								<IconiOs size="16" />
							{/if}
						</td>

						<td class="table-cell-fit">
							<a href="/apps/{row.store_id}" style="cursor: pointer;">
								{row.name}
							</a>
						</td>
						<td class="table-cell-fit">
							{#if row.requested_at !== null && row.requested_at !== undefined && row.requested_at !== ''}
								{new Date(row.requested_at).toISOString().slice(0, 16).replace('T', ' ') || 'N/A'}
							{:else}
								N/A
							{/if}
						</td>
						<td class="table-cell-fit">
							{#if row.app_scanned_at}
								{new Date(row.app_scanned_at).toISOString().slice(0, 16).replace('T', ' ') || 'N/A'}
							{:else}
								pending
							{/if}
						</td>

						<td class="table-cell-fit">
							{row.crawl_result}
						</td>

						<td class="table-cell-fit">
							{row.installs}
						</td>
						<td class="table-cell-fit">
							{row.rating_count}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
