<script lang="ts">
	import Pagination from './Pagination.svelte';

	import { DataHandler } from '@vincjo/datatables/legacy/remote';
	import type { State } from '@vincjo/datatables/legacy/remote';
	import type { AdsTxtEntries } from '../types';
	import CompanyButton from './CompanyButton.svelte';

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
					<th class="table-cell-fit">Company</th>
					<th class="table-cell-fit">Publisher ID</th>
					<th class="table-cell-fit">Crawled At</th>
				</tr>
			</thead>
			<tbody>
				{#each $rows as row}
					<tr>
						<td class="table-cell-fit text-sm md:text-base">
							{#if row.company_name}
								<CompanyButton companyName={row.company_name} companyDomain={row.ad_domain_url} />
							{:else}
								<CompanyButton companyDomain={row.ad_domain_url} companyName={row.ad_domain_url} />
							{/if}
						</td>
						<td class="table-cell-fit text-sm md:text-base max-w-[100px] truncate">
							<a href={`/companies/${row.ad_domain_url}/app-adstxt/publisher/${row.publisher_id}`}
								>{row.publisher_id}</a
							>
						</td>
						<td class="table-cell-fit text-sm md:text-base">
							{new Date(row.developer_domain_crawled_at).toLocaleDateString('en-CA')}
						</td>
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
