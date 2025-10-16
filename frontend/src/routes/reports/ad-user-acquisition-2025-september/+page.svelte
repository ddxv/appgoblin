<script lang="ts">
	import CompanyButton from '$lib/CompanyButton.svelte';
	import CreativeModal from '$lib/CreativeModal.svelte';
	import { createCreativeModal } from '$lib/stores/creativeModal.svelte';

	let { data } = $props();

	// Creative modal state
	const creativeModal = createCreativeModal();

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}

	function formatPercent(num: number): string {
		return num.toFixed(1) + '%';
	}

	function getGrowthColor(growth: number): string {
		if (growth > 200) return 'text-purple-600';
		if (growth > 100) return 'text-pink-600';
		if (growth > 50) return 'text-rose-600';
		if (growth > 25) return 'text-orange-600';
		return 'text-blue-600';
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	const sectionDividerClass = 'mb-24 pt-12 border-t-2 border-surface-200 dark:border-surface-700';
	const sectionHeaderBaseClass = 'mb-8 pb-4 border-b-2';
	const sectionHeaderRowClass = 'flex items-center gap-3 mb-2';
	const sectionNumberBadgeBaseClass =
		'w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg';
	const sectionTitleBaseClass = 'text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent';
	const sectionHeaderSubtitleClass = 'text-surface-600 dark:text-surface-400 text-sm ml-13';
	const sectionIntroRowClass = 'flex items-center gap-2 mb-6';
	const sectionBodyProseClass = 'prose dark:prose-invert max-w-none mb-6';
	const paragraphClass = 'text-lg leading-relaxed text-surface-700 dark:text-surface-300';
	const textMutedXsClass = 'text-xs text-surface-500 dark:text-surface-400';
	const textMutedXsCapClass = `${textMutedXsClass} capitalize`;
	const tableRowClass =
		'border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors';
	const tableAppLinkClass = 'flex items-center gap-3 hover:opacity-80 transition-opacity';
	const tableAppIconClass = 'w-20 h-20 rounded-lg shadow-sm';
	const creativeAppLinkClass = 'flex items-center gap-2 mb-3 hover:opacity-80 transition-opacity';
	const creativeAppIconClass = 'w-14 h-14 rounded-lg shadow-sm';
	const cardTableWrapperClass = 'card overflow-hidden';
	const tableWrapperClass = 'overflow-x-auto';
	const chipListClass = 'flex flex-wrap gap-1';
	const rankPillBaseClass =
		'inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm';
	const publisherBadgeClass =
		'inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold';
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta name="keywords" content={data.keywords} />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
	<!-- Header Section -->
	<div class="mb-12 text-center">
		<div
			class="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-4"
		>
			User Acquisition Intelligence Report
		</div>
		<h1
			class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"
		>
			{data.summary.reportPeriod} Ad Growth Analysis
		</h1>
		<p class="text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
			Discover the fastest-growing mobile apps and the advertising strategies powering their user
			acquisition campaigns
		</p>
		<p class="text-sm text-surface-500 mt-4">Report Generated: {data.summary.generatedDate}</p>
	</div>

	<!-- Key Metrics Dashboard -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
		<div class="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
			<div class="text-purple-100 text-sm font-semibold mb-2">Apps Analyzed</div>
			<div class="text-4xl font-bold mb-1">{data.summary.totalApps}</div>
			<div class="text-purple-100 text-sm">High-growth applications</div>
		</div>

		<div class="card p-6 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg">
			<div class="text-pink-100 text-sm font-semibold mb-2">Total Weekly Installs</div>
			<div class="text-4xl font-bold mb-1">{formatNumber(data.summary.totalInstalls)}</div>
			<div class="text-pink-100 text-sm">Combined growth surge</div>
		</div>

		<div class="card p-6 bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg">
			<div class="text-rose-100 text-sm font-semibold mb-2">Avg Growth Rate</div>
			<div class="text-4xl font-bold mb-1">{data.summary.avgGrowth}%</div>
			<div class="text-rose-100 text-sm">Week-over-week increase</div>
		</div>

		<div class="card p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
			<div class="text-orange-100 text-sm font-semibold mb-2">Ad Creatives</div>
			<div class="text-4xl font-bold mb-1">{data.summary.totalCreatives}</div>
			<div class="text-orange-100 text-sm">Across {data.summary.uniqueNetworks} networks</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 1: EXECUTIVE SUMMARY -->
	<!-- ========================================= -->
	<div class="mb-16">
		<!-- Section Header -->
		<div class="mb-8 pb-4 border-b-2 border-purple-200 dark:border-purple-800">
			<div class="flex items-center gap-3 mb-2">
				<div
					class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
				>
					01
				</div>
				<h2
					class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
				>
					Executive Summary
				</h2>
			</div>
			<p class="text-surface-600 dark:text-surface-400 text-sm ml-13">
				Key findings and performance overview for {data.summary.reportPeriod}
			</p>
		</div>

		<!-- Content -->
		<div
			class="card p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-surface-800 dark:to-surface-700 border-2 border-purple-200 dark:border-purple-800"
		>
			<div class={sectionIntroRowClass}>
				<span class="text-3xl">📊</span>
				<h3 class="text-xl font-bold text-purple-900 dark:text-purple-100">Overview</h3>
			</div>
			<div class="prose dark:prose-invert max-w-none">
				<p class={paragraphClass}>
					In {data.summary.reportPeriod}, we tracked
					<strong class="text-purple-600"
						>{data.summary.totalApps} high-growth mobile applications</strong
					>
					that collectively achieved
					<strong class="text-pink-600"
						>{formatNumber(data.summary.totalInstalls)} weekly installs</strong
					>, representing an average growth rate of
					<strong class="text-rose-600">{data.summary.avgGrowth}%</strong> week-over-week.
				</p>
				<p class={`${paragraphClass} mt-4`}>
					These apps deployed <strong>{data.summary.totalCreatives} unique ad creatives</strong>
					across
					<strong>{data.summary.uniqueNetworks} advertising networks</strong>, with Google Ads,
					Moloco, and BidMachine emerging as the dominant platforms for user acquisition campaigns.
				</p>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 2: AD IMPACT ON INSTALLS -->
	<!-- ========================================= -->
	<div class={sectionDividerClass}>
		<!-- Section Header -->
		<div class={`${sectionHeaderBaseClass} border-orange-200 dark:border-orange-800`}>
			<div class={sectionHeaderRowClass}>
				<div
					class={`${sectionNumberBadgeBaseClass} bg-gradient-to-br from-orange-500 to-amber-500`}
				>
					05
				</div>
				<h2 class={`${sectionTitleBaseClass} from-orange-600 to-amber-600`}>
					Ad Impact on Installs
				</h2>
			</div>
			<p class={sectionHeaderSubtitleClass}>
				Complete breakdown of {data.apps.length} apps with advertising performance metrics
			</p>
		</div>
		<div class={cardTableWrapperClass}>
			<div class={tableWrapperClass}>
				<table class="w-full">
					<thead class="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-semibold">Rank</th>
							<th class="px-4 py-3 text-left text-sm font-semibold">App</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Growth %</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Weekly Installs</th>
							<th class="px-4 py-3 text-center text-sm font-semibold">Ad Creatives</th>
							<th class="px-4 py-3 text-center text-sm font-semibold">Publishers</th>
							<th class="px-4 py-3 text-left text-sm font-semibold">Ad Networks</th>
						</tr>
					</thead>
					<tbody>
						{#each data.apps as app, index}
							<tr class={tableRowClass}>
								<td class="px-4 py-4">
									<span
										class={`${rankPillBaseClass} bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300`}
									>
										{index + 1}
									</span>
								</td>
								<td class="px-4 py-4">
									<a href="/apps/{app.store_id}" class={tableAppLinkClass}>
										<img
											src="https://media.appgoblin.info/app-icons/{app.store_id}/{app.icon_url_100}"
											alt={app.app_name}
											class={tableAppIconClass}
											onerror={(e) =>
												((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
										/>
										<div>
											<div
												class="font-semibold hover:underline text-purple-600 dark:text-purple-400"
											>
												{app.app_name}
											</div>
											<div class={textMutedXsClass}>
												{app.store_id}
											</div>
										</div>
									</a>
								</td>
								<td class="px-4 py-4 text-right">
									<span class="text-lg font-bold {getGrowthColor(app.weekly_percent_increase)}">
										+{formatPercent(app.weekly_percent_increase)}
									</span>
								</td>
								<td
									class="px-4 py-4 text-right font-semibold text-surface-700 dark:text-surface-300"
								>
									{formatNumber(app.weekly_installs)}
								</td>
								<td class="px-4 py-4 text-center">
									<div class="flex justify-center items-center gap-1">
										{#each app.creatives.slice(0, 3) as creative}
											<button
												onclick={() =>
													creativeModal.open(
														creative.md5_hash,
														creative.file_extension,
														app.app_name
													)}
												class="relative group cursor-pointer hover:scale-110 transition-transform duration-200"
												title="Click to view"
											>
												<div
													class="w-10 h-10 rounded border border-surface-300 dark:border-surface-600 overflow-hidden group-hover:border-purple-500"
												>
													<img
														src="https://media.appgoblin.info/creatives/thumbs/{creative.md5_hash}.jpg"
														alt="Creative"
														class="w-full h-full object-cover"
														onerror={(e) => {
															const target = e.currentTarget as HTMLImageElement;
															const parent = target.parentElement;
															if (parent) {
																parent.innerHTML =
																	'<div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">N/A</div>';
															}
														}}
													/>
												</div>
											</button>
										{/each}
										{#if app.creative_count > 3}
											<span class={`${textMutedXsClass} font-semibold ml-1`}>
												+{app.creative_count - 3}
											</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-4 text-center">
									<span class={publisherBadgeClass}>
										{app.pub_count}
									</span>
								</td>
								<td class="px-4 py-4">
									<div class={chipListClass}>
										{#each app.ad_networks as network}
											<CompanyButton
												companyDomain={network.domain}
												companyLogoUrl={`https://media.appgoblin.info/${network.logo_url}`}
												size="md"
											/>
										{/each}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 3: MOST POPULAR VIDEO CREATIVES -->
	<!-- ========================================= -->
	<div class="mb-24 pt-12 border-t-2 border-surface-200 dark:border-surface-700">
		<!-- Section Header -->
		<div class="mb-8 pb-4 border-b-2 border-pink-200 dark:border-pink-800">
			<div class="flex items-center gap-3 mb-2">
				<div
					class="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
				>
					03
				</div>
				<h2
					class="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent"
				>
					Most Popular Video Creatives
				</h2>
			</div>
			<p class="text-surface-600 dark:text-surface-400 text-sm ml-13">
				Top-performing video ads with the widest publisher distribution
			</p>
		</div>
		<!-- Content -->
		<div class={sectionIntroRowClass}>
			<span class="text-3xl">🎬</span>
			<h3 class="text-xl font-bold text-pink-900 dark:text-pink-100">Creative Performance</h3>
		</div>
		<div class={sectionBodyProseClass}>
			<p class={paragraphClass}>
				These video creatives achieved the widest distribution across publisher networks during {data
					.summary.reportPeriod}. The top performer reached
				<strong class="text-pink-600">{data.popularCreatives[0].publisher_count} publishers</strong
				>, demonstrating the viral potential of engaging video content in user acquisition
				campaigns.
			</p>
		</div>
		<!-- Creatives Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
			{#each data.popularCreatives as creative, index}
				<div
					class="bg-white dark:bg-surface-900 rounded-lg border-2 border-pink-200 dark:border-pink-800 overflow-hidden hover:shadow-xl transition-shadow duration-300"
				>
					<!-- Rank Badge -->
					<div
						class="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-1 text-sm font-bold"
					>
						#{index + 1} Most Popular
					</div>
					<!-- Thumbnail with Play Button -->
					<button
						onclick={() =>
							creativeModal.open(
								creative.md5_hash,
								creative.file_extension,
								`Popular Creative #${index + 1}`
							)}
						class="relative w-full aspect-video bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 cursor-pointer group overflow-hidden"
						title="Click to play video"
					>
						<img
							src="https://media.appgoblin.info/creatives/thumbs/{creative.md5_hash}.jpg"
							alt={`Popular creative ${index + 1}`}
							class="w-full h-full object-cover"
							onerror={(e) => {
								const target = e.currentTarget as HTMLImageElement;
								target.style.display = 'none';
							}}
						/>
						<!-- Play Button Overlay -->
						<div
							class="absolute inset-0 flex items-center justify-center bg-surface-100-900/20 group-hover:bg-surface-100-900/10 transition-all duration-200"
						>
							<div
								class="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg"
							>
								<svg class="w-8 h-8 text-pink-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
									<path
										d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
									/>
								</svg>
							</div>
						</div>
					</button>
					<!-- Stats -->
					<div class="p-4 space-y-2">
						<!-- Advertiser Info -->
						<a href="/apps/{creative.advertiser_store_id}" class={creativeAppLinkClass}>
							<img
								src="https://media.appgoblin.info/app-icons/{creative.advertiser_store_id}/{creative.advertiser_icon_url_100}"
								alt="App icon"
								class={creativeAppIconClass}
								onerror={(e) =>
									((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
							/>
							<span class={`${textMutedXsClass} truncate hover:underline`}
								>{creative.advertiser_store_id}</span
							>
						</a>
						<!-- Publisher Count -->
						<div class="flex justify-between items-center">
							<span class="text-sm text-surface-600 dark:text-surface-400">Publishers</span>
							<span class="text-lg font-bold text-pink-600">{creative.publisher_count}</span>
						</div>
						<!-- Date Range -->
						<div
							class="text-xs text-surface-500 dark:text-surface-500 pt-2 border-t border-surface-200 dark:border-surface-700"
						>
							<div class="flex justify-between">
								<span>First seen:</span>
								<span class="font-semibold">{formatDate(creative.first_seen)}</span>
							</div>
							<div class="flex justify-between">
								<span>Last seen:</span>
								<span class="font-semibold">{formatDate(creative.last_seen)}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 4: AD NETWORK LANDSCAPE -->
	<!-- ========================================= -->
	<div class="mb-24 pt-12 border-t-2 border-surface-200 dark:border-surface-700">
		<!-- Section Header -->
		<div class="mb-8 pb-4 border-b-2 border-indigo-200 dark:border-indigo-800">
			<div class="flex items-center gap-3 mb-2">
				<div
					class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
				>
					02
				</div>
				<h2
					class="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent"
				>
					Ad Network Landscape
				</h2>
			</div>
			<p class="text-surface-600 dark:text-surface-400 text-sm ml-13">
				Comprehensive analysis of advertising platforms and distribution channels
			</p>
		</div>

		<!-- Network Metrics Grid -->
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
			<div
				class="p-4 bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700"
			>
				<div class="text-sm text-surface-600 dark:text-surface-400 mb-1">Total Publishers</div>
				<div class="text-3xl font-bold text-cyan-600">
					{data.networkStats.totalPublishers.toLocaleString()}
				</div>
			</div>
			<div
				class="p-4 bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700"
			>
				<div class="text-sm text-surface-600 dark:text-surface-400 mb-1">Total Advertisers</div>
				<div class="text-3xl font-bold text-blue-600">
					{data.networkStats.totalAdvertisers.toLocaleString()}
				</div>
			</div>
			<div
				class="p-4 bg-white dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-700"
			>
				<div class="text-sm text-surface-600 dark:text-surface-400 mb-1">Network Creatives</div>
				<div class="text-3xl font-bold text-purple-600">
					{data.networkStats.totalNetworkCreatives.toLocaleString()}
				</div>
			</div>
		</div>

		<!-- Content -->
		<div class={sectionIntroRowClass}>
			<span class="text-3xl">🌐</span>
			<h3 class="text-xl font-bold text-indigo-900 dark:text-indigo-100">Network Distribution</h3>
		</div>
		<div class={sectionBodyProseClass}>
			<p class={paragraphClass}>
				The mobile advertising ecosystem is powered by <strong class="text-indigo-600"
					>{data.networkStats.totalNetworks} major ad networks</strong
				>, connecting
				<strong class="text-blue-600">{data.networkStats.totalAdvertisers} advertisers</strong>
				with
				<strong class="text-cyan-600">{data.networkStats.totalPublishers} publishers</strong>,
				delivering
				<strong class="text-purple-600"
					>{data.networkStats.totalNetworkCreatives} unique creatives</strong
				>.
			</p>
			<p class={`${paragraphClass} mt-4`}>
				<strong>Google dominates</strong> with {data.adNetworks[0].publisher_count} publishers and
				{data.adNetworks[0].creatives_count} creatives, followed by Unity3D ({data.adNetworks[1]
					.publisher_count} publishers) and Yandex ({data.adNetworks[2].publisher_count} publishers).
				This concentration suggests that
				<strong class="text-rose-600">diversification beyond Google Ads is critical</strong> for sustainable
				growth, as smaller networks like Mintegral and Fyber provide valuable audience reach at competitive
				rates.
			</p>
		</div>

		<!-- Top Networks Table -->
		<div class={cardTableWrapperClass}>
			<div class={tableWrapperClass}>
				<table class="w-full">
					<thead class="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-semibold">Rank</th>
							<th class="px-4 py-3 text-left text-sm font-semibold">Network</th>
							<th class="px-4 py-3 text-left text-sm font-semibold">Domains</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Publishers</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Advertisers</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Creatives</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Market Share</th>
						</tr>
					</thead>
					<tbody>
						{#each data.adNetworks as network, index}
							<tr class={tableRowClass}>
								<td class="px-4 py-4">
									<span
										class={`${rankPillBaseClass} ${
											index === 0
												? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
												: index === 1
													? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
													: index === 2
														? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
														: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
										}`}
									>
										{index + 1}
									</span>
								</td>
								<td class="px-4 py-4">
									<CompanyButton
										companyDomain={network.ad_network_domain}
										companyName={network.ad_network_name}
										companyLogoUrl={network.company_logo_url}
										size="lg"
									/>
								</td>
								<td class="px-4 py-4">
									{#if network.domains && network.domains.length > 0}
										<div class={textMutedXsClass}>
											{network.domains.join(', ')}
										</div>
									{:else}
										<span class="text-xs text-surface-400">—</span>
									{/if}
								</td>
								<td class="px-4 py-4 text-right">
									<span class="font-semibold text-cyan-600 dark:text-cyan-400">
										{network.publisher_count.toLocaleString()}
									</span>
								</td>
								<td class="px-4 py-4 text-right">
									<span class="font-semibold text-blue-600 dark:text-blue-400">
										{network.advertiser_count.toLocaleString()}
									</span>
								</td>
								<td class="px-4 py-4 text-right">
									<span class="font-semibold text-purple-600 dark:text-purple-400">
										{network.creatives_count.toLocaleString()}
									</span>
								</td>
								<td class="px-4 py-4 text-right">
									<div class="flex items-center justify-end gap-2">
										<div
											class="w-24 h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden"
										>
											<div
												class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
												style="width: {(
													(network.publisher_count / data.networkStats.totalPublishers) *
													100
												).toFixed(1)}%"
											></div>
										</div>
										<span
											class="text-sm font-semibold text-surface-600 dark:text-surface-400 w-12 text-right"
										>
											{(
												(network.publisher_count / data.networkStats.totalPublishers) *
												100
											).toFixed(1)}%
										</span>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 5: CAMPAIGN REACH ANALYSIS -->
	<!-- ========================================= -->
	<div class="mb-24 pt-12 border-t-2 border-surface-200 dark:border-surface-700">
		<!-- Section Header -->
		<div class="mb-8 pb-4 border-b-2 border-emerald-200 dark:border-emerald-800">
			<div class="flex items-center gap-3 mb-2">
				<div
					class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
				>
					04
				</div>
				<h2
					class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
				>
					Campaign Reach Analysis
				</h2>
			</div>
			<p class="text-surface-600 dark:text-surface-400 text-sm ml-13">
				Publisher distribution strategies and market penetration insights
			</p>
		</div>

		<!-- Content -->
		<div class={sectionIntroRowClass}>
			<span class="text-3xl">📡</span>
			<h3 class="text-xl font-bold text-emerald-900 dark:text-emerald-100">
				Reach Tiers & Distribution
			</h3>
		</div>
		<div class={sectionBodyProseClass}>
			<p class={paragraphClass}>
				Advertisers are categorized into <strong class="text-emerald-600">four reach tiers</strong>
				based on their publisher distribution strategy. Elite campaigns achieve
				<strong class="text-teal-600">3+ publisher placements</strong>, demonstrating comprehensive
				market penetration, while targeted campaigns focus on
				<strong class="text-cyan-600">strategic single-publisher relationships</strong> for precision
				marketing.
			</p>
		</div>

		<!-- Reach Insights -->
		<div
			class="bg-white dark:bg-surface-900 rounded-lg p-6 border border-emerald-200 dark:border-emerald-800"
		>
			<h3 class="text-lg font-bold mb-4 text-emerald-900 dark:text-emerald-100">
				💡 Reach Strategy Insights
			</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div class="flex gap-3">
					<div
						class="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold"
					>
						1
					</div>
					<div>
						<h4 class="font-semibold text-surface-800 dark:text-surface-200">
							Elite Scale Advantage
						</h4>
						<p class="text-sm text-surface-600 dark:text-surface-400">
							Campaigns with 3+ publishers achieve {(
								(data.reachStats.elite.totalInstalls / data.summary.totalInstalls) *
								100
							).toFixed(1)}% of total installs, demonstrating the compounding effect of
							multi-publisher strategies.
						</p>
					</div>
				</div>
				<div class="flex gap-3">
					<div
						class="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold"
					>
						2
					</div>
					<div>
						<h4 class="font-semibold text-surface-800 dark:text-surface-200">
							Targeted Efficiency
						</h4>
						<p class="text-sm text-surface-600 dark:text-surface-400">
							{data.reachStats.targeted.count} apps leverage focused single-publisher strategies, optimizing
							for quality over quantity in their user acquisition approach.
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Top Apps by Publisher Reach -->
		<div class={`mt-6 ${cardTableWrapperClass}`}>
			<div class={tableWrapperClass}>
				<table class="w-full">
					<thead class="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
						<tr>
							<th class="px-4 py-3 text-left text-sm font-semibold">Rank</th>
							<th class="px-4 py-3 text-left text-sm font-semibold">App</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Publishers</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Creatives</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Installs</th>
							<th class="px-4 py-3 text-right text-sm font-semibold">Avg/Pub</th>
							<th class="px-4 py-3 text-left text-sm font-semibold">Ad Networks</th>
							<th class="px-4 py-3 text-left text-sm font-semibold">MMP</th>
						</tr>
					</thead>
					<tbody>
						{#each data.appReachData.slice(0, 10) as app, index}
							<tr class={tableRowClass}>
								<td class="px-4 py-4">
									<span
										class={`${rankPillBaseClass} ${
											index === 0
												? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
												: index === 1
													? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
													: index === 2
														? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
														: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
										}`}
									>
										{index + 1}
									</span>
								</td>
								<td class="px-4 py-4">
									<a href="/apps/{app.advertiser_store_id}" class={tableAppLinkClass}>
										<img
											src="https://media.appgoblin.info/app-icons/{app.advertiser_store_id}/{app.advertiser_icon_url_100}"
											alt={app.advertiser_name}
											class={tableAppIconClass}
											onerror={(e) =>
												((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
										/>
										<div>
											<div class="font-semibold text-emerald-600 dark:text-emerald-400">
												{app.advertiser_name}
											</div>
											<div class={textMutedXsCapClass}>
												{app.advertiser_category.replace(/_/g, ' ')}
											</div>
										</div>
									</a>
								</td>
								<td class="px-4 py-4 text-right">
									<span class="text-xl font-bold text-emerald-600 dark:text-emerald-400">
										{app.unique_publishers}
									</span>
								</td>
								<td class="px-4 py-4 text-right">
									<span class="text-base font-bold text-purple-600 dark:text-purple-400">
										{app.unique_creatives}
									</span>
								</td>
								<td
									class="px-4 py-4 text-right font-semibold text-surface-700 dark:text-surface-300"
								>
									{formatNumber(app.advertiser_installs)}
								</td>
								<td class="px-4 py-4 text-right">
									<span class="text-sm font-semibold text-teal-600 dark:text-teal-400">
										{formatNumber(app.avg_publisher_installs)}
									</span>
								</td>
								<td class="px-4 py-4">
									{#if app.ad_networks && app.ad_networks.length > 0}
										<div class={chipListClass}>
											{#each app.ad_networks as network}
												<CompanyButton
													companyDomain={network.domain}
													companyLogoUrl={network.logo_url}
													size="md"
												/>
											{/each}
										</div>
									{:else}
										<span class="text-xs text-surface-400">—</span>
									{/if}
								</td>
								<td class="px-4 py-4">
									{#if app.mmps && app.mmps.length > 0}
										<div class={chipListClass}>
											{#each app.mmps as mmp}
												<CompanyButton
													companyDomain={mmp.domain}
													companyLogoUrl={mmp.logo_url}
													size="sm"
												/>
											{/each}
										</div>
									{:else}
										<span class="text-xs text-surface-400">—</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- ========================================= -->
	<!-- SECTION 6: KEY INSIGHTS & RECOMMENDATIONS -->
	<!-- ========================================= -->
	<div class="mb-24 pt-12 border-t-2 border-surface-200 dark:border-surface-700">
		<!-- Section Header -->
		<div class="mb-8 pb-4 border-b-2 border-blue-200 dark:border-blue-800">
			<div class="flex items-center gap-3 mb-2">
				<div
					class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg"
				>
					06
				</div>
				<h2
					class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
				>
					Key Insights & Recommendations
				</h2>
			</div>
			<p class="text-surface-600 dark:text-surface-400 text-sm ml-13">
				Actionable takeaways and strategic recommendations for user acquisition
			</p>
		</div>

		<!-- Content -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Insight Card 1 -->
			<div
				class="card p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-surface-800 dark:to-surface-700 border-2 border-blue-200 dark:border-blue-800"
			>
				<div class="flex items-start gap-3 mb-4">
					<div
						class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl"
					>
						💡
					</div>
					<div>
						<h3 class="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
							Diversification is Key
						</h3>
						<p class="text-surface-700 dark:text-surface-300">
							Apps using 3+ ad networks achieved {(
								(data.reachStats.elite.totalInstalls / data.summary.totalInstalls) *
								100
							).toFixed(1)}% of total installs. Diversifying beyond Google Ads reduces platform risk
							and increases audience reach.
						</p>
					</div>
				</div>
			</div>

			<!-- Insight Card 2 -->
			<div
				class="card p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-surface-800 dark:to-surface-700 border-2 border-purple-200 dark:border-purple-800"
			>
				<div class="flex items-start gap-3 mb-4">
					<div
						class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl"
					>
						🎯
					</div>
					<div>
						<h3 class="text-lg font-bold text-purple-900 dark:text-purple-100 mb-2">
							Video Content Dominates
						</h3>
						<p class="text-surface-700 dark:text-surface-300">
							The top video creative reached {data.popularCreatives[0].publisher_count} publishers. Video
							ads demonstrate superior engagement and viral distribution potential compared to static
							creatives.
						</p>
					</div>
				</div>
			</div>

			<!-- Insight Card 3 -->
			<div
				class="card p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-surface-800 dark:to-surface-700 border-2 border-emerald-200 dark:border-emerald-800"
			>
				<div class="flex items-start gap-3 mb-4">
					<div
						class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-2xl"
					>
						📊
					</div>
					<div>
						<h3 class="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-2">
							Google Ads Dominance
						</h3>
						<p class="text-surface-700 dark:text-surface-300">
							Google maintains {(
								(data.adNetworks[0].publisher_count / data.networkStats.totalPublishers) *
								100
							).toFixed(1)}% market share with {data.adNetworks[0].publisher_count} publishers, but emerging
							networks like Mintegral and Unity offer competitive rates.
						</p>
					</div>
				</div>
			</div>

			<!-- Insight Card 4 -->
			<div
				class="card p-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-surface-800 dark:to-surface-700 border-2 border-rose-200 dark:border-rose-800"
			>
				<div class="flex items-start gap-3 mb-4">
					<div
						class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-2xl"
					>
						🚀
					</div>
					<div>
						<h3 class="text-lg font-bold text-rose-900 dark:text-rose-100 mb-2">
							High Growth Opportunities
						</h3>
						<p class="text-surface-700 dark:text-surface-300">
							Average growth rate of {data.summary.avgGrowth}% demonstrates significant opportunity
							in the mobile app market. Strategic ad campaigns can rapidly scale user acquisition.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Footer -->
<div
	class="mt-20 pt-12 border-t-2 border-surface-200 dark:border-surface-700 text-center text-sm text-surface-500 dark:text-surface-400"
>
	<p>
		Data source: AppGoblin Ad Intelligence Platform | Report Period: {data.summary.reportPeriod}
	</p>
	<p class="mt-2">
		For more insights and detailed analytics, visit <a
			href="/"
			class="text-purple-600 hover:underline">AppGoblin.info</a
		>
	</p>
</div>

<!-- Creative Modal -->
<CreativeModal
	bind:isOpen={creativeModal.isOpen}
	creativeUrl={creativeModal.creativeUrl}
	title={creativeModal.title}
/>

<style>
	:global(body) {
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	}

	:global(.dark body) {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	}
</style>
