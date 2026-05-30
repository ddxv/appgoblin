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

<section class="mx-2 md:mx-auto md:max-w-4xl space-y-4">
	<h2 class="h1">Data Exports</h2>
	<p class="text-base">
		Exports provide raw, analysis-ready datasets tied to this company so teams can run custom
		modeling, compliance checks, and longitudinal market tracking outside the dashboard.
	</p>

	<div class="p-4 grid gap-4">
		{#if exportRows.length === 0}
			<p class="text-base">No exports are currently available for this domain.</p>
		{:else}
			<section class="rounded-md border border-surface-200-800">
				<ul class="divide-y divide-surface-200-800">
					{#each exportRows as row}
						<li class="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div class="min-w-0">
								<p class="text-base font-medium leading-snug">{row.name}</p>
								<p class="text-xs opacity-70">CSV export</p>
							</div>
							<div class="shrink-0">
								{#if data.canDownload && row.url}
									<a
										href={row.url}
										class="btn btn-sm preset-outlined-primary-100-900"
										target="_blank"
										rel="noopener noreferrer"
									>
										Download CSV
									</a>
								{:else}
									<a href="/pricing" class="btn btn-sm preset-filled-primary-50-950">
										Get Premium Data
									</a>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</section>

			{#if !data.canDownload}
				<div class="p-3 bg-warning-50-950/20 rounded-lg border border-warning-800-200">
					<p class="text-sm text-warning-950-50 flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						Data exports are included with a paid subscription.
						<a href="/pricing" class="underline hover:text-primary-600-400">Upgrade</a>
						to unlock.
					</p>
				</div>
			{/if}
		{/if}
	</div>
</section>
