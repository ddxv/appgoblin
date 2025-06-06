<script lang="ts">
	import AppRankTableShort from '$lib/AppRankTableShort.svelte';

	import CompaniesBarChart from '$lib/CompaniesBarChart.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	import SDKOverview from '$lib/utils/SDKOverview.svelte';

	let { data } = $props();

	function formatNumber(num: number) {
		return num.toLocaleString();
	}
	const description =
		'Free app analytics, keywords, ASO, app SDKs and app-ads.txt data for marketing Android and iOS apps. AppGoblin is an open source project for collecting Google & Apple App Store data and presenting it for developers and marketers.';

	const title = 'AppGoblin: Free Mobile App Marketing Tools';
</script>

<svelte:head>
	<!-- Title -->
	<title>{title}</title>

	<!-- Standard meta tags -->
	<meta name="description" content={description} />
	<meta
		name="keywords"
		content="app, aso, keywords, keyword analytics, ios, android, marketing, advertising, analytics, Google Play data, iTunes app data, app rankings, download statistics, competitor analysis, mobile app insights, app store intelligence"
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
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info" />
</svelte:head>

<div class="grid grid-cols-1 gap-4 md:gap-8 p-2 md:p-4 px-2 md:px-20 lg:px-48">
	<br />
	<div class="card preset-tonal p-2 md:p-8">
		<h1 class="p-2 md:p-4 text-3xl text-primary-900-100">{title}</h1>
		<p class="p-2 md:p-4">
			AppGoblin contains <span class="font-bold text-primary-900-100"
				>free marketing tools for app developers</span
			>
			including ASO, App Rankings, Keyword Ranking. AppGoblin has the best
			<span class="font-bold text-primary-900-100">competitor analysis tools</span> to research mobile
			app installs, keywords and SDKs. Advanced advertising data includes mobile ad networks by their
			SDKs and app-ads.txt data.
		</p>

		<div class="card preset-tonal p-2 md:p-8">
			<a href="/companies">
				<h2 class="h2 p-2 md:p-4">Most Popular Ad Networks, MMPs & Analytics</h2>
			</a>
			<p class="p-2 md:p-4">
				The lists include various ad networks, MMPs, tracking, analytics and other 3rd party
				services which collect app data.
				<a href="/companies">
					<strong>Check out all the SDKs, Companies and Ad Network rankings.</strong>
				</a>
			</p>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<a href="/companies/types/ad-networks">
					<div class="card preset-tonal md:p-4">
						<div class="card-header">
							<h3 class="h3">Top SDK Advertising Networks</h3>
						</div>
						<div class="card-content">
							These are the top Mobile Advertising Networks based on SDKs we found in iOS and
							Android apps.
							{#await data.topCompanies}
								Loading ...
							{:then myTops}
								{#if myTops.adnetworks}
									<WhiteCard>
										{#snippet title()}
											Top SDK Ad Networks (Android)
										{/snippet}
										<CompaniesBarChart plotData={myTops.adnetworks.sdk_android} />
									</WhiteCard>
								{/if}
							{/await}
						</div>
					</div>
				</a>

				<a href="/companies/types/ad-attribution">
					<div class="card preset-tonal md:p-4">
						<div class="card-header">
							<h3 class="h3">Top iOS MMPs & Ad Tracking</h3>
						</div>
						<div class="card-content">
							See which MMPs and mobile app tracking companies are used most often in Android and
							iOS apps.
							{#await data.topCompanies}
								Loading ...
							{:then myTops}
								{#if myTops.attribution}
									<WhiteCard>
										{#snippet title()}
											Top MMPs & Attribution Companies (iOS)
										{/snippet}
										<CompaniesBarChart plotData={myTops.attribution.sdk_ios} />
									</WhiteCard>
								{/if}
							{/await}
						</div>
					</div>
				</a>

				<a href="/companies/types/product-analytics">
					<div class="card preset-tonal md:p-4">
						<div class="card-header">
							<h3 class="h3">Top Product Analytics</h3>
						</div>
						<div class="card-content">
							These are the most popular Product Analytics companies or open source libraries based
							on SDKs we found in iOS and Android apps.
							{#await data.topCompanies}
								Loading ...
							{:then myTops}
								{#if myTops.analytics}
									<WhiteCard>
										{#snippet title()}
											Top Product Analytics Companies (iOS)
										{/snippet}
										<CompaniesBarChart plotData={myTops.analytics.sdk_ios} />
									</WhiteCard>
								{/if}
							{/await}
						</div>
					</div>
				</a>
			</div>
		</div>

		<div class="card preset-tonal p-2 md:p-8">
			<a href="/rankings/store/1/collection/1/category/1/US">
				<h2 class="h2 p-2 md:p-4">Latest App Store Ranks</h2>
			</a>
			<a href="/rankings/store/1/collection/1/category/1/US">
				<p class="p-2 md:p-4">Click through for full app store categories and rankings.</p>
			</a>
			<div
				class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10"
			>
				{#await data.androidAppRanks}
					Loading Android App Ranks...
				{:then androidApps}
					<a href="/rankings/store/1/collection/1/category/1/US">
						<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56">
							<div class="table-container card-header">
								<h3 class="h3">Android Apps</h3>
								<AppRankTableShort myTable={androidApps} />
							</div>
						</div>
					</a>
				{:catch}
					Trouble Loading Android App Ranks.
				{/await}

				{#await data.iOSAppRanks}
					Loading iOS App Ranks...
				{:then iOSApps}
					<a href="/rankings/store/2/collection/4/category/120/US">
						<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56">
							<div class="table-container card-header">
								<h3 class="h3">iOS Apps</h3>
								<AppRankTableShort myTable={iOSApps} />
							</div>
						</div>
					</a>
				{:catch}
					Trouble Loading iOS App Ranks.
				{/await}

				{#await data.androidGameRanks}
					Loading Android Game Ranks...
				{:then androidGames}
					<a href="/rankings/store/1/collection/1/category/36/US">
						<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56">
							<div class="table-container card-header">
								<h3 class="h3">Android Games</h3>
								<AppRankTableShort myTable={androidGames} />
							</div>
						</div>
					</a>
				{:catch}
					Trouble loading android games
				{/await}

				{#await data.iOSGameRanks}
					Loading iOS Game Ranks...
				{:then iOSGames}
					<a href="/rankings/store/2/collection/4/category/62/US">
						<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56">
							<div class="table-container card-header">
								<h3 class="h3">iOS Games</h3>
								<AppRankTableShort myTable={iOSGames} />
							</div>
						</div>
					</a>
				{:catch}
					Trouble Loading iOS Game Ranks.
				{/await}
			</div>
		</div>

		<div class="card preset-tonal p-2 md:p-8">
			<a href="/collections/new_monthly">
				<h2 class="h2 p-2 md:p-4">Explore New Apps</h2>
				<p class="p-2 md:p-4">
					<strong> Click here to see explore all categories.</strong>
				</p>
			</a>
			<div
				class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 md:flex-row flex-col px-4 py-10"
			>
				<a href="/collections/new_weekly">
					<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56 md:p-4">
						<div class="table-container card-header">
							<h3 class="h3">Newest Apps This Week</h3>
						</div>
					</div>
				</a>
				<a href="/collections/new_monthly">
					<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56 md:p-4">
						<div class="table-container card-header">
							<h3 class="h3">Newest Apps This Month</h3>
						</div>
					</div>
				</a>
				<a href="/collections/new_yearly">
					<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56 md:p-4">
						<div class="table-container card-header">
							<h3 class="h3">Newest Apps This Year</h3>
						</div>
					</div>
				</a>
				<a href="/collections/top">
					<div class="snap-center shrink-0 card preset-tonal w-48 md:w-56 md:p-4">
						<div class="table-container card-header">
							<h3 class="h3">Alltime Most Popular</h3>
						</div>
					</div>
				</a>
			</div>
		</div>

		<div class="card preset-tonal p-2 md:p-8">
			<a href="/about">
				<h2 class="h2 p-2 md:p-4">About AppGoblin Data</h2>
				<p class="p-2 md:p-4">
					<strong> Click here to learn more about AppGoblin data.</strong>
				</p>
			</a>
			<WhiteCard>
				{#snippet title()}
					App Store Scanned Apps
				{/snippet}
				{#await data.appsOverview}
					Loading Overview...
				{:then appsOverview}
					<p class="p-2 md:p-4 text-sm md:text-base">
						These are the apps we are currently have in our databases. Green represents apps that
						are currently live on the store while the others are older apps that are no longer
						active on the app stores.
					</p>
					<div class="table-wrap">
						<table class="table w-full">
							<thead>
								<tr class="border-b">
									<th>Android Apps</th>
									<th>iOS Apps</th>
									<th>Android Weekly Scans</th>
									<th>iOS Weekly Scans</th>
								</tr>
							</thead>
							<tbody>
								<tr class="text-xs md:text-base">
									<td>
										<span class="text-success-900-100">
											{formatNumber(appsOverview.success_android_apps)}
										</span>
										/ {formatNumber(appsOverview.android_apps)}
									</td>
									<td>
										<span class="text-success-900-100">
											{formatNumber(appsOverview.success_ios_apps)}
										</span>
										/ {formatNumber(appsOverview.ios_apps)}
									</td>
									<td>
										<span class="text-success-900-100">
											{formatNumber(appsOverview.weekly_success_scanned_android_apps)}
										</span>
										/ {formatNumber(appsOverview.weekly_scanned_android_apps)}
									</td>
									<td>
										<span class="text-success-900-100">
											{formatNumber(appsOverview.weekly_success_scanned_ios_apps)}
										</span>
										/ {formatNumber(appsOverview.weekly_scanned_ios_apps)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				{:catch}
					Error Loading Overview
				{/await}
			</WhiteCard>

			{#await data.appsOverview}
				Loading Overview...
			{:then appsOverview}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 md:p-4">
					<SDKOverview {data} />
					<WhiteCard>
						{#snippet title()}
							App Ads.txt URLs
						{/snippet}
						<p class="p-2 md:p-4">
							These are the app-ads.txt URLs we have found on app developer websites. Green
							represents URLs that we have successfully crawled and parsed while the others are
							developer URLs that do not host app-ads.txt files.
						</p>
						<table class="table mt-4">
							<thead>
								<tr class="border-b">
									<th>Total URLs</th>
									<th>URLs Scanned This Week</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<span class="text-success-900-100">
											{formatNumber(appsOverview.appads_success_urls)}
										</span>
										/ {formatNumber(appsOverview.appads_urls)}
									</td>

									<td>
										<span class="text-success-900-100">
											{formatNumber(appsOverview.appads_weekly_success_urls)}
										</span>
										/ {formatNumber(appsOverview.appads_weekly_urls)}
									</td>
								</tr>
							</tbody>
						</table>
					</WhiteCard>
				</div>
			{:catch}
				Error Loading Overview
			{/await}
		</div>
	</div>
</div>
