<script lang="ts">
	import { page } from '$app/state';
	import { ChartLine, ChartBar, Boxes, Key, TrendingUp, FileText } from 'lucide-svelte';

	let { isAndroidApp, myapp } = $props();

	const textGreyedOutColor = 'text-surface-700-300';

	let myTabs = {
		types: [
			{
				name: 'Overview',
				url_slug: '',
				icon: ChartLine
			},
			{
				name: 'Trends',
				url_slug: 'trends',
				icon: TrendingUp
			},
			{
				name: 'SDKs',
				url_slug: 'sdks',
				icon: Boxes
			},
			{
				name: 'Keywords',
				url_slug: 'keywords',
				icon: Key
			},
			{
				name: 'Store Rankings',
				url_slug: 'ranks',
				icon: ChartBar
			},
			...(isAndroidApp
				? [
						{
							name: 'Data & API Calls',
							url_slug: 'data-flows',
							icon: FileText
						}
					]
				: []),

			{
				name: 'App-Ads.txt',
				url_slug: 'ads-txt',
				icon: FileText
			}
		]
	};

	function typeTabClass(tab: string) {
		const baseClass =
			'flex items-center gap-2 px-4 py-3 font-medium transition-colors duration-200';
		const selectedClass = 'text-primary-500 bg-surface-100-900 hover:bg-primary-500/5';
		const unselectedClass =
			'border-transparent hover:text-primary-400 hover:border-primary-400/30 hover:bg-primary-900-100/50';
		const unselectedGreyClass =
			'border-transparent hover:text-surface-700-200-token hover:border-surface-700-200-token/30 hover:bg-surface-100-900/50';
		if (tab === '') {
			if (page.url.pathname === `/apps/${page.params.id}`) {
				return `${baseClass} ${selectedClass}`;
			} else {
				return `${baseClass} ${unselectedClass}`;
			}
		}

		if (page.url.pathname.startsWith(`/apps/${page.params.id}/${tab}`)) {
			return `${baseClass} ${selectedClass}`;
		} else {
			if (tab === 'sdks') {
				return `${baseClass} ${unselectedGreyClass}`;
			} else {
				return `${baseClass} ${unselectedClass}`;
			}
		}
	}

	function tabTextClass(tab: string) {
		if (tab === 'sdks' && !myapp.sdk_successful_last_crawled) {
			return textGreyedOutColor;
		} else if (tab === 'data-flows' && !myapp.api_successful_last_crawled) {
			return textGreyedOutColor;
		} else if (tab === 'ads-txt' && myapp.adstxt_crawl_result != 1) {
			return textGreyedOutColor;
		} else {
			return '';
		}
	}
</script>

<div class="flex flex-wrap gap-1 text-sm md:text-base overflow-x-auto">
	{#each myTabs.types as tab}
		{@const Component = tab.icon}
		<a
			href={`/apps/${page.params.id}/${tab.url_slug}`}
			class={typeTabClass(tab.url_slug)}
			data-sveltekit-preload-data
		>
			<Component size={20} strokeWidth={1.5} class={tabTextClass(tab.url_slug)} />
			<span class={tabTextClass(tab.url_slug)}>{tab.name}</span>
		</a>
	{/each}
</div>

<style>
	:global(.selected-tab) {
		background-color: var(--color-primary-100-900);
		color: var(--color-surface-50-950);
		border-bottom: 2px solid var(--color-primary-100-900);
	}
</style>
