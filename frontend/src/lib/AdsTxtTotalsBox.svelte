<script lang="ts">
	import { formatNumberLocale } from '$lib/utils/formatNumber';

	const titleFont = 'text-xl text-primary-900-100 tracking-wide';

	const rowTitleFont = 'text-sm text-primary-800-200 tracking-wide';

	let { myTotals } = $props();
</script>

<div class="table-container p-4">
	<div class={titleFont}>Ads.txt (direct)</div>
	<table class="table w-full">
		<thead>
			<tr>
				<th class="text-left py-2 px-1"></th>
				<th class="text-left py-2 px-1">Android</th>
				<th class="text-left py-2 px-1">iOS</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="py-2 px-1 {rowTitleFont}">Pub IDs</td>
				<td class="py-2 px-1">
					{#if myTotals.google.direct.publisher_id_count}
						{formatNumberLocale(myTotals.google.direct.publisher_id_count)}
					{:else}
						<p class="text-sm">No Direct Pub IDs</p>
					{/if}
				</td>
				<td class="py-2 px-1">
					{#if myTotals.apple && myTotals.apple.direct.publisher_id_count}
						{formatNumberLocale(myTotals.apple.direct.publisher_id_count)}
					{:else}
						<p class="text-sm">No Direct Pub IDs</p>
					{/if}
				</td>
			</tr>
			<tr>
				<td class="py-2 px-1 {rowTitleFont}">Developers</td>
				<td class="py-2 px-1">
					{#if myTotals.google.direct.developer_count}
						{formatNumberLocale(myTotals.google.direct.developer_count)}
					{:else}
						<p class="text-sm">No Direct Developers</p>
					{/if}
				</td>
				<td class="py-2 px-1">
					{#if myTotals.apple && myTotals.apple.direct.developer_count}
						{formatNumberLocale(myTotals.apple.direct.developer_count)}
					{:else}
						<p class="text-sm">No Direct Developers</p>
					{/if}
				</td>
			</tr>
			<tr>
				<td class="py-2 px-1 {rowTitleFont}">Related Apps</td>
				<td class="py-2 px-1">
					{#if myTotals.google && myTotals.google.direct}
						{formatNumberLocale(myTotals.google.direct.app_count)}
					{:else}
						<p class="text-sm">No Direct Apps</p>
					{/if}
				</td>
				<td class="py-2 px-1">
					{#if myTotals.apple && myTotals.apple.direct}
						{formatNumberLocale(myTotals.apple.direct.app_count)}
					{:else}
						<p class="text-sm">No Direct Apps</p>
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</div>
<div class="table-container p-4">
	<div class={titleFont}>Ads.txt (reseller)</div>
	<table class="table w-full">
		<thead>
			<tr>
				<th class="text-left py-2 px-1"></th>
				<th class="text-left py-2 px-1">Android</th>
				<th class="text-left py-2 px-1">iOS</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="py-2 px-1 {rowTitleFont}">Related Apps</td>
				<td class="py-2 px-1">
					{#if myTotals.google && myTotals.google.reseller}
						{formatNumberLocale(myTotals.google.reseller.app_count)}
					{:else}
						<p class="text-sm">No Reseller Apps</p>
					{/if}
				</td>
				<td class="py-2 px-1">
					{#if myTotals.apple && myTotals.apple.reseller}
						{formatNumberLocale(myTotals.apple.reseller.app_count)}
					{:else}
						<p class="text-sm">No Reseller Apps</p>
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</div>
