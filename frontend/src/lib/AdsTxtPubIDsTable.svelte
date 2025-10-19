<script lang="ts">
	import type { AdsTxtEntries } from '../types';
	import { page } from '$app/state';

	interface Props {
		entries_table: AdsTxtEntries[];
	}

	let { entries_table }: Props = $props();
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
				{#each entries_table as row}
					<tr>
						<td class="table-cell-fit text-sm md:text-base max-w-[100px] truncate">
							<a
								href={`/companies/${page.params.domain}/app-adstxt/publisher/${row.publisher_id}`}
								rel="nofollow">{row.publisher_id}</a
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
