<script lang="ts">
	let {
		sdkVersionSummary
	}: {
		sdkVersionSummary: {
			latest_sdk_downloaded_at: string | null;
			latest_sdk_scanned_at: string | null;
			latest_sdk_version_code: string | number | null;
		};
	} = $props();

	function formatDateTime(date: string | null): string {
		if (!date) return '—';
		return new Date(date).toLocaleString();
	}
</script>

<div class="overflow-x-auto rounded-lg border border-surface-200-800">
	<table class="w-full text-left text-sm">
		<caption class="sr-only">Latest SDK scan information</caption>
		<thead class="bg-surface-100-900">
			<tr>
				<th class="px-4 py-3 font-medium">Latest SDK version</th>
				<th class="px-4 py-3 font-medium">Downloaded at</th>
				<th class="px-4 py-3 font-medium">SDKs scanned at</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="px-4 py-3 font-mono">{sdkVersionSummary.latest_sdk_version_code ?? '—'}</td>
				<td class="px-4 py-3">{formatDateTime(sdkVersionSummary.latest_sdk_downloaded_at)}</td>
				<td class="px-4 py-3">{formatDateTime(sdkVersionSummary.latest_sdk_scanned_at)}</td>
			</tr>
		</tbody>
	</table>
</div>
