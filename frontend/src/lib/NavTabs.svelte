<script lang="ts">
	import { page } from '$app/state';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';

	const topBarFont = 'text-xs md:text-base hover:text-primary-900-100';
	const topBarHighlightedFont = 'text-xs md:text-base text-primary-900-100';
	const myDivider = 'h-px w-[50%] md:h-12 md:w-px bg-secondary-100-900';
	const topDivider =
		'w-full border-t-[1px] md:border-t-0 md:border-b-[1px] border-secondary-100-900 p-1 xxl:p-2';
	const dropdownItem =
		'block px-4 py-2 text-xs md:text-base hover:text-primary-900-100 hover:preset-tonal w-full text-left whitespace-nowrap';
	const dropdownHighlightedItem =
		'block px-4 py-2 text-xs md:text-base text-primary-900-100 preset-tonal w-full text-left whitespace-nowrap';

	function isHighlighted(...paths: string[]) {
		return paths.some((p) => page.url.pathname.startsWith(p));
	}

	let { hideLinks = false, flat = false } = $props();
</script>

{#if flat || hideLinks}
	<!-- Flat list used inside the mobile hamburger menu -->
	<div class="flex flex-col gap-1 text-center items-center {topDivider} mx-2">
		{#if !hideLinks}
			<!-- RANKINGS group -->
			<p class="text-xs font-semibold text-surface-400-600 uppercase tracking-widest pt-1">
				Rankings
			</p>
			<a
				href="/rankings/store/1/collection/1/category/1/US"
				class={isHighlighted('/rankings') ? topBarHighlightedFont : topBarFont}>APP RANKS</a
			>
			<div class={myDivider}></div>
			<a
				href="/fastest-growing-apps/google/overall"
				class={isHighlighted('/fastest-growing-apps') ? topBarHighlightedFont : topBarFont}
				>TOP GROWTH APPS</a
			>
			<div class={myDivider}></div>
			<a
				href="/collections/new_monthly/google/overall"
				class={isHighlighted('/collections') ? topBarHighlightedFont : topBarFont}>NEW APPS</a
			>
			<div class={myDivider}></div>
			<!-- INTELLIGENCE group -->
			<p class="text-xs font-semibold text-surface-400-600 uppercase tracking-widest pt-1">
				Intelligence
			</p>
			<a href="/companies" class={isHighlighted('/companies') ? topBarHighlightedFont : topBarFont}
				>COMPANY RANKS</a
			>
			<div class={myDivider}></div>
			<a
				href="/ad-creatives"
				class={isHighlighted('/ad-creatives') ? topBarHighlightedFont : topBarFont}
				>TOP ADVERTISERS</a
			>
			<div class={myDivider}></div>
			<a
				href="/app-explorer"
				class={isHighlighted('/app-explorer') ? topBarHighlightedFont : topBarFont}>APP EXPLORER</a
			>
			<div class={myDivider}></div>
			<a href="/sdks" class={isHighlighted('/sdks') ? topBarHighlightedFont : topBarFont}>SDKS</a>
			<div class={myDivider}></div>
			<!-- RESOURCES group -->
			<p class="text-xs font-semibold text-surface-400-600 uppercase tracking-widest pt-1">
				Resources
			</p>
			<a href="/blog" class={isHighlighted('/blog') ? topBarHighlightedFont : topBarFont}>BLOG</a>
			<div class={myDivider}></div>
			<a href="/reports" class={isHighlighted('/reports') ? topBarHighlightedFont : topBarFont}
				>REPORTS</a
			>
			<div class={myDivider}></div>
		{/if}
		<a href="/pricing" class={isHighlighted('/pricing') ? topBarHighlightedFont : topBarFont}
			>PRICING</a
		>
		<div class={myDivider}></div>
		<a href="/about" class={isHighlighted('/about') ? topBarHighlightedFont : topBarFont}>ABOUT</a>
	</div>
{:else}
	<!-- Desktop dropdown bar -->
	<div class="flex flex-row gap-1 md:gap-2 xxl:gap-6 text-center items-center {topDivider} mx-2">
		<!-- RANKINGS dropdown -->
		<div class="relative group">
			<button
				class="flex items-center gap-0.5 {isHighlighted(
					'/rankings',
					'/fastest-growing-apps',
					'/collections'
				)
					? topBarHighlightedFont
					: topBarFont}"
			>
				RANKINGS <ChevronDown class="h-3 w-3 transition-transform group-hover:rotate-180" />
			</button>
			<div class="absolute left-0 top-full pt-1 hidden group-hover:block z-50 min-w-max">
				<div class="card bg-surface-50-950 shadow-xl rounded-md py-1">
					<a
						href="/rankings/store/1/collection/1/category/1/US"
						class={isHighlighted('/rankings') ? dropdownHighlightedItem : dropdownItem}>App Ranks</a
					>
					<a
						href="/fastest-growing-apps/google/overall"
						class={isHighlighted('/fastest-growing-apps') ? dropdownHighlightedItem : dropdownItem}
						>Top Growth Apps</a
					>
					<a
						href="/collections/new_monthly/google/overall"
						class={isHighlighted('/collections') ? dropdownHighlightedItem : dropdownItem}
						>New Apps</a
					>
				</div>
			</div>
		</div>

		<div class={myDivider}></div>

		<!-- INTELLIGENCE dropdown -->
		<div class="relative group">
			<button
				class="flex items-center gap-0.5 {isHighlighted(
					'/companies',
					'/ad-creatives',
					'/app-explorer',
					'/sdks'
				)
					? topBarHighlightedFont
					: topBarFont}"
			>
				INTELLIGENCE <ChevronDown class="h-3 w-3 transition-transform group-hover:rotate-180" />
			</button>
			<div class="absolute left-0 top-full pt-1 hidden group-hover:block z-50 min-w-max">
				<div class="card bg-surface-50-950 shadow-xl rounded-md py-1">
					<a
						href="/companies"
						class={isHighlighted('/companies') ? dropdownHighlightedItem : dropdownItem}
						>Company Ranks</a
					>
					<a
						href="/ad-creatives"
						class={isHighlighted('/ad-creatives') ? dropdownHighlightedItem : dropdownItem}
						>Top Advertisers</a
					>
					<a
						href="/app-explorer"
						class={isHighlighted('/app-explorer') ? dropdownHighlightedItem : dropdownItem}
						>App Explorer</a
					>
					<a href="/sdks" class={isHighlighted('/sdks') ? dropdownHighlightedItem : dropdownItem}
						>SDKs</a
					>
				</div>
			</div>
		</div>

		<div class={myDivider}></div>

		<!-- RESOURCES dropdown -->
		<div class="relative group">
			<button
				class="flex items-center gap-0.5 {isHighlighted('/blog', '/reports')
					? topBarHighlightedFont
					: topBarFont}"
			>
				RESOURCES <ChevronDown class="h-3 w-3 transition-transform group-hover:rotate-180" />
			</button>
			<div class="absolute left-0 top-full pt-1 hidden group-hover:block z-50 min-w-max">
				<div class="card bg-surface-50-950 shadow-xl rounded-md py-1">
					<a href="/blog" class={isHighlighted('/blog') ? dropdownHighlightedItem : dropdownItem}
						>Blog</a
					>
					<a
						href="/reports"
						class={isHighlighted('/reports') ? dropdownHighlightedItem : dropdownItem}>Reports</a
					>
				</div>
			</div>
		</div>

		<div class={myDivider}></div>

		<a href="/pricing" class={isHighlighted('/pricing') ? topBarHighlightedFont : topBarFont}
			>PRICING</a
		>

		<div class={myDivider}></div>

		<a href="/about" class={isHighlighted('/about') ? topBarHighlightedFont : topBarFont}>ABOUT</a>
	</div>
{/if}
