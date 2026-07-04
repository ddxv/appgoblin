<script lang="ts">
	import type { AppFullDetail, AppSDKsOverview, CompanyTypes } from '../types';
	import { formatNumber, getRevenueBucket } from '$lib/utils/formatNumber';

	interface Props {
		app: AppFullDetail;
		sdkOverview?: AppSDKsOverview;
		companyTypes?: CompanyTypes;
	}

	let { app, sdkOverview, companyTypes }: Props = $props();

	// Determine platform
	const isAndroid = $derived(
		app.store === '1' || app.store === 'google' || app.store_id?.includes('.')
	);
	const platformName = $derived(isAndroid ? 'Android' : 'iOS');

	// Format category name
	const categoryName = $derived(
		app.category
			? app.category
					.replace(/_/g, ' ')
					.replace(/game /i, '')
					.split(' ')
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
					.join(' ')
			: null
	);

	// Calculate app age
	const appAge = $derived.by(() => {
		if (!app.release_date) return null;
		const release = new Date(app.release_date);
		const now = new Date();
		const years = Math.floor((now.getTime() - release.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
		const months = Math.floor(
			((now.getTime() - release.getTime()) % (365.25 * 24 * 60 * 60 * 1000)) /
				(30 * 24 * 60 * 60 * 1000)
		);
		if (years > 0) return `${years} year${years > 1 ? 's' : ''}`;
		if (months > 0) return `${months} month${months > 1 ? 's' : ''}`;
		return 'recently released';
	});

	// Growth indicators
	const installGrowth = $derived.by(() => {
		if (!app.installs_z_score_4w) return null;
		const z = app.installs_z_score_4w;
		if (z > 2) return 'exceptional';
		if (z > 1) return 'strong';
		if (z > 0.5) return 'above average';
		if (z > -0.5) return 'steady';
		if (z > -1) return 'below average';
		return 'declining';
	});

	// Monetization model
	const monetization = $derived.by(() => {
		const parts: string[] = [];
		if (String(app.free) === 'true') parts.push('free');
		else if (app.price) parts.push(`paid (${app.price})`);
		if (String(app.ad_supported) === 'true') parts.push('ad-supported');
		if (String(app.in_app_purchases) === 'true') parts.push('with in-app purchases');
		return parts.length > 0 ? parts.join(', ') : null;
	});

	// Format large numbers with context
	const installsFormatted = $derived(app.installs ? formatNumber(app.installs) : null);
	const ratingsFormatted = $derived(app.rating_count ? formatNumber(app.rating_count) : null);

	// Rating quality
	const ratingQuality = $derived.by(() => {
		if (!app.rating) return null;
		const r = Number(app.rating);
		if (r >= 4.5) return 'excellent';
		if (r >= 4.0) return 'good';
		if (r >= 3.5) return 'average';
		if (r >= 3.0) return 'mixed';
		return 'poor';
	});

	// Weekly/monthly stats
	const weeklyInstalls = $derived(app.installs_sum_1w ? formatNumber(app.installs_sum_1w) : null);
	const weeklyRatings = $derived(app.ratings_sum_1w ? formatNumber(app.ratings_sum_1w) : null);
	const monthlyInstalls = $derived(app.installs_sum_4w ? formatNumber(app.installs_sum_4w) : null);
	const monthlyActiveUsers = $derived(
		app.monthly_active_users && app.monthly_active_users > 0
			? formatNumber(app.monthly_active_users)
			: null
	);
	const monthlyAdRevenue = $derived(Number(app.monthly_ad_revenue) || 0);
	const monthlyIapRevenue = $derived(Number(app.monthly_iap_revenue) || 0);
	const monthlyRevenueTotal = $derived(monthlyAdRevenue + monthlyIapRevenue);
	const monthlyRevenueBucket = $derived(
		monthlyRevenueTotal > 0 ? getRevenueBucket(monthlyRevenueTotal) : null
	);
	const monthlyAdRevenueShare = $derived(
		monthlyRevenueTotal > 0 ? Math.round((monthlyAdRevenue / monthlyRevenueTotal) * 100) : 0
	);
	const monthlyIapRevenueShare = $derived(
		monthlyRevenueTotal > 0 ? 100 - monthlyAdRevenueShare : 0
	);
	const releaseMonthYear = $derived(
		app.release_date
			? new Date(app.release_date).toLocaleDateString('en-US', {
					month: 'short',
					year: 'numeric'
				})
			: null
	);

	// Format date helper
	const formatDate = (dateStr: string | undefined | null): string | null => {
		if (!dateStr) return null;
		try {
			return new Date(dateStr).toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				year: 'numeric'
			});
		} catch {
			return null;
		}
	};

	// Ad and API tracking info
	const adCreativeCount = $derived(app.ad_creative_count ?? 0);
	const adMonetizedCreativeCount = $derived(app.ad_monetized_creative_count ?? 0);
	const hasAdMonetization = $derived(adMonetizedCreativeCount > 0);
	const apiLastCrawled = $derived(formatDate(app.api_last_crawled));
	const sdkLastCrawled = $derived(formatDate(app.sdk_last_crawled));

	// SDK category summary
	const sdkCategories = $derived.by(() => {
		if (!sdkOverview?.company_categories || !companyTypes?.types) return null;
		const cats = sdkOverview.company_categories;
		const typeNames = companyTypes.types;
		const entries = Object.entries(cats)
			.map(([slug, companies]) => ({
				slug,
				label: typeNames.find((t) => t.url_slug === slug)?.name || slug,
				count: companies.length,
				firstCompany: companies[0]?.company_name
			}))
			.filter((e) => e.count > 0)
			.sort((a, b) => b.count - a.count);
		return entries.length > 0 ? entries : null;
	});

	// Base path for app links
	const appBasePath = $derived(`/apps/${app.store_id}`);
