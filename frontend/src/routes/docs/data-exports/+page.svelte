<script lang="ts">
	import DataExportColumnDocs from '$lib/components/docs/DataExportColumnDocs.svelte';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Database from '@lucide/svelte/icons/database';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Shield from '@lucide/svelte/icons/shield';
</script>

<svelte:head>
	<title>SDK &amp; API Verified Apps CSV Column Reference — AppGoblin</title>
	<meta
		name="description"
		content="Complete column reference for AppGoblin's SDK & API Verified Apps CSV exports. Understand every data field including installs, revenue estimates, SDK crawl timestamps, and market status."
	/>
	<meta
		name="keywords"
		content="data exports, csv column reference, sdk verified apps, api verified apps, appgoblin csv, app data export, mobile app dataset, b2b data export"
	/>
	<meta property="og:title" content="SDK & API Verified Apps CSV Column Reference — AppGoblin" />
	<meta
		property="og:description"
		content="Complete column reference for AppGoblin's SDK & API Verified Apps CSV exports."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/docs/data-exports" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/docs/data-exports" />
</svelte:head>

<div class="mx-2 md:mx-auto md:max-w-4xl space-y-8 py-4 md:py-8">
	<!-- Hero -->
	<div class="space-y-3">
		<p class="flex items-center gap-2 text-sm opacity-70">
			<BookOpen class="h-4 w-4" />
			Documentation
		</p>
		<h1 class="text-2xl md:text-3xl font-bold">SDK &amp; API Verified Apps — Data Export Guide</h1>
		<p class="text-base md:text-lg">
			Everything you need to know about the CSV exports available on company pages. AppGoblin
			provides two types of data exports — <strong>SDK & API Verified Apps</strong>
			and <strong>App-Ads.txt Data</strong>. Each available for Android and iOS.
		</p>
	</div>

	<!-- SDK & API Verified Apps section -->
	<section class="space-y-4">
		<h2 class="text-xl font-bold flex items-center gap-2">
			<Database class="h-5 w-5" />
			SDK &amp; API Verified Apps
		</h2>
		<p class="text-sm">
			The SDK &amp; API Verified Apps CSV contains every mobile app that AppGoblin has detected
			using a particular company's SDK or making API calls to that company's servers. This is the
			same data powering the SDK and API sections on company profile pages.
		</p>
		<p class="text-sm">
			Each row represents a single app on a single platform. The dataset includes currently-listed
			apps (<strong>PUBLISHED</strong>) and apps that have been removed (<strong>REMOVED</strong>),
			giving you a complete picture of the company's app ecosystem.
		</p>
		<DataExportColumnDocs variant="verified-apps" showExampleLink={true} />
	</section>

	<!-- App-Ads.txt section -->
	<section class="space-y-4">
		<h2 class="text-xl font-bold flex items-center gap-2">
			<Shield class="h-5 w-5" />
			App-Ads.txt Apps & Publisher IDs
		</h2>
		<p class="text-sm">
			The App-Ads.txt CSV contains all app-ads.txt records tied to the company's ad domain. Each row
			represents a single publisher-to-buyer relationship (DIRECT or RESELLER) for an app. A single
			app may have multiple rows if multiple relationships are declared.
		</p>
		<p class="text-sm">
			Use this dataset to map out supply path configurations, identify reseller chains, and audit
			programmatic relationships in the company's ad ecosystem.
		</p>
		<DataExportColumnDocs variant="app-ads-txt" showExampleLink={true} />
	</section>

	<!-- Access -->
	<section class="space-y-4">
		<h2 class="text-xl font-bold">Access</h2>
		<div class="preset-outlined-surface-100-900 p-4 rounded-lg space-y-3">
			<p class="text-sm">
				CSV exports are available on any company page under the <strong>Full Client App CSVs</strong
				>
				section. Access is included with <strong>B2B SDK Intelligence</strong> and
				<strong>Premium B2B</strong> plans.
			</p>
			<div class="flex flex-wrap gap-3">
				<a href="/pricing" class="btn preset-filled-primary-500 p-3 text-sm font-semibold">
					See Plans &amp; Pricing
					<ArrowRight class="h-4 w-4" />
				</a>
				<a href="/companies" class="btn preset-outlined-surface-100-900 p-3 text-sm">
					Browse Companies
				</a>
			</div>
		</div>
	</section>

	<!-- Cross-link to API docs -->
	<div class="border-t border-surface-200-800/50 pt-6">
		<div class="preset-tonal p-4 rounded-lg flex flex-wrap items-center gap-3">
			<p class="text-sm">
				<strong>Need the API reference?</strong> AppGoblin's programmatic API lets you query the same
				data in real time — no CSV downloads needed.
			</p>
			<a
				href="/api-docs"
				class="btn preset-outlined-surface-100-900 p-2.5 text-sm whitespace-nowrap"
			>
				API &amp; MCP Docs
				<ArrowRight class="h-4 w-4" />
			</a>
		</div>
	</div>
</div>
