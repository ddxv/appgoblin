<script lang="ts">
	import type { SdksOverview } from '../types';

	import CompanyButton from './CompanyButton.svelte';
	import { formatNumber } from '$lib/utils/formatNumber';

	let { entries_table }: { entries_table: SdksOverview[] } = $props();
</script>

<div class="table-container space-y-4">
	<table class="table table-compact text-xs md:text-base w-full">
		<thead>
			<tr>
				<th class="w-12"></th>
				<th class="">Company</th>
				<th class="max-w-[100px] md:max-w-[200px] truncate">XML Path</th>
				<th class="max-w-[100px] md:max-w-[200px] truncate">Value Name</th>
				<th class="">App Count</th>
			</tr>
		</thead>
		<tbody>
			{#each entries_table as row, index}
				<tr class="px-0">
					<td class="table-cell-fit">
						{index + 1}
					</td>
					<td class="table-cell-fit">
						{#if row.company_domain}
							<CompanyButton companyDomain={row.company_domain} companyName={row.company_name} />
						{:else}
							N/A
						{/if}
					</td>
					<td class="overflow-hidden max-w-[100px] md:max-w-[200px] truncate">
						{row.xml_path}
					</td>
					<td class="overflow-hidden max-w-[100px] md:max-w-[200px] truncate">
						{#if row.value_name}
							<a href={`/sdks/${row.value_name}`}>
								{row.value_name}
							</a>
						{:else}
							N/A
						{/if}
					</td>
					<td class="table-cell-fit">
						{formatNumber(row.app_count)}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
