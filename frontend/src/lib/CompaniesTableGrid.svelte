<script lang="ts">
	import { page } from '$app/state';
	import type { Snippet } from 'svelte';
	import { formatNumber } from '$lib/utils/formatNumber';
	import WhiteCard from './WhiteCard.svelte';

	let {
		mainTable,
		showIntro = true
	}: {
		mainTable: Snippet;
		showIntro?: boolean;
	} = $props();

	const typeName = $derived(
		page.params.type
			? (page.data?.companyTypes?.types?.find(
					(t: { url_slug: string }) => t.url_slug === page.params.type
				)?.name ?? 'companies')
			: null
	);
	const categoryName = $derived(
		page.data?.appCats?.categories?.find((c: { id: string }) => c.id === page.params.category)
			?.name ??
			page.params.category ??
			'All'
	);
	const TYPE_DESCRIPTIONS: Record<string, string> = {
		'ad-networks':
			'Ad Networks includes any company that provides monetization for mobile apps by displaying ads to users. The ad network data comes from api, sdk and app-ads.txt files.',
		'ad-attribution':
			'Ad Attribution / MMP companies track and attribute app installs and user actions to specific marketing campaigns. Attribution is a tightly controlled set of companies by the self attributing ad networks such as Apple, Google and Meta. MMPs collect user data and share with ad networks.',
		'product-analytics':
			'Product Analytics providers offer tools to track user behavior, app performance, and other metrics to help developers optimize their apps and improve user retention.',
		'development-tools':
			'Development Tools include SDKs, libraries, and platforms that assist developers in building, testing, and deploying mobile applications.',
		'business-tools':
			'A bit of a catch all for companies that provide SDKs for mobile apps. This ranges from cloud services, more traditional CRM tools, revenue management tools, paywall tools etc.',
		mediation:
			'Mediation platforms (which are ad networks) manage the ad bidding to help mobile apps get higher CPMs.'
	};

	const introText = $derived.by(() => {
		const typeSlug = page.params.type;
		const typeLabel = typeName ?? 'companies';
		const categoryLabel = categoryName || 'All';
		const typeDesc =
			typeSlug && TYPE_DESCRIPTIONS[typeSlug]
				? TYPE_DESCRIPTIONS[typeSlug]
				: `This table lists top ${typeLabel}.`;
		if (categoryLabel !== 'All') {
			return `${typeDesc} Shown here for apps in the ${categoryLabel} category.`;
		}
		return `${typeDesc} Shown across all app categories.`;
	});

	const isFiltered = $derived(!!(page.params.type || page.params.category));
	const filteredLead = $derived.by(() => {
		const typeLabel = typeName ?? 'companies';
		const catLabel = categoryName && categoryName !== 'All' ? categoryName : null;
		if (catLabel) {
			return `Browse ${typeLabel} found in ${catLabel} apps across iOS and Android.`;
		}
		return `Browse ${typeLabel} across iOS and Android apps.`;
	});
</script>

{#if showIntro}
	<div class="text-sm md:text-base leading-relaxed space-y-4 mb-6">
		{#if isFiltered}
			<p>{filteredLead}</p>
			<p class="text-surface-600-400">{introText}</p>
		{:else}
			<p>
				Explore the top 1,000 companies and domains powering the mobile ecosystem. Updated
				continuously with SDK, API, and app-ads.txt intelligence, this free dashboard helps
				researchers, growth teams, and fraud analysts compare market presence and technical
				footprints across millions of iOS and Android apps.
			</p>
		{/if}

		<div>
			<h2 class="text-lg md:text-xl font-semibold mb-2">Features</h2>
			<ul class="list-disc list-outside ml-5 space-y-1">
				{#if !isFiltered}
					<li>
						<span class="font-semibold">Categorization:</span> Browse top players across Ad Networks,
						Trackers, MMPs, Business Tools, and Development Tools.
					</li>
				{/if}
				<li>
					<span class="font-semibold">More Insights:</span> Click any company to view detailed historical
					data, quarterly market share changes, and top app clients.
				</li>
				<li>
					<span class="font-semibold">Free Export:</span> Download the dataset as a CSV.
				</li>
			</ul>
		</div>

		{#if !isFiltered}
			<blockquote class="border-l-4 border-surface-300-700 pl-4 italic">
				<span class="font-semibold not-italic">Can't find a specific company?</span> The table below features
				the top 1,000 domains across all categories. Use the site-wide search bar at the top of the page
				to find specific or long-tail companies or domains.
			</blockquote>
		{/if}
	</div>
{/if}

<div class="grid grid-cols-1 gap-8 mt-6">
	<!-- MAIN TABLE -->
	{@render mainTable()}
</div>