</script>

<div class="space-y-3 text-sm leading-relaxed">
	<!-- Main Summary Paragraph -->
	<h2 class="text-lg font-bold">{app.name} Summary</h2>
	<p>
		<strong>{app.name}</strong> is a
		{#if monetization}{monetization}{:else}mobile{/if}
		{platformName} app
		{#if categoryName}in <span class="font-medium">{categoryName}</span>{/if}
		{#if app.developer_name}
			by <span class="font-medium">{app.developer_name}</span>{/if}.
		{#if releaseMonthYear}
			Released in <span class="font-semibold">{releaseMonthYear}</span>
			{#if appAge}({appAge} ago){/if}.
		{/if}
		{#if installsFormatted && isAndroid}
			It has about <span class="font-semibold">{installsFormatted}+</span> installs
		{/if}
		{#if ratingsFormatted}
			{#if installsFormatted && isAndroid}and{:else}It has{/if}
			<span class="font-semibold">{ratingsFormatted}</span> ratings
			{#if app.rating}
				with a <span class="font-semibold">{Number(app.rating).toFixed(2)}★</span> ({ratingQuality})
				average
			{/if}.
		{/if}
		{#if monthlyActiveUsers || monthlyRevenueBucket}
			Based on AppGoblin estimates,
			{#if monthlyActiveUsers}
				it reaches roughly <span class="font-semibold">{monthlyActiveUsers}</span> monthly active users
			{/if}
			{#if monthlyActiveUsers && monthlyRevenueBucket}and{/if}
			{#if monthlyRevenueBucket}
				generates around <span class="font-semibold">{monthlyRevenueBucket}</span> monthly revenue ({monthlyIapRevenueShare}%
				IAP / {monthlyAdRevenueShare}% ads)
			{/if}.
		{/if}
		{#if app.store_last_updated}
			Store last updated <span class="font-semibold">{formatDate(app.store_last_updated)}</span>
		{/if}
	</p>

	<!-- Growth & Activity -->
	{#if (weeklyInstalls && isAndroid) || weeklyRatings}
		<p>
			<span class="font-medium -200">Recent activity:</span>
			{#if weeklyInstalls && isAndroid}
				<span class="font-semibold">{weeklyInstalls}</span> installs this week
				{#if monthlyInstalls}(<span class="font-semibold">{monthlyInstalls}</span> over 4 weeks){/if}
				{#if installGrowth}showing <span class="font-medium">{installGrowth}</span> growth{/if}
			{/if}
			{#if weeklyRatings}
				{#if weeklyInstalls && isAndroid}, and{/if}
				<span class="font-semibold">{weeklyRatings}</span> new ratings this week
			{/if}
			<a href="{appBasePath}/trends">View trends →</a>
		</p>
	{/if}

	<!-- Advertising Intelligence -->
	{#if adCreativeCount > 0 || hasAdMonetization}
		<p>
			<span class="font-medium -200">Advertising:</span>
			{#if adCreativeCount > 0}
				AppGoblin has tracked <a href="{appBasePath}/top-mobile-advertisers" class="font-semibold"
					>{formatNumber(adCreativeCount)} ad creatives</a
				> this app uses for paid user acquisition across ad networks.
			{/if}
			{#if adMonetizedCreativeCount > 0}
				{#if adCreativeCount > 0}AppGoblin also{/if}
				{#if adCreativeCount === 0}AppGoblin{/if} detected
				<a href="{appBasePath}/monetized-ads" class="font-semibold"
					>{formatNumber(adMonetizedCreativeCount)} monetized ad creatives</a
				>
				shown inside the app.
			{/if}
		</p>
	{/if}
	<!-- SDK Categories Summary -->
	{#if sdkCategories}
		<p>
			<span class="font-medium -200">SDK intelligence:</span>
			AppGoblin detected
			{#each sdkCategories as cat, i}
				{#if i > 0 && i === sdkCategories.length - 1}
					and
				{/if}
				<span class="font-semibold">{cat.count}</span>
				{cat.label.toLowerCase()}{#if cat.firstCompany && i === 0}
					(e.g. {cat.firstCompany}){/if}{#if i < sdkCategories.length - 1},
				{/if}
			{/each}
			integrated into {app.name}.
			<a href="{appBasePath}/sdks">View full SDK list →</a>
		</p>
	{/if}
	<!-- API Tracking -->
	{#if apiLastCrawled}
		<p>
			<span class="font-medium -200">Data tracking:</span>
			{#if sdkLastCrawled}The app's{:else}The app's{/if}
			<a href="{appBasePath}/data-flows">network data flows</a>
			(API traffic to/from the app and its SDKs) were last crawled on
			<span class="font-semibold">{apiLastCrawled}</span>.
		</p>
	{/if}
</div>
