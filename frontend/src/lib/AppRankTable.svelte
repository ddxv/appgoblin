<script lang="ts">
	import type { RankedAppList, RankedApps } from '../types';
	import Pagination from './Pagination.svelte';
	// import ThFilter from './ThFilter.svelte';
	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import StoreIcon from '$lib/StoreIcon.svelte';

	interface Props {
		tableData: RankedAppList;
	}

	let { tableData }: Props = $props();
	const totalRows = tableData.ranks.length;
	const rowsPerPage = 10;

	const handler = new DataHandler<RankedApps>([], {
		rowsPerPage: rowsPerPage,
		totalRows: totalRows
	});
	const rows = handler.getRows();

	handler.onChange((state: State) =>
		Promise.resolve(
			tableData.ranks.slice(
				0 + (state.pageNumber - 1) * state.rowsPerPage,
				state.rowsPerPage * state.pageNumber
			)
		)
	);

	handler.invalidate();
</script>

<div class="table-container">
	<table class="table table-hover table-compact table-auto w-full">
		<thead>
			<tr>
				<th>Rank</th>
				<th>Name</th>
			</tr>
			<tr>
				<th></th>
				<!-- <ThFilter {handler} filterBy="name" /> -->
			</tr>
		</thead>
		<tbody>
			{#each $rows as row}
				<tr>
					<td
						><div class="inline-flex">
							#
							<h3 class="h4 md:h3">
								{row.rank}
							</h3>
						</div>
					</td>
					<td>
						<a href="/apps/{row.store_id}">
							<div class="inline-flex">
								<StoreIcon store={row.store} />
								<img
									src={row.icon_url_512}
									alt={row.name}
									width="100 md:200"
									class="p-2"
									referrerpolicy="no-referrer"
								/>
								<h3 class="h4 md:h3 p-2">{row.name}</h3>
							</div>
						</a>
					</td>
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
