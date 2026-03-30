<script lang="ts">
	import AppRankTableShort from '$lib/AppRankTableShort.svelte';
	import CompaniesBarChart from '$lib/CompaniesBarChart.svelte';
	import AdvertiserCreativeRankingsTableTop from '$lib/AdvertiserCreativeRankingsTableTop.svelte';
	import { formatNumber } from '$lib/utils/formatNumber.js';
	import {
		ClipboardList,
		TrendingUp,
		Layers,
		ChartNoAxesColumnIncreasing,
		Smartphone,
		Gamepad2,
		Sparkles,
		Zap,
		Calendar,
		Star
	} from 'lucide-svelte';

	let { data } = $props();

	const description =
		'Mobile app and ad intelligence platform with free ASO tools, SDK and API analysis, app-ads.txt intelligence, and paid data exports for growth, sales prospecting, and fraud detection teams.';

	const title = 'AppGoblin Free App Marketing Tools';

	const featureBulletClass = 'text-sm md:text-lg font-medium';
	const sectionTitleClass = 'text-2xl transition-colors';
	const sectionSubtitleClass = 'text-primary-800-200 font-medium';
	const sectionDescriptionClass = 'mb-6';
	const subSectionClass = 'p-4';
	const cardTitleClass = 'text-lg font-bold transition-colors';
	const cardDescriptionClass = 'text-sm text-gray-400 mb-4';
	const featureCtaClass =
		'btn px-3 py-1.5 bg-primary-300-700 text-base hover:bg-primary-500-300 text-white font-medium';
	('bg-gradient-to-r text-white font-bold px-6 py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow');
	const mainSectionClass =
		'card p-4 md:p-8 rounded-2xl shadow-xl border border-secondary-900-100/20';

	// Get current month and year for display
	const now = new Date();
	const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
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
		<h1 class="text-xl md:text-3xl font-bold mb-4">App Marketing Tools and Mobile Intelligence</h1>
		<div class="flex flex-wrap justify-center gap-4 text-sm mb-6">
			<span class="px-3 py-1 bg-secondary-100-900/20 rounded-full">🚀 Free ASO Tools</span>
			<span class="px-3 py-1 bg-warning-100-900/20 rounded-full"
				>⚡ Find High Growth Apps and Advertisers</span
			>
			<span class="px-3 py-1 bg-success-100-900/20 rounded-full"
				>✨ Mobile Ad and Creative Insights</span
			>
		</div>
		<p class="text-base md:text-lg max-w-2xl mx-auto">
			Analyze your competitors' growth and marketing tools.
		</p>
		<p>
			Browse
			<span class="font-bold text-success-900-100"
				>{formatNumber(data.appsOverview.android_apps)}</span
			>
			Android and
			<span class="font-bold text-success-900-100">{formatNumber(data.appsOverview.ios_apps)}</span>
			iOS apps.
		</p>

		<div class="items-center">
			<div class="flex flex-col gap-4 items-center">
				<div class="flex flex-wrap items-center justify-center gap-3">
					<a
						href="/auth/signup"
						class="btn preset-filled-primary-500 inline-flex items-center gap-2 p-3"
					>
						<span class="text-black">Create Free Account</span>
					</a>
					<a
						href="/contact"
						class="btn preset-outlined-primary-500 inline-flex items-center gap-2 p-3"
					>
						<span>Get in Touch</span>
					</a>
				</div>
			</div>
		</div>
	</section>

	<section class={mainSectionClass}>
		<div class="flex items-center mb-6">
			<div
				class="bg-gradient-to-br from-secondary-900-100 to-secondary-600 p-1 rounded-2xl shadow-lg mr-4"
			>
				<ClipboardList class="h-8 w-8 text-white" />
			</div>
			<div>
				<h2 class={sectionTitleClass}>Core App Growth Intelligence</h2>
				<p class={sectionSubtitleClass}>Free tools with export-ready datasets</p>
			</div>
		</div>

		<p class={sectionDescriptionClass}>
			Free tools to analyze app performance, competitive landscape, and ad-tech activity across 4M+
			Android and iOS apps.
		</p>

		<h3 class="text-lg font-bold mb-3">Core Features</h3>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold mb-2">
					<a href="/rankings/store/1/collection/1/category/1/US" class="hover:text-primary-600-400"
						>App Intelligence (Free)</a
					>
				</h4>
				<p class="text-sm mb-3">Daily intelligence on 4M+ Android and iOS apps.</p>
				<ul class="text-sm space-y-1.5">
					<li>
						<span class="text-white/80 font-medium">Keyword Tracking</span> — Monitor target terms and
						top ranking apps
					</li>
					<li>
						<span class="text-white/80 font-medium">Growth Trends</span> — Follow install and rating changes
						over time
					</li>
					<li>
						<span class="text-white/80 font-medium">Store Rankings</span> — Track Google Play and App
						Store positions daily
					</li>
					<li>
						<span class="text-white/80 font-medium">New App Discovery</span> — Surface new releases early
						across categories
					</li>
					<li>
						<span class="text-white/80 font-medium">SDK Footprints</span> — See which SDKs each app is
						using
					</li>
				</ul>
				<p class="text-xs text-white/60 mt-3 mb-1">Who it's for:</p>
				<p class="text-sm">App marketers, ASO teams, and competitor researchers.</p>
				<p class="text-xs text-white/60 mt-3 mb-2">Examples:</p>
				<div class="flex justify-between items-end gap-2 mb-0">
					<div class="flex flex-wrap gap-2">
						<a
							href="/apps/com.rovio.baba"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>Angry Birds 2 App</a
						>
					</div>
					<a href="/rankings/store/1/collection/1/category/1/US" class={featureCtaClass}
						>Track Rankings →</a
					>
				</div>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold mb-2">
					<a href="/sdks" class="hover:text-primary-600-400">SDK Analysis</a>
				</h4>
				<p class="text-sm">
					Inspect SDK footprints from decompiled Android and iOS apps, including ad, analytics, and
					open-source libraries.
				</p>
				<ul class="text-sm space-y-1.5 mt-3">
					<li>
						<span class="text-white/80 font-medium">Library Detection</span> — Identify ad, analytics,
						and open-source packages in each app
					</li>
					<li>
						<span class="text-white/80 font-medium">On-Demand Scans</span> — Request app analysis and
						review newly processed results
					</li>
				</ul>
				<p class="text-xs text-white/60 mt-3 mb-1">Who it's for:</p>
				<p class="text-sm">Developers, technical researchers, and security analysts.</p>
				<p class="text-sm mt-3 mb-3">Free: request any app for analysis.</p>
				<p class="text-xs text-white/60 mb-2">Examples:</p>
				<div class="flex justify-between items-end gap-2 mb-0">
					<div class="flex flex-wrap gap-2">
						<a
							href="/sdks"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>Recently Requested SDK Scans</a
						>
					</div>
					<a href="/sdks" class={featureCtaClass}>Request Scan →</a>
				</div>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold mb-2">
					<a href="/companies" class="hover:text-primary-600-400">Company Intelligence</a>
				</h4>
				<p class="text-sm mb-3">
					Rank and filter companies by SDK adoption, then drill into the top apps using each SDK,
					API, or mobile services provider.
				</p>
				<ul class="text-sm space-y-1.5 mb-3">
					<li>
						<span class="text-white/80 font-medium">Category Filters</span> — Slice company adoption by
						app vertical and use case
					</li>
					<li>
						<span class="text-white/80 font-medium">Client App Visibility</span> — See leading apps tied
						to each provider
					</li>
				</ul>
				<p class="text-xs text-white/60 mb-1">Who it's for:</p>
				<p class="text-sm mb-3">Ad sales teams, partner teams, and market intelligence analysts.</p>
				<p class="text-xs text-white/60 mb-2">Examples:</p>
				<div class="flex justify-between items-end gap-2 mb-0">
					<div class="flex flex-wrap gap-2">
						<a
							href="/companies/types/ad-networks/game_casino"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>Ad Networks for Casino Games</a
						>
						<a
							href="/companies/types/product-analytics/business"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>Product Analytics for Business Apps →</a
						>
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
					<a href="/companies" class={featureCtaClass}>Browse Companies →</a>
				</div>
			</div>

			<div class="rounded-xl border border-white/10 p-4 bg-white/5">
				<h4 class="font-bold mb-2">Ad Tech Insights</h4>
				<p class="text-sm">
					Track active ad campaigns, ad-tech domains apps contact in production traffic, and
					app-ads.txt mappings of DIRECT and RESELLER entries to real app IDs.
				</p>
				<ul class="text-sm space-y-1.5 mt-3">
					<li>
						<span class="text-white/80 font-medium">Live Campaign Tracking</span> — Monitor active advertisers
						and creatives in market
					</li>
					<li>
						<span class="text-white/80 font-medium">Supply Path Validation</span> — Map app-ads.txt entries
						to real app IDs for verification
					</li>
				</ul>
				<p class="text-xs text-white/60 mt-3 mb-1">Who it's for:</p>
				<p class="text-sm">Ad networks, DSP teams, and fraud detection analysts.</p>
				<p class="text-xs text-white/60 mt-3 mb-2">Examples:</p>
				<div class="flex justify-between items-end gap-2 mb-0">
					<div class="flex flex-wrap gap-2">
						<a
							href="/top-mobile-advertisers"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>Top Mobile Advertisers</a
						>
						<a
							href="/ad-creatives"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>Browse Thousands of Ad-Creatives</a
						>
						<a
							href="/companies/applovin.com/app-adstxt"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>AppLovin App-Ads.txt Entries</a
						>
						<a
							href="/apps/com.rovio.baba/ads-txt"
							class="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/80"
							>Angry Birds 2 App Example</a
						>
					</div>
					<a href="/top-mobile-advertisers" class={featureCtaClass}>View Campaigns →</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Top Advertiser Section -->
	<section class={mainSectionClass}>
		<div class="flex items-center mb-6">
			<div
				class="bg-gradient-to-br from-success-900-100 to-success-600 p-1 rounded-2xl shadow-lg mr-4"
			>
				<TrendingUp class="h-8 w-8 text-white" />
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
			<a href="/top-mobile-advertisers" class="btn preset-filled-success-200-800">
				Browse All Ad Buyers
			</a>
		</div>
	</section>

	<!-- Popular Companies/SDKs Section -->
	<section class={mainSectionClass}>
		<div class="flex items-center mb-6">
			<div
				class="bg-gradient-to-br from-primary-900-100 to-primary-600 rounded-2xl p-1 shadow-lg mr-4"
			>
				<Layers class="h-8 w-8 text-white" />
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
			<div class={subSectionClass}>
				<div class="flex items-center mb-3">
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
			<div class={subSectionClass}>
				<div class="flex items-center mb-3">
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
			<a href="/companies" class="btn preset-filled-primary-200-800"> Browse 500+ Companies</a>
		</div>
	</section>

	<!-- App Store Rankings Section -->
	<section class={mainSectionClass}>
		<div class="flex items-center mb-6">
			<div
				class="bg-gradient-to-br from-warning-900-100 to-warning-600 p-1 rounded-2xl shadow-lg mr-4"
			>
				<ChartNoAxesColumnIncreasing class="h-8 w-8 text-white" />
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

		<div class="grid grid-cols-1 grid-cols-2 gap-6 mb-6">
			<div class={subSectionClass}>
				<a href="/rankings/store/1/collection/1/category/1/US">
					<span
						class="text-base md:text-lg inline-flex gap-2 items-center font-bold hover:text-green-400"
					>
						<Smartphone class="h-4 w-4" />
						Today's Top 5 Android Apps
					</span>
				</a>
				{#if data.androidAppRanks}
					<AppRankTableShort myTable={data.androidAppRanks} />
				{/if}
			</div>
			<div class={subSectionClass}>
				<a href="/rankings/store/1/collection/1/category/36/US">
					<span
						class="text-base md:text-lg inline-flex gap-2 items-center font-bold hover:text-green-400"
					>
						<Gamepad2 class="h-4 w-4" />
						Today's Top 5 Android Games
					</span>
				</a>
				{#if data.androidGameRanks}
					<AppRankTableShort myTable={data.androidGameRanks} />
				{/if}
			</div>
			<div class={subSectionClass}>
				<a href="/rankings/store/2/collection/4/category/120/US">
					<span
						class="text-base md:text-lg inline-flex gap-2 items-center font-bold hover:text-gray-400"
					>
						<Smartphone class="h-4 w-4" />
						Today's Top 5 iOS Apps
					</span>
				</a>
				{#if data.iOSAppRanks}
					<AppRankTableShort myTable={data.iOSAppRanks} />
				{/if}
			</div>
			<div class={subSectionClass}>
				<a href="/rankings/store/2/collection/4/category/62/US">
					<span
						class="text-base md:text-lg inline-flex gap-2 items-center font-bold hover:text-gray-400"
					>
						<Gamepad2 class="h-4 w-4" />
						Today's Top 5 iOS Games
					</span>
				</a>
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
				class="btn preset-filled-secondary-200-800"
			>
				See All Rankings
			</a>
		</div>
	</section>

	<!-- New Apps Section -->
	<section class={mainSectionClass}>
		<div class="flex items-center mb-6">
			<div class="bg-gradient-to-br from-info-900-100 to-info-600 p-1 rounded-2xl shadow-lg mr-4">
				<Sparkles class="h-8 w-8 text-white" />
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
							<Zap class="h-5 w-5 text-white" />
						</div>
						<div>
							<h3 class="text-lg font-bold group-hover/card:text-cyan-400 transition-colors">
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
							<Calendar class="h-5 w-5 text-white" />
						</div>
						<div>
							<h3 class="text-lg font-bold group-hover/card:text-info-900-100 transition-colors">
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
							<Star class="h-5 w-5 text-white" />
						</div>
						<div>
							<h3 class="text-lg font-bold group-hover/card:text-yellow-400 transition-colors">
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
			<a href="/collections/new_monthly/google/overall" class="btn preset-filled-primary-200-800">
				Explore New Apps
			</a>
		</div>
	</section>
</div>
