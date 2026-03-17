<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';

	type ExportRow = {
		key: 'appAdsTxt' | 'companyVerifiedAndroid' | 'companyVerifiedIos';
		name: string;
		available: boolean;
		url: string | null;
	};

	interface Props {
		data: {
			canDownload: boolean;
			companyName: string;
			downloadUrls: {
				appAdsTxt: string | null;
				companyVerifiedAndroid: string | null;
				companyVerifiedIos: string | null;
			} | null;
			exportStats: {
				appAdsTxt: { estimatedRows: number; available: boolean };
				companyVerifiedAndroid: { estimatedRows: number; available: boolean };
				companyVerifiedIos: { estimatedRows: number; available: boolean };
			};
		};
	}

	let { data }: Props = $props();

	let exportRows = $derived.by<ExportRow[]>(() => {
		const rows: ExportRow[] = [
			{
				key: 'appAdsTxt',
				name: 'App-ads.txt publishers (iOS + Android)',
				available: data.exportStats.appAdsTxt.available,
				url: data.downloadUrls?.appAdsTxt ?? null
			},
			{
				key: 'companyVerifiedAndroid',
				name: 'SDK/API traffic apps (Android)',
				available: data.exportStats.companyVerifiedAndroid.available,
				url: data.downloadUrls?.companyVerifiedAndroid ?? null
			},
			{
				key: 'companyVerifiedIos',
				name: 'SDK/API traffic apps (iOS)',
				available: data.exportStats.companyVerifiedIos.available,
				url: data.downloadUrls?.companyVerifiedIos ?? null
			}
		];

		return rows.filter((row) => row.available);
	});
</script>

<WhiteCard>
	{#snippet title()}
		<span>{data.companyName}'s Data Exports</span>
	{/snippet}
	<div class="p-4 flex flex-col gap-4">
		<p class="text-sm text-surface-600-400">
			Exports provide raw, analysis-ready datasets tied to this company so teams can run custom
			modeling, compliance checks, and longitudinal market tracking outside the dashboard.
		</p>

		{#if exportRows.length === 0}
			<p class="text-sm text-surface-600-400">
				No exports are currently available for this domain.
			</p>
		{:else}
			<div class="overflow-x-auto border border-surface-200-800 rounded-md">
				<table class="table w-full">
					<thead>
						<tr>
							<th class="text-left">Export</th>
							<th class="text-left">Download</th>
						</tr>
					</thead>
					<tbody>
						{#each exportRows as row}
							<tr>
								<td>{row.name}</td>
								<td>
									{#if data.canDownload && row.url}
										<a
											href={row.url}
											class="btn btn-sm preset-outlined-primary-100-900 p-0"
											target="_blank"
											rel="noopener noreferrer"
										>
											Download CSV
										</a>
									{:else}
										<a href="/pricing" class="btn btn-sm preset-outlined-primary-100-900 p-0">
											Unlock CSV
										</a>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			{#if !data.canDownload}
				<p class="text-surface-600-400 text-sm">
					Data exports are included with a paid subscription.
					<a href="/pricing" class="underline hover:text-primary-600-400">View pricing</a> to unlock.
				</p>
			{/if}
		{/if}
	</div>
</WhiteCard>
