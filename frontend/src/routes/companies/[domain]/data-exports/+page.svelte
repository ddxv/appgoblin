<script lang="ts">
	interface Props {
		data: {
			canDownload: boolean;
			companyName: string;
			downloadUrls: {
				appAdsTxt: string | null;
				companyVerifiedAndroid: string | null;
				companyVerifiedIos: string | null;
			} | null;
			hasAdstxtData: boolean;
			hasAndroidData: boolean;
			hasIosData: boolean;
		};
	}

	let { data }: Props = $props();

	let exportRows = $derived(
		[
			{
				key: 'appAdsTxt',
				label: 'App-Ads.txt Supply Network',
				platform: 'Cross-Platform',
				signalDepth: 'Direct & Reseller Publisher IDs',
				url: data.downloadUrls?.appAdsTxt ?? null,
				available: data.hasAdstxtData
			},
			{
				key: 'companyVerifiedAndroid',
				label: 'Active Engine Footprint (Android)',
				platform: 'Android',
				signalDepth: 'Active SDK Runtime & API Signals',
				url: data.downloadUrls?.companyVerifiedAndroid ?? null,
				available: data.hasAndroidData
			},
			{
				key: 'companyVerifiedIos',
				label: 'Active Engine Footprint (iOS)',
				platform: 'iOS',
				signalDepth: 'Active SDK Runtime & API Signals',
				url: data.downloadUrls?.companyVerifiedIos ?? null,
				available: data.hasIosData
			}
		].filter((r) => r.available)
	);

	let hasAnyExports = $derived(data.hasAdstxtData || data.hasAndroidData || data.hasIosData);
</script>

<svelte:head>
	<title>{data.companyName} Data Exports — AppGoblin</title>
	<meta
		name="description"
		content="Download the complete {data.companyName} market footprint — SDK adoption, API signals, and app-ads.txt records. Analysis-ready data for B2B prospecting, compliance, and competitive intelligence."
	/>
</svelte:head>

<section class="mx-2 md:mx-auto md:max-w-4xl space-y-8">
	<h1 class="h1">{data.companyName} Raw Client App Lists</h1>

	<p class="text-base md:text-lg max-w-3xl">
		Export the market footprint of {data.companyName}. Identify publishers and build high-value
		prospecting pipelines with raw, analysis-ready data.
	</p>

	<!-- Value Propositions -->
	<section class="space-y-6">
		<h2 class="text-xl font-bold">What this data does for you</h2>

		<div class="space-y-5">
			<div>
				<h3 class="font-semibold">Sales Prospecting</h3>
				<p class="text-sm opacity-80">
					Stop guessing who uses {data.companyName}. Get a clean list of iOS and Android apps with
					active {data.companyName} SDK integrations or API signals. Target accounts that are already
					monetizing heavily and prime for a competitive pitch.
				</p>
			</div>

			<div>
				<h3 class="font-semibold">Audit Supply-Side Relationships via App-Ads.txt</h3>
				<p class="text-sm opacity-80">
					Map out {data.companyName}'s direct and reseller supply path configurations to identify
					programmatic arbitrage opportunities or compliance risks.
				</p>
			</div>
		</div>
	</section>

	<!-- How Teams Deploy -->
	<section class="space-y-4">
		<h2 class="text-xl font-bold">How teams deploy this data</h2>
		<ul class="space-y-3">
			<li class="pl-2">
				<p class="font-semibold">Competitor Analysis</p>
				<p class="text-sm opacity-80">
					Pinpoint publishers reliant on {data.companyName}.
				</p>
			</li>
			<li class="pl-2">
				<p class="font-semibold">Corporate Development, VC and Hedge Funds</p>
				<p class="text-sm opacity-80">
					Run longitudinal tracking on {data.companyName}'s market share growth or contraction
					across specific app categories to validate investment theses.
				</p>
			</li>
			<li class="pl-2">
				<p class="font-semibold">Data Products & Analytics Platforms</p>
				<p class="text-sm opacity-80">
					Feed this raw footprint into your own proprietary enterprise dashboards or enrichment
					engines via the <a href="/api-docs" class="underline hover:text-primary-600-400"
						>AppGoblin API</a
					>.
				</p>
			</li>
		</ul>
	</section>

	<!-- Available Datasets -->
	{#if !hasAnyExports}
		<section class="rounded-lg border border-surface-200-800/70 p-6 text-center">
			<p class="text-base opacity-70">No exports are currently available for this domain.</p>
		</section>
	{:else}
		<section class="space-y-4">
			<h2 class="text-xl font-bold">Available Datasets</h2>
			<div class="overflow-x-auto rounded-lg border border-surface-200-800/70">
				<table class="table w-full">
					<thead>
						<tr class="border-b border-surface-200-800/50">
							<th class="text-left py-3 px-4 text-sm font-semibold">Dataset</th>
							<th class="text-left py-3 px-4 text-sm font-semibold">Platform</th>
							<th class="text-left py-3 px-4 text-sm font-semibold">Signal Depth</th>
							<th class="text-center py-3 px-4 text-sm font-semibold">Format</th>
							<th class="text-right py-3 px-4"></th>
						</tr>
					</thead>
					<tbody>
						{#each exportRows as row}
							<tr class="border-b border-surface-200-800/30 last:border-b-0">
								<td class="py-3 px-4 text-sm font-medium">{row.label}</td>
								<td class="py-3 px-4 text-sm opacity-70">{row.platform}</td>
								<td class="py-3 px-4 text-sm opacity-70">{row.signalDepth}</td>
								<td class="py-3 px-4 text-sm text-center opacity-70">CSV</td>
								<td class="py-3 px-4 text-right">
									{#if data.canDownload && row.url}
										<a
											href={row.url}
											class="btn preset-filled-primary-500 p-3 text-sm"
											target="_blank"
											rel="noopener noreferrer"
										>
											Download CSV
										</a>
									{:else}
										<a href="/pricing" class="btn preset-filled-primary-500 p-3 text-sm">
											Get B2B Intelligence
										</a>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>

		{#if !data.canDownload}
			<div class="rounded-lg border border-surface-200-800/70 p-5 space-y-4">
				<p class="text-sm opacity-80 max-w-2xl">
					Data exports are included with B2B SDK Intelligence and Premium plans. This data is also
					available programmatically via the
					<a href="/api-docs" class="underline hover:text-primary-600-400">AppGoblin API</a>.
				</p>
				<div class="flex flex-wrap gap-3">
					<a href="/pricing" class="btn preset-filled-primary-500 p-3 font-semibold">
						See Plans &amp; Pricing
					</a>
					<a href="/contact" class="btn preset-outlined-surface-100-900 p-3"> Contact Sales </a>
				</div>
			</div>
		{/if}
	{/if}
</section>
