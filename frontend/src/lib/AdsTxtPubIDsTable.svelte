<script lang="ts">
	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import type { AdsTxtEntries } from '../types';
	import { page } from '$app/state';

	interface Props {
		entries_table: AdsTxtEntries[];
	}

	let { entries_table }: Props = $props();

	const totalRows = entries_table.length;

	const rowsPerPage = 50;

	const handler = new DataHandler<AdsTxtEntries>([], {
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
		<table class="table table-hover table-compact table-auto w-full">
			<thead>
				<tr>
					<th class="table-cell-fit">Publisher ID</th>
					<th class="table-cell-fit">Related Apps</th>
				</tr>
			</thead>
			<tbody>
				{#each $rows as row}
					<tr>
						<td class="table-cell-fit text-sm md:text-base max-w-[100px] truncate">
							tbody <a
								href={`/companies/${page.params.domain}/app-adstxt/publisher/${row.publisher_id}`}
								>{row.publisher_id}</a
							>
						</td>
						<td class="table-cell-fit text-sm md:text-base">
							{row.app_count}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
