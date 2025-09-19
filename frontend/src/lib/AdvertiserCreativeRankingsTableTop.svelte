<script lang="ts" generics="TData, TValue">
	import AppAdvertiserCard from './AppAdvertiserCard.svelte';
	import AppAdvertiserCreativeCarousel from './AppAdvertiserCreativeCarousel.svelte';

	let { data } = $props();
</script>

<div class="table-container">
	<div class="overflow-x-auto pl-0">
		<table class="table table-hover table-auto w-full border-separate border-spacing-y-4">
			<tbody>
				<!-- {#each data as row (row.id)} -->
				{#each Object.entries(data) as [_prop, row]}
					<tr class="px-0 text-sm md:text-base">
						<td>
							<AppAdvertiserCard app={row} size="md" />
						</td>

						<td>
							<AppAdvertiserCreativeCarousel data={row} size="md" />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
