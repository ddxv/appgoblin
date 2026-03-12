<script lang="ts">
	import AppRankTableShort from '$lib/AppRankTableShort.svelte';
	import CompaniesBarChart from '$lib/CompaniesBarChart.svelte';
	import AdvertiserCreativeRankingsTableTop from '$lib/AdvertiserCreativeRankingsTableTop.svelte';
	import { formatNumber } from '$lib/utils/formatNumber.js';

	let { data } = $props();

	const description =
		'Mobile app and ad intelligence platform with free ASO tools, SDK and API analysis, app-ads.txt intelligence, and paid data exports for growth, sales prospecting, and fraud detection teams.';

	const title = 'AppGoblin Free App Marketing Tools';

	const featureBulletClass = 'text-sm md:text-lg font-medium';
	const sectionTitleClass = 'text-2xl font-black text-primary-900-100 transition-colors';
	const sectionSubtitleClass = 'text-gray-400 font-medium';
	const sectionDescriptionClass = 'mb-6';
	const cardContainerClass = 'p-4';
	const cardTitleClass = 'text-lg font-bold text-primary-900-100 transition-colors';
	const cardDescriptionClass = 'text-sm text-gray-400 mb-4';
	const iconContainerClass = 'p-2 rounded-lg mr-3';
	const buttonTextColor = 'text-black';
	const gradientButtonClass =
		'bg-gradient-to-r text-white font-bold px-6 py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow';

	// Get current month and year for display
	const now = new Date();
	const monthYear = now.toLocaleString('default', { month: 'long', year: 'numeric' });

	const audiences = [
		{
			title: 'App & Game Developers',
			description:
				'Grow your app with free ASO tools, keyword tracking, rankings data, and competitor SDK analysis.',
			badge: 'Growth'
		},
		{
			title: 'Ad Sales Teams',
			description:
				'Prospect clients by analyzing which apps use your target ad networks, mediation platforms, and analytics providers.',
			badge: 'Sales'
		},
		{
			title: 'Ad Networks & DSPs',
			description:
				'Perform fraud detection by auditing SDK integrations and validating app-ads.txt supply-path data across millions of apps.',
			badge: 'Fraud Detection'
		},
		{
			title: 'DSPs — App-Ads.txt Verification',
			description:
				'Map app-ads.txt DIRECT and RESELLER entries to real app store IDs (e.g. com.example.app) rather than just domain names.',
			badge: 'Verification'
		},
		{
			title: 'Researchers & Journalists',
			description:
				'Deep technical analysis across millions of apps — SDKs, API calls, and data security patterns at scale.',
			badge: 'Research'
		},
		{
			title: 'Competitor Researchers',
			description:
				"Track which SDKs competitors are adopting, how fast they're growing, and who their top app clients are.",
			badge: 'Intelligence'
		},
		{
			title: 'Privacy Advocates',
			description:
				'Identify hidden trackers, ad-tech domains, and SDK networks embedded in popular apps.',
			badge: 'Privacy'
		}
	];
</script>

<svelte:head>
	<!-- Title -->
	<title>{title}</title>

	<!-- Standard meta tags -->
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="app, aso, app competitor analysis, ad creatives, ios, android, marketing, advertising, analytics, keyword analytics,  Google Play data, app data, app rankings, download statistics, competitor analysis, mobile app insights, app store intelligence"
	/>

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />

	<!-- Additional meta tags -->
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info" />
</svelte:head>

