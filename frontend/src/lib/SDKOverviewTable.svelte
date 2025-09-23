<script lang="ts">
	import StoreIcon from './StoreIcon.svelte';
	import { formatNumber } from '$lib/utils/formatNumber';
	import { page } from '$app/state';
	import type { SdkOverview } from '../types';

	let pattern = page.params.pattern;

	let { entries_table, is_ios }: { entries_table: SdkOverview[]; is_ios: boolean } = $props();
</script>

<div class="table-container space-y-4 p-2 md:p-4">
	<div class="overflow-x-auto pl-0 max-w-full">
		<table class="md:table table-hover table-compact w-full text-xs">
			<thead>
				<tr>
					<th class="truncate">Value Name</th>
					<th class="table-cell-fit">App</th>
					{#if !is_ios}
						<th class="table-cell-fit">Installs</th>
					{/if}
					<th class="table-cell-fit">Rating Count</th>
				</tr>
			</thead>
			<tbody>
				{#each entries_table as row}
					<tr class="px-0">
						<td class="truncate">
							{#if row.value_name != pattern}
								<a href={`/sdks/${row.value_name}`}>
									{row.value_name}
								</a>
							{:else}
								full match
							{/if}
						</td>

						<td class="table-cell-fit">
							<a href={`/apps/${row.store_id}`} class="inline-flex gap-1 md:gap-2">
								<StoreIcon store={row.store} />
								<div>
									{row.app_name}
								</div>
							</a>
						</td>
						{#if !is_ios}
							<td class="table-cell-fit">
								{formatNumber(row.installs)}
							</td>
						{/if}
						<td class="table-cell-fit">
							{formatNumber(row.rating_count)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
