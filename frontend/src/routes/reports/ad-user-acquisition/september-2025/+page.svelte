<script lang="ts">
	import CreativeModal from '$lib/CreativeModal.svelte';

	let { data } = $props();

	let isModalOpen = $state(false);
	let selectedCreativeUrl = $state('');
	let selectedCreativeTitle = $state('');

	function openCreative(md5Hash: string, fileExtension: string, appName: string) {
		selectedCreativeUrl = `https://media.appgoblin.info/creatives/${md5Hash}.${fileExtension}`;
		selectedCreativeTitle = `${appName} - Ad Creative`;
		isModalOpen = true;
	}

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
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta name="description" content={data.description} />
	<meta name="keywords" content={data.keywords} />
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-7xl">
	<!-- Header Section -->
	<div class="mb-12 text-center">
		<div class="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-4">
			User Acquisition Intelligence Report
		</div>
		<h1 class="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
			{data.summary.reportPeriod} Ad Growth Analysis
		</h1>
		<p class="text-xl text-surface-600 dark:text-surface-400 max-w-3xl mx-auto">
			Discover the fastest-growing mobile apps and the advertising strategies powering their user acquisition campaigns
		</p>
		<p class="text-sm text-surface-500 mt-4">Report Generated: {data.summary.generatedDate}</p>
	</div>

	<!-- Key Metrics Dashboard -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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

	<!-- Executive Summary -->
	<div class="card p-8 mb-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-surface-800 dark:to-surface-700 border-2 border-blue-200 dark:border-blue-800">
		<h2 class="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">📊 Executive Summary</h2>
		<div class="prose dark:prose-invert max-w-none">
			<p class="text-lg leading-relaxed text-surface-700 dark:text-surface-300">
				In {data.summary.reportPeriod}, we tracked <strong class="text-purple-600">{data.summary.totalApps} high-growth mobile applications</strong> 
				that collectively achieved <strong class="text-pink-600">{formatNumber(data.summary.totalInstalls)} weekly installs</strong>, 
				representing an average growth rate of <strong class="text-rose-600">{data.summary.avgGrowth}%</strong> week-over-week.
			</p>
			<p class="text-lg leading-relaxed text-surface-700 dark:text-surface-300 mt-4">
				These apps deployed <strong>{data.summary.totalCreatives} unique ad creatives</strong> across 
				<strong>{data.summary.uniqueNetworks} advertising networks</strong>, with Google Ads, Moloco, and BidMachine 
				emerging as the dominant platforms for user acquisition campaigns.
			</p>
		</div>
	</div>

	<!-- All Apps Section -->
	<div class="mb-12">
		<h2 class="text-3xl font-bold mb-6">📱 Complete Growth Analysis</h2>
		<p class="text-surface-600 dark:text-surface-400 mb-8 text-lg">
			Comprehensive breakdown of all {data.apps.length} apps tracked during this period.
		</p>

		<div class="card overflow-hidden">
			<div class="overflow-x-auto">
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
							<tr class="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
								<td class="px-4 py-4">
									<span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold text-sm">
										{index + 1}
									</span>
								</td>
								<td class="px-4 py-4">
									<div class="flex items-center gap-3">
										<img
											src="https://media.appgoblin.info/app-icons/{app.store_id}/{app.icon_url_100}"
											alt={app.app_name}
											class="w-12 h-12 rounded-lg shadow-sm"
											onerror={(e) => ((e.currentTarget as HTMLImageElement).src = '/default_company_logo.png')}
										/>
										<div>
											<a href="/apps/{app.store_id}" class="font-semibold hover:underline text-purple-600 dark:text-purple-400">
												{app.app_name}
											</a>
											<div class="text-xs text-surface-500 dark:text-surface-400">{app.store_id}</div>
										</div>
									</div>
								</td>
								<td class="px-4 py-4 text-right">
									<span class="text-lg font-bold {getGrowthColor(app.weekly_percent_increase)}">
										+{formatPercent(app.weekly_percent_increase)}
									</span>
								</td>
								<td class="px-4 py-4 text-right font-semibold text-surface-700 dark:text-surface-300">
									{formatNumber(app.weekly_installs)}
								</td>
								<td class="px-4 py-4 text-center">
									<div class="flex justify-center items-center gap-1">
										{#each app.creatives.slice(0, 3) as creative}
											<button
												onclick={() => openCreative(creative.md5_hash, creative.file_extension, app.app_name)}
												class="relative group cursor-pointer hover:scale-110 transition-transform duration-200"
												title="Click to view"
											>
												<div class="w-10 h-10 rounded border border-surface-300 dark:border-surface-600 overflow-hidden group-hover:border-purple-500">
													{#if creative.file_extension === 'mp4' || creative.file_extension === 'webm'}
														<div class="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center">
															<svg class="w-4 h-4 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
																<path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
															</svg>
														</div>
													{:else}
														<img
															src="https://media.appgoblin.info/creatives/thumbs/{creative.md5_hash}.jpg"
															alt="Creative"
															class="w-full h-full object-cover"
															onerror={(e) => {
																const target = e.currentTarget as HTMLImageElement;
																const parent = target.parentElement;
																if (parent) {
																	parent.innerHTML = '<div class="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">N/A</div>';
																}
															}}
														/>
													{/if}
												</div>
											</button>
										{/each}
										{#if app.creative_count > 3}
											<span class="text-xs text-surface-600 dark:text-surface-400 font-semibold ml-1">
												+{app.creative_count - 3}
											</span>
										{/if}
									</div>
								</td>
								<td class="px-4 py-4 text-center">
									<span class="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-semibold">
										{app.pub_count}
									</span>
								</td>
								<td class="px-4 py-4">
									<div class="flex flex-wrap gap-1">
										{#each Array.from(app.ad_networks) as network}
											<span class="px-2 py-0.5 bg-purple-100 dark:bg-purple-900 rounded text-xs border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300">
												{network}
											</span>
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

	<!-- Key Insights Section -->
	<div class="card p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-surface-800 dark:to-surface-700 border-2 border-purple-200 dark:border-purple-800">
		<h2 class="text-2xl font-bold mb-6 text-purple-900 dark:text-purple-100">💡 Key Insights & Recommendations</h2>
		<div class="space-y-4">
			<div class="flex gap-4 items-start">
				<div class="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
				<div>
					<h3 class="font-bold text-lg mb-2">Google Ads Dominance</h3>
					<p class="text-surface-700 dark:text-surface-300">
						Google Ads remains the primary user acquisition channel, appearing in {Math.round((data.apps.filter((a: any) => Array.from(a.ad_networks).some((n: any) => n === 'google.com')).length / data.apps.length) * 100)}% of campaigns. 
						Apps should prioritize Google Ads optimization for maximum reach.
					</p>
				</div>
			</div>

			<div class="flex gap-4 items-start">
				<div class="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
				<div>
					<h3 class="font-bold text-lg mb-2">Video Creative Performance</h3>
					<p class="text-surface-700 dark:text-surface-300">
						{Math.round((data.apps.filter((a: any) => a.creatives.some((c: any) => c.file_extension === 'mp4')).length / data.apps.length) * 100)}% of high-growth apps utilize video creatives (MP4). 
						Video content shows strong engagement and should be a core component of UA strategies.
					</p>
				</div>
			</div>

			<div class="flex gap-4 items-start">
				<div class="flex-shrink-0 w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
				<div>
					<h3 class="font-bold text-lg mb-2">Multi-Network Strategy</h3>
					<p class="text-surface-700 dark:text-surface-300">
						Top performers leverage an average of {(data.apps.slice(0, 5).reduce((sum: number, app: any) => sum + app.ad_networks.size, 0) / 5).toFixed(1)} advertising networks. 
						Diversifying across multiple platforms reduces dependency and increases audience reach.
					</p>
				</div>
			</div>

			<div class="flex gap-4 items-start">
				<div class="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">4</div>
				<div>
					<h3 class="font-bold text-lg mb-2">Publisher Distribution Matters</h3>
					<p class="text-surface-700 dark:text-surface-300">
						High-growth apps average {(data.apps.reduce((sum: number, app: any) => sum + app.pub_count, 0) / data.apps.length).toFixed(1)} publisher placements. 
						Broader distribution across publishers increases visibility and acquisition potential.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Footer -->
	<div class="mt-12 text-center text-sm text-surface-500 dark:text-surface-400">
		<p>Data source: AppGoblin Ad Intelligence Platform | Report Period: {data.summary.reportPeriod}</p>
		<p class="mt-2">For more insights and detailed analytics, visit <a href="/" class="text-purple-600 hover:underline">AppGoblin.com</a></p>
	</div>
</div>

<!-- Creative Modal -->
<CreativeModal bind:isOpen={isModalOpen} creativeUrl={selectedCreativeUrl} title={selectedCreativeTitle} />

<style>
	:global(body) {
		background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	}
	
	:global(.dark body) {
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	}
</style>