<div class="flex flex-col gap-8 px-2 md:px-20 lg:px-48">
	<!-- Hero Header Section -->
	<section class="text-center mt-8 mb-8 space-y-4">
		<h1 class="text-5xl md:text-7xl text-primary-900-100 font-bold mb-4">AppGoblin</h1>
		<h2 class="text-xl md:text-2xl font-bold text-primary mb-4">
			Free App Marketing Insights and Research
		</h2>
		<p class="text-lg md:text-xl max-w-3xl mb-6 text-primary-900-100 mx-auto">
			Real time app intelligence • Live advertising data • Competitor insights
		</p>
		<div class="flex flex-wrap justify-center gap-4 text-sm text-primary-900-100 mb-6">
			<span class="px-3 py-1 bg-primary-100-900/20 rounded-full">⚡ Real-time Data</span>
			<span class="px-3 py-1 bg-warning-100-900/20 rounded-full">🚀 Free Reports</span>
			<span class="px-3 py-1 bg-success-100-900/20 rounded-full">✨ Ad and Creative Insights</span>
		</div>
		<p class="text-base md:text-lg max-w-2xl mx-auto">
			AppGoblin is a free resource for app marketers, developers, and researchers. Analyze
			<span class="font-bold text-success-900-100"
				>{formatNumber(data.appsOverview.android_apps)}</span
			>
			Android apps and
			<span class="font-bold text-success-900-100">{formatNumber(data.appsOverview.ios_apps)}</span>
			iOS apps, track ad buyers, SDKs, and more.
		</p>

		<div class="items-center">
			<div class="flex flex-col gap-4 items-center">
				<div class="flex flex-wrap items-center justify-center gap-3">
					<a
						href="/auth/signup"
						class="btn-primary inline-flex items-center gap-2 px-6 py-3 bg-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
					>
						<span class="text-black font-bold">Create Free Account</span>
						<span class="text-black font-bold">→</span>
					</a>
					<a
						href="mailto:contact@appgoblin.info"
						class="btn preset-outlined-primary-100-900 inline-flex items-center gap-2 px-6 py-3 rounded-lg"
					>
						<span class="font-bold text-white">Get in Touch</span>
					</a>
				</div>
				<div class="text-white/80 text-sm pt-1">
					Free demo & walkthroughs: <p>contact@appgoblin.info</p>
				</div>
			</div>
		</div>
	</section>

	<section
		class="card preset-tonal p-4 md:p-8 rounded-2xl shadow-xl border border-secondary-900-100/20"
	>
		<div class="flex items-center mb-6">
			<div
				class="bg-gradient-to-br from-secondary-900-100 to-secondary-600 p-4 rounded-2xl shadow-lg mr-4"
			>
				<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
					/>
				</svg>
			</div>
			<div>
				<h2 class={sectionTitleClass}>Features & Who It's For</h2>
				<p class={sectionSubtitleClass}>Mobile app intelligence across SDK, API, ads, and ASO</p>
			</div>
		</div>

		<p class={sectionDescriptionClass}>
			AppGoblin is a free resource for mobile app marketers, sales teams, and researchers. Paid
			export-ready datasets are also available for teams that need raw data for custom analysis.
		</p>

		<h3 class="text-lg font-bold text-primary-900-100 mb-3">Features</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold text-primary-900-100 mb-2">
					<a href="/" class="hover:text-primary-600-400">App Intelligence</a>
				</h4>
				<p class="text-sm text-gray-300 mb-3">Data on 4M+ iOS and Android apps, updated daily.</p>
				<ul class="text-sm space-y-1.5 text-gray-400">
					<li>
						<span class="text-white/80 font-medium">Keywords</span> — Track your or competitors' keywords
						and the top ranking apps
					</li>
					<li>
						<span class="text-white/80 font-medium">Trends</span> — Track installs and ratings over time
					</li>
					<li>
						<span class="text-white/80 font-medium">Rankings</span> — Daily tracking from Google Play
						and the App Store
					</li>
					<li>
						<span class="text-white/80 font-medium">New Apps Discovery</span> — Surfaces newly released
						apps buried by store algorithms
					</li>
					<li>
						<span class="text-white/80 font-medium">Growth Metrics</span> — Daily install estimates and
						rating change tracking
					</li>
				</ul>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold text-primary-900-100 mb-2">
					<a href="/sdks" class="hover:text-primary-600-400">SDK Analysis</a>
				</h4>
				<p class="text-sm text-gray-300">
					Detailed breakdown of SDKs found in decompiled Android and iOS apps — advertising,
					analytics, and open-source libraries to see what any app is really running.
				</p>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold text-primary-900-100 mb-2">
					<a href="/companies" class="hover:text-primary-600-400">Companies Directory</a>
				</h4>
				<p class="text-sm text-gray-300 mb-3">
					Rankings of mobile app companies by SDK integration frequency, filterable by app category.
				</p>
				<div class="flex flex-wrap gap-2">
					<a
						href="/companies/types/ad-networks/game_casino"
						class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
						>Ad Networks for Casino Games →</a
					>
					<a
						href="/companies/types/product-analytics/business"
						class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
						>Product Analytics for Business Apps →</a
					>
				</div>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold text-primary-900-100 mb-2">Company Intelligence</h4>
				<p class="text-sm text-gray-300 mb-3">
					See the top client apps for any mobile SDK or services company.
				</p>
				<div class="flex flex-wrap gap-2">
					<a
						href="/companies/salesforce.com"
						class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
						>Salesforce Clients →</a
					>
					<a
						href="/companies/appsflyer.com"
						class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
						>AppsFlyer Top Apps →</a
					>
				</div>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold text-primary-900-100 mb-2">Ad Tech Insights</h4>
				<p class="text-sm text-gray-300">
					Tracks live ad campaigns and the ad tech domains apps communicate with in real time.
				</p>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold text-primary-900-100 mb-2">ASO Tools</h4>
				<p class="text-sm text-gray-300">
					Free keyword research tools and data dumps to optimize app store visibility for Android
					and iOS.
				</p>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5 md:col-span-2">
				<h4 class="font-bold text-primary-900-100 mb-2">App-Ads.txt</h4>
				<p class="text-sm text-gray-300">
					Daily-updated files tying apps to their DIRECT and RESELLER ad networks and SSPs — mapped
					to real app store IDs (e.g. <code class="text-white/70">com.example.app</code>) rather
					than just domain names, for supply-path analysis and fraud detection.
				</p>
			</div>
		</div>

		<h3 class="text-lg font-bold text-primary-900-100 mb-3">Who It's For</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
			{#each audiences as audience}
				<div class="rounded-xl border border-white/10 p-4 bg-white/5">
					<div class="flex items-start justify-between mb-2">
						<h4 class="text-sm md:text-base font-bold text-primary-900-100">{audience.title}</h4>
						<span
							class="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-white/90 ml-2 shrink-0"
							>{audience.badge}</span
						>
					</div>
					<p class="text-sm text-gray-300">{audience.description}</p>
				</div>
			{/each}
		</div>

		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
			<div class="flex gap-4">
				<span class={featureBulletClass}>🔎 4M+ app coverage</span>
				<span class={featureBulletClass}>🧩 SDK and API intelligence</span>
				<span class={featureBulletClass}>🛡️ App-ads.txt verification</span>
			</div>
			<a
				href="/companies"
				class="{gradientButtonClass} from-secondary-700-300 to-secondary-900-100 text-black"
			>
				<span class={buttonTextColor}>Start With Company Intelligence →</span>
			</a>
		</div>
	</section>

	<!-- Top Advertiser Section -->
	<section
		class="card preset-tonal p-4 md:p-8 rounded-2xl shadow-xl border border-success-900-100/20"
	>
		<div class="flex items-center mb-6">
			<div
				class="bg-gradient-to-br from-success-900-100 to-success-600 p-4 rounded-2xl shadow-lg mr-4"
			>
				<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
					/>
				</svg>
			</div>
			<div>
				<h2 class={sectionTitleClass}>{monthYear} Top Android Advertiser</h2>
				<p class={sectionSubtitleClass}>Live advertising intelligence</p>
			</div>
		</div>

		<p class={sectionDescriptionClass}>
			AppGoblin tracks who is currently spending on mobile ads. See the biggest mobile ad buyers
			this month, their creatives, and the ad networks they use. Data is collected from live ad
			requests sent from apps.
		</p>

		{#if data.topAdvertisers && data.topAdvertisers.length > 0}
			<div class="mb-6 md:p-4">
				<AdvertiserCreativeRankingsTableTop data={data.topAdvertisers.slice(0, 1)} />
			</div>
		{/if}

		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
			<div class="flex gap-4">
				<span class={featureBulletClass}>📱 Mobile ad tracking</span>
				<span class={featureBulletClass}>🎨 Creative analysis</span>
				<span class={featureBulletClass}>📊 Network insights</span>
			</div>
			<a
				href="/ad-creatives"
				class="{gradientButtonClass} from-success-700-300 to-success-900-100 text-black"
			>
				<span class={buttonTextColor}>Browse All Ad Buyers →</span>
			</a>
		</div>
	</section>

	<!-- Popular Companies/SDKs Section -->
	<section
		class="card preset-tonal p-1 md:p-8 rounded-2xl shadow-xl border border-primary-900-100/20"
	>
		<div class="flex items-center mb-6">
			<div class="bg-gradient-to-br from-primary-900-100 to-primary-600 rounded-2xl shadow-lg mr-4">
				<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
			</div>
			<div>
				<h2 class={sectionTitleClass}>Most Popular SDKs & Analytics</h2>
				<p class={sectionSubtitleClass}>Mobile SDK intelligence</p>
			</div>
		</div>

		<p class={sectionDescriptionClass}>
			Explore top ad networks, MMPs, analytics, and developer tools used in mobile apps, then drill
			down into company pages for SDK footprint, API behavior, app-ads.txt links, and category-level
			adoption trends.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 md:gap-8 mb-6">
			<div class={cardContainerClass}>
				<div class="flex items-center mb-3">
					<div class="bg-gradient-to-br from-purple-500 to-purple-600 {iconContainerClass}">
						<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<a href="/companies/types/ad-attribution">
						<h4 class="{cardTitleClass} ">MMPs</h4>
					</a>
				</div>
				<p class={cardDescriptionClass}>
					Top MMPs and mobile app tracking companies in Android and iOS apps.
				</p>
				{#if data.topCompanies.attribution}
					<CompaniesBarChart plotData={data.topCompanies.attribution.sdk_ios} />
				{/if}
			</div>
			<div class={cardContainerClass}>
				<div class="flex items-center mb-3">
					<div class="bg-gradient-to-br from-green-500 to-green-600 {iconContainerClass}">
						<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<a href="/companies/types/product-analytics">
						<h4 class="{cardTitleClass} hover:text-green-400">Product Analytics</h4>
					</a>
				</div>
				<p class={cardDescriptionClass}>
					Most popular product analytics companies and open source libraries based on SDKs in iOS
					and Android apps.
				</p>
				{#if data.topCompanies.analytics}
					<CompaniesBarChart plotData={data.topCompanies.analytics.sdk_ios} />
				{/if}
			</div>
		</div>

		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
			<div class="flex gap-4">
				<span class={featureBulletClass}>🔍 SDK detection</span>
				<span class={featureBulletClass}>📈 Market share analytics</span>
				<span class={featureBulletClass}>🏢 Company profiles</span>
			</div>
			<a
				href="/companies"
				class="{gradientButtonClass} from-primary-700-300 to-primary-900-100 text-black"
			>
				<span class={buttonTextColor}>Browse 500+ Companies →</span>
			</a>
		</div>
	</section>

	<!-- App Store Rankings Section -->
	<section
		class="card preset-tonal p-1 md:p-4 md:p-8 rounded-2xl shadow-xl border border-warning-900-100/20"
	>
		<div class="flex items-center mb-6">
			<div
				class="bg-gradient-to-br from-warning-900-100 to-warning-600 p-1 md:p-4 rounded-2xl shadow-lg mr-4"
			>
				<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
					/>
				</svg>
			</div>
			<div>
				<h2 class={sectionTitleClass}>Today's App Store Rankings</h2>
				<p class={sectionSubtitleClass}>Live app store data</p>
			</div>
		</div>

		<p class={sectionDescriptionClass}>
			See the latest app store rankings for Android and iOS. Click through for full categories and
			details.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
			<div class={cardContainerClass}>
				<div class="flex items-center mb-3">
					<div class="bg-gradient-to-br from-green-500 to-green-600 {iconContainerClass}">
						<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<a href="/rankings/store/1/collection/1/category/1/US">
						<h3 class="{cardTitleClass} hover:text-green-400">Android Apps</h3>
					</a>
				</div>
				{#if data.androidAppRanks}
					<AppRankTableShort myTable={data.androidAppRanks} />
				{/if}
			</div>
			<div class={cardContainerClass}>
				<div class="flex items-center mb-3">
					<div class="bg-gradient-to-br from-green-500 to-green-600 {iconContainerClass}">
						<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<a href="/rankings/store/1/collection/1/category/36/US">
						<h3 class="{cardTitleClass} hover:text-green-400">Android Games</h3>
					</a>
				</div>
				{#if data.androidGameRanks}
					<AppRankTableShort myTable={data.androidGameRanks} />
				{/if}
			</div>
			<div class={cardContainerClass}>
				<div class="flex items-center mb-3">
					<div class="bg-gradient-to-br from-gray-500 to-gray-600 {iconContainerClass}">
						<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
							/>
						</svg>
					</div>
					<a href="/rankings/store/2/collection/4/category/120/US">
						<h3 class="{cardTitleClass} hover:text-gray-400">iOS Apps</h3>
					</a>
				</div>
				{#if data.iOSAppRanks}
					<AppRankTableShort myTable={data.iOSAppRanks} />
				{/if}
			</div>
			<div class={cardContainerClass}>
				<div class="flex items-center mb-3">
					<div class="bg-gradient-to-br from-gray-500 to-gray-600 {iconContainerClass}">
						<svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<a href="/rankings/store/2/collection/4/category/62/US">
						<h3 class="{cardTitleClass} hover:text-gray-400">iOS Games</h3>
					</a>
				</div>
				{#if data.iOSGameRanks}
					<AppRankTableShort myTable={data.iOSGameRanks} />
				{/if}
			</div>
		</div>

		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
			<div class="flex gap-4">
				<span class={featureBulletClass}>📱 Real-time rankings</span>
				<span class={featureBulletClass}>🌍 Global + country data</span>
				<span class={featureBulletClass}>📈 Historical tracking</span>
			</div>
			<a
				href="/rankings/store/1/collection/1/category/1/US"
				class="{gradientButtonClass} from-warning-700-300 to-warning-900-100 text-black"
			>
				<span class={buttonTextColor}>See All Rankings →</span>
			</a>
		</div>
	</section>

	<!-- New Apps Section -->
	<section class="card preset-tonal p-8 rounded-2xl shadow-xl border border-info-900-100/20">
		<div class="flex items-center mb-6">
			<div class="bg-gradient-to-br from-info-900-100 to-info-600 p-4 rounded-2xl shadow-lg mr-4">
				<svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			</div>
			<div>
				<h2 class={sectionTitleClass}>Discover New Apps</h2>
				<p class={sectionSubtitleClass}>Latest releases & trending apps</p>
			</div>
		</div>

		<p class="{sectionDescriptionClass} mb-8">
			Discover trending new apps across Google Play and the App Store. Track the latest releases and
			find emerging apps before they become mainstream.
		</p>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			<a href="/collections/new_weekly/google/overall" class="group/card">
				<div
					class="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-info-900-100/50 hover:bg-white/10 transition-all duration-300"
				>
					<div class="flex items-center mb-4">
						<div class="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-lg mr-4 shrink-0">
							<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<div>
							<h3
								class="text-lg font-bold text-primary-900-100 group-hover/card:text-cyan-400 transition-colors"
							>
								This Week
							</h3>
							<p class="text-sm text-gray-500">Newest releases</p>
						</div>
					</div>
				</div>
			</a>
			<a href="/collections/new_monthly/google/overall" class="group/card">
				<div
					class="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-info-900-100/50 hover:bg-white/10 transition-all duration-300"
				>
					<div class="flex items-center mb-4">
						<div
							class="bg-gradient-to-br from-info-900-100 to-info-600 p-3 rounded-lg mr-4 shrink-0"
						>
							<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<div>
							<h3
								class="text-lg font-bold text-primary-900-100 group-hover/card:text-info-900-100 transition-colors"
							>
								This Month
							</h3>
							<p class="text-sm text-gray-500">Popular releases</p>
						</div>
					</div>
				</div>
			</a>
			<a href="/collections/new_yearly/google/overall" class="group/card">
				<div
					class="p-6 bg-white/5 rounded-xl border border-white/10 hover:border-info-900-100/50 hover:bg-white/10 transition-all duration-300"
				>
					<div class="flex items-center mb-4">
						<div
							class="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 rounded-lg mr-4 shrink-0"
						>
							<svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
								/>
							</svg>
						</div>
						<div>
							<h3
								class="text-lg font-bold text-primary-900-100 group-hover/card:text-yellow-400 transition-colors"
							>
								2025 Best
							</h3>
							<p class="text-sm text-gray-500">Top of the year</p>
						</div>
					</div>
				</div>
			</a>
		</div>

		<div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
			<div class="flex gap-4">
				<span class={featureBulletClass}>📱 Cross-platform tracking</span>
				<span class={featureBulletClass}>📈 Trending analysis</span>
				<span class={featureBulletClass}>🎯 Category insights</span>
			</div>
			<a
				href="/collections/new_monthly/google/overall"
				class="{gradientButtonClass} from-info-900-100 to-info-600"
			>
				<span class={buttonTextColor}>Explore New Apps →</span>
			</a>
		</div>
	</section>
</div>
