<script lang="ts">
	import Crown from 'lucide-svelte/icons/crown';

	export interface SubNavTabItem {
		slug: string;
		label: string;
		href: string;
		icon?: typeof import('lucide-svelte').ChartLine;
		count?: number | null;
		b2b?: boolean;
		/**
		 * Optional extra slugs that should also count this tab as active
		 * (e.g. 'app-adstxt-publisher' matching the 'app-adstxt' tab).
		 */
		matchSlugs?: string[];
		/**
		 * When true and the tab is not active, renders at 50% opacity to indicate
		 * the data comes from a parent company rather than directly.
		 */
		dimmed?: boolean;
		/**
		 * When set, renders as a non-clickable section heading instead of a link.
		 */
		sectionLabel?: string;
		/**
		 * Adds left padding to indent this item under a section header.
		 */
		indent?: boolean;
	}

	let {
		tabs,
		currentSlug,
		ariaLabel = 'Navigation tabs'
	}: {
		tabs: SubNavTabItem[];
		currentSlug: string;
		ariaLabel?: string;
	} = $props();

	function formatCount(n: number | undefined | null): string {
		if (n == null || n === 0) return '';
		if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
		if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
		return String(n);
	}

	function isTabActive(tab: SubNavTabItem): boolean {
		if (tab.slug === currentSlug) return true;
		if (tab.matchSlugs?.includes(currentSlug)) return true;
		return false;
	}

	function tabClass(tab: SubNavTabItem): string {
		const selectedClass = 'bg-secondary-100-900 text-surface-900-50 font-semibold';
		const unselectedClass = 'text-surface-700-300 hover:text-surface-900-50';

		const isActive = isTabActive(tab);
		let cls = isActive ? selectedClass : unselectedClass;
		return cls;
	}

	function labelClass(tab: SubNavTabItem): string {
		if (tab.dimmed) return 'opacity-60';
		return '';
	}
</script>

<aside class="md:sticky md:top-24 md:self-start">
	<div class="border-r border-surface-200-800 pl-1 md:pl-2 pr-2 md:pr-4">
		<nav class="flex flex-col gap-2" aria-label={ariaLabel}>
			{#each tabs as tab (tab.slug || tab.sectionLabel)}
				{#if tab.sectionLabel}
					<p
						class="mt-3 first:mt-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-surface-500"
					>
						{tab.sectionLabel}
					</p>
				{:else}
					<a
						href={tab.href}
						class="px-2 py-2 text-sm transition {tabClass(tab)} {tab.indent ? 'ml-4' : ''}"
						aria-current={isTabActive(tab) ? 'page' : undefined}
					>
						<span class="flex items-center justify-between gap-2">
							<span class="flex items-center gap-1.5 {labelClass(tab)}">
								{#if tab.icon}
									{@const Icon = tab.icon}
									<Icon size={16} class="shrink-0 {labelClass(tab)}" aria-hidden="true" />
								{/if}
								{tab.label}
								{#if tab.b2b}
									<Crown size={12} class="shrink-0 text-primary-900-100" aria-hidden="true" />
								{/if}
							</span>
							{#if tab.count}
								<span
									class="inline-flex items-center justify-center bg-secondary-100-800 px-2 py-0.5 text-xs font-semibold tabular-nums text-secondary-800-200"
								>
									{formatCount(tab.count)}
								</span>
							{/if}
						</span>
					</a>
				{/if}
			{/each}
		</nav>
	</div>
</aside>
