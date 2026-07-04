<script lang="ts">
	import type { UnknownSDKs } from '../types';

	interface Props {
		items: UnknownSDKs;
	}

	let { items = {} }: Props = $props();

	let sortedEntries = $derived(
		Object.entries(items)
			.map(
				([domain, xmlPaths]) =>
					[
						domain,
						Object.entries(xmlPaths)
							.map(([xmlPath, values]) => [xmlPath, [...values].sort()] as const)
							.sort(([a], [b]) => a.localeCompare(b))
					] as const
			)
			.sort(([a], [b]) => {
				const aIsRaw = a === 'Raw Resources';
				const bIsRaw = b === 'Raw Resources';
				if (aIsRaw && !bIsRaw) return 1;
				if (!aIsRaw && bIsRaw) return -1;
				return a.localeCompare(b);
			})
	);
</script>

<div class="max-w-sm lg:max-w-full overflow-x-scroll">
	{#if Object.keys(items).length > 0}
		<table class="table">
			<thead>
				<tr>
					<th class="text-left p-2">Domain</th>
					<th class="text-left p-2">XML Path</th>
					<th class="text-left p-2">Value Name</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedEntries as [domain, xmlPaths]}
					{#each xmlPaths as [xmlPath, values]}
						<tr>
							<td class="p-2">{domain.slice(0, 100)}</td>
							<td class="p-2">{xmlPath}</td>
							<td class="p-2">
								{#each values.slice(0, 5) as value}
									<div>
										{#if xmlPath.includes('res.raw')}
											{value.slice(0, 100)}
										{:else}
											<a href="/sdks/{value}" rel="nofollow">{value.slice(0, 100)}</a>
										{/if}
									</div>
								{/each}
								{#if values.length > 5}
									<div class="text-surface-500-400 text-xs mt-1">
										... and {values.length - 5} more
									</div>
								{/if}
							</td>
						</tr>
					{/each}
				{/each}
			</tbody>
		</table>
	{/if}
</div>
