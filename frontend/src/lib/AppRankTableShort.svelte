<script lang="ts">
	import type { RankedAppList } from '../types';

	import AppCard from './AppCard.svelte';

	interface Props {
		myTable: RankedAppList;
	}

	let { myTable }: Props = $props();
</script>

<div class="card preset-filled-surface-100-900 rounded-md table-container">
	<table class="table table-hover table-compact">
		<tbody>
			{#each Object.entries(myTable.ranks) as [_prop, values]}
				<tr>
					<td
						><div class="inline-flex">
							<p class="text-sm md:text-base">#</p>
							<p class="text-sm md:text-xl2">
								{values.rank}
							</p>
						</div>
					</td>
					<td>
						<AppCard app={values} showHeader={false} />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
