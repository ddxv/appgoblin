<script lang="ts">
	type DatasetVariant = 'verified-apps' | 'app-ads-txt';

	interface ColumnDef {
		name: string;
		type: string;
		description: string;
	}

	let {
		variant = 'verified-apps',
		companyName = '',
		showExampleLink = false
	}: {
		variant?: DatasetVariant;
		companyName?: string;
		showExampleLink?: boolean;
	} = $props();

	const datasetConfig = $derived.by(() => {
		if (variant === 'app-ads-txt') {
			return {
				title: 'App-Ads.txt Data — Column Reference',
				description: (name: string) =>
					name
						? `Each row in the ${name} CSV export represents an app-ads.txt record detected for this domain. A single app may have multiple rows — one per publisher-to-buyer relationship (DIRECT or RESELLER).`
						: 'Each row in the CSV export represents an app-ads.txt record detected for the queried domain. A single app may have multiple rows — one per publisher-to-buyer relationship (DIRECT or RESELLER).',
				exampleCsvPath: '/example-csvs/appgoblin_example_app_ads_txt.csv',
				infoCards: [
					{
						label: 'Coverage',
						text: 'Records from app-ads.txt files crawled across publisher domains, including both DIRECT and RESELLER relationships.'
					},
					{
						label: 'Update Cadence',
						text: 'Data is refreshed daily. Developer domains are aimed to be crawled weekly, with more precedence for active apps. Check the <code class="font-mono text-xs">developer_domain_crawled_at</code> column for per-domain freshness.'
					},
					{
						label: 'Relationship Types',
						text: 'DIRECT means the publisher authorizes the buyer directly. RESELLER means an intermediary is authorized.'
					}
				],
				columns: [
					{
						name: 'store',
						type: 'string',
						description: 'App store platform — "Android" (Google Play) or "iOS" (Apple App Store).'
					},
					{
						name: 'store_id',
						type: 'string',
						description:
							'Unique store identifier. For Android this is the package name. For iOS this is the Apple App Store ID.'
					},
					{
						name: 'app_name',
						type: 'string',
						description: 'Display name of the app as shown on the store listing.'
					},
					{
						name: 'app_category',
						type: 'string',
						description: 'Store category the app is listed under (e.g. game_casual, tools).'
					},
					{
						name: 'installs',
						type: 'number',
						description: 'Total historical install count reported by the store.'
					},
					{
						name: 'rating_count',
						type: 'number',
						description: 'Total number of user ratings the app has received.'
					},
					{
						name: 'monthly_installs',
						type: 'number',
						description: 'Estimated monthly install volume. Reflects recent acquisition velocity.'
					},
					{
						name: 'country',
						type: 'string',
						description:
							'ISO country code of the primary app store listing region (e.g. US, KR). May be blank for globally-listed apps.'
					},
					{
						name: 'market_status',
						type: 'string',
						description:
							'Current listing status on the store — PUBLISHED (still available) or REMOVED (no longer listed).'
					},
					{
						name: 'developer_domain_url',
						type: 'string',
						description:
							'Domain of the developer or publisher, as declared in the app-ads.txt file.'
					},
					{
						name: 'developer_id',
						type: 'string',
						description: 'Developer or publisher identifier as assigned by the app store.'
					},
					{
						name: 'publisher_id',
						type: 'string',
						description:
							'Publisher ID as declared in the app-ads.txt entry. This is the identifier the publisher uses to authorize buyers.'
					},
					{
						name: 'developer_name',
						type: 'string',
						description: 'Display name of the developer or publisher.'
					},
					{
						name: 'relationship',
						type: 'string',
						description:
							'App-ads.txt relationship type — DIRECT (publisher authorizes buyer directly) or RESELLER (intermediary authorized).'
					},
					{
						name: 'developer_domain_crawled_at',
						type: 'datetime',
						description:
							"Timestamp (UTC) of when the developer's app-ads.txt file was last crawled by AppGoblin."
					},
					{
						name: 'store_url',
						type: 'string',
						description: "Direct URL to the app's listing on Google Play or the Apple App Store."
					}
				]
			};
		}

		// Default: verified-apps
		return {
			title: 'SDK & API Verified Apps — Column Reference',
			description: (name: string) =>
				name
					? `Each row in the ${name} CSV export represents a mobile app detected with active SDK integrations or API signals tied to this company.`
					: 'Each row in the CSV export represents a mobile app detected with active SDK integrations or API signals tied to the queried company.',
			exampleCsvPath: '/example-csvs/appgoblin_example_verified_apps.csv',
			infoCards: [
				{
					label: 'Coverage',
					text: 'Apps detected via SDK runtime analysis and API network call fingerprinting.'
				},
				{
					label: 'Update Cadence',
					text: 'Data is refreshed daily. Apps are checked once a quarter for SDKs and APIs with precedence given to apps by size. Check the <code class="font-mono text-xs">sdk_successful_last_crawled</code> column.'
				},
				{
					label: 'Market Status',
					text: 'PUBLISHED apps are currently on the store. REMOVED apps are historical — useful for churn and retention analysis.'
				}
			],
			columns: [
				{
					name: 'store',
					type: 'string',
					description: 'App store platform — "Android" (Google Play) or "iOS" (Apple App Store).'
				},
				{
					name: 'store_id',
					type: 'string',
					description:
						'Unique store identifier. For Android this is the package name (e.g. com.example.app). For iOS this is the Apple App Store ID (e.g. 123456789).'
				},
				{
					name: 'app_name',
					type: 'string',
					description: 'Display name of the app as shown on the store listing.'
				},
				{
					name: 'app_category',
					type: 'string',
					description:
						'Store category the app is listed under (e.g. game_casual, tools, entertainment).'
				},
				{
					name: 'country',
					type: 'string',
					description:
						'ISO country code of the primary app store listing region (e.g. US, KR, JP). May be blank for globally-listed apps.'
				},
				{
					name: 'market_status',
					type: 'string',
					description:
						'Current listing status on the store — PUBLISHED (still available) or REMOVED (no longer listed).'
				},
				{
					name: 'developer_id',
					type: 'string',
					description: 'Developer or publisher identifier as assigned by the app store.'
				},
				{
					name: 'developer_name',
					type: 'string',
					description: 'Display name of the developer or publisher.'
				},
				{
					name: 'installs',
					type: 'number',
					description: 'Total historical install count reported by the store.'
				},
				{
					name: 'rating_count',
					type: 'number',
					description: 'Total number of user ratings the app has received.'
				},
				{
					name: 'monthly_ad_revenue',
					type: 'number',
					description:
						"Estimated monthly advertising revenue in USD. Based on AppGoblin's revenue model using ad impression and eCPM signals."
				},
				{
					name: 'monthly_iap_revenue',
					type: 'number',
					description:
						"Estimated monthly in-app purchase revenue in USD. Based on AppGoblin's IAP revenue estimation model."
				},
				{
					name: 'monthly_installs',
					type: 'number',
					description: 'Estimated monthly install volume. Reflects recent acquisition velocity.'
				},
				{
					name: 'sdk_successful_last_crawled',
					type: 'datetime',
					description:
						'Timestamp of the most recent successful SDK or API crawl for this app (UTC). Indicates data freshness.'
				},
				{
					name: 'store_url',
					type: 'string',
					description: "Direct URL to the app's listing on Google Play or the Apple App Store."
				}
			]
		};
	});

	let { title, description, exampleCsvPath, infoCards, columns } = $derived(datasetConfig);
