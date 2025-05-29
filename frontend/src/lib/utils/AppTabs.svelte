<script lang="ts">
	import { page } from '$app/state';
	import { ChartLine, ChartBar, Boxes, Key, TrendingUp, FileText } from 'lucide-svelte';

	let { isAndroidApp } = $props();

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
			'text-surface-700-200-token border-transparent hover:text-primary-400 hover:border-primary-400/30 hover:bg-primary-900-100/50';

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
			return `${baseClass} ${unselectedClass}`;
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
			<Component size={20} strokeWidth={1.5} class="text-current" />
			<span>{tab.name}</span>
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
