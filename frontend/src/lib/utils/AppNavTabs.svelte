<script lang="ts">
	import { page } from '$app/state';
	import type { AppFullDetail } from '../../types';
	import SubNavTabs from './SubNavTabs.svelte';
	import type { SubNavTabItem } from './SubNavTabs.svelte';
	import ChartLine from 'lucide-svelte/icons/chart-line';
	import ChartBar from 'lucide-svelte/icons/chart-bar';
	import Boxes from 'lucide-svelte/icons/boxes';
	import Key from 'lucide-svelte/icons/key';
	import TrendingUp from 'lucide-svelte/icons/trending-up';
	import FileText from 'lucide-svelte/icons/file-text';
	import Image from 'lucide-svelte/icons/image';

	let { isAndroidApp, myapp }: { isAndroidApp: boolean; myapp: AppFullDetail } = $props();

	function isTabDimmed(slug: string): boolean {
		if (slug === 'sdks' && !myapp.sdk_successful_last_crawled) return true;
		if (slug === 'data-flows' && !myapp.api_successful_last_crawled) return true;
		return false;
	}

	function getSlugFromPath(pathname: string): string {
		const path = pathname.replace(`/apps/${page.params.id}`, '') || '/';
		if (path === '/') return 'overview';
		return path.replace(/^\//, '');
	}

	let currentSlug = $derived(getSlugFromPath(page.url.pathname));

	let tabs = $derived.by((): SubNavTabItem[] => {
		const items: SubNavTabItem[] = [
			{
				slug: 'overview',
				label: 'Overview',
				href: `/apps/${page.params.id}`,
				icon: ChartLine
			},
			{
				slug: 'trends',
				label: 'Trends',
				href: `/apps/${page.params.id}/trends`,
				icon: TrendingUp
			},
			{
				slug: 'sdks',
				label: 'SDKs',
				href: `/apps/${page.params.id}/sdks`,
				icon: Boxes,
				dimmed: isTabDimmed('sdks')
			},
			{
				slug: 'keywords',
				label: 'Keywords',
				href: `/apps/${page.params.id}/keywords`,
				icon: Key
			},
			{
				slug: 'ranks',
				label: 'Store Rankings',
				href: `/apps/${page.params.id}/ranks`,
				icon: ChartBar
			}
		];

		if (isAndroidApp) {
			items.push({
				slug: 'data-flows',
				label: 'Data & API Calls',
				href: `/apps/${page.params.id}/data-flows`,
				icon: FileText,
				dimmed: isTabDimmed('data-flows')
			});

			if ((myapp.ad_creative_count ?? 0) > 0) {
				items.push({
					slug: 'ad-creatives',
					label: 'Ad Creatives',
					href: `/apps/${page.params.id}/ad-creatives`,
					icon: Image
				});
				items.push({
					slug: 'ad-placements',
					label: 'Ad Placements',
					href: `/apps/${page.params.id}/ad-placements`,
					icon: Image
				});
			}

			if ((myapp.ad_monetized_creative_count ?? 0) > 0) {
				items.push({
					slug: 'monetized-ads',
					label: 'Monetized Ad Creatives',
					href: `/apps/${page.params.id}/monetized-ads`,
					icon: Image
				});
			}
		}

		if (myapp.adstxt_crawl_result === 1) {
			items.push({
				slug: 'ads-txt',
				label: 'App-Ads.txt',
				href: `/apps/${page.params.id}/ads-txt`,
				icon: FileText
			});
		}

		return items;
	});
</script>

<SubNavTabs {tabs} {currentSlug} ariaLabel="App sections" menuLabel="App Menu" />