</script>

<div class="rounded-lg border border-surface-200-800/70 p-5 space-y-4">
	<h3 class="text-lg font-bold">{title}</h3>
	<p class="text-sm opacity-80">
		{description(companyName)}
		The dataset covers both Android (Google Play) and iOS (Apple App Store) apps.
	</p>

	<!-- Data source overview -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
		{#each infoCards as card}
			<div class="preset-outlined-surface-100-900 p-3 rounded-md">
				<p class="font-semibold text-xs uppercase opacity-70">{card.label}</p>
				<p class="mt-1">{@html card.text}</p>
			</div>
		{/each}
	</div>

	<!-- Column definitions table -->
	<details class="group" open>
		<summary
			class="cursor-pointer text-sm font-semibold select-none list-none flex items-center gap-1"
		>
			<span class="transition-transform group-open:rotate-90 inline-block">▶</span>
			Column definitions ({columns.length})
		</summary>
		<div class="mt-3 overflow-x-auto">
			<table class="w-full text-sm border-collapse">
				<thead>
					<tr class="border-b border-surface-300-700">
						<th class="text-left py-2 pr-4 font-semibold w-44">Column</th>
						<th class="text-left py-2 pr-4 font-semibold w-20">Type</th>
						<th class="text-left py-2 font-semibold">Description</th>
					</tr>
				</thead>
				<tbody>
					{#each columns as col}
						<tr class="border-b border-surface-200-800/50 last:border-b-0">
							<td class="py-2 pr-4 align-top">
								<code class="font-mono text-xs">{col.name}</code>
							</td>
							<td class="py-2 pr-4 align-top">
								<code class="font-mono text-xs text-primary-800-200">{col.type}</code>
							</td>
							<td class="py-2 text-sm">{col.description}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</details>

	<!-- Example CSV link -->
	{#if showExampleLink}
		<div class="border-t border-surface-200-800/50 pt-4 flex flex-wrap items-center gap-3">
			<p class="text-sm">
				<span class="font-semibold">Want to see real data?</span> Download a sample CSV with example rows
				to preview the format before you export.
			</p>
			<a
				href={exampleCsvPath}
				class="btn preset-outlined-surface-100-900 p-2.5 text-sm whitespace-nowrap"
				target="_blank"
				rel="noopener noreferrer"
			>
				Download Example CSV
			</a>
		</div>
	{/if}
</div>
