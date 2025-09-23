<script lang="ts">
	import Rating from '$lib/StarsRating.svelte';
	import IconDownload from '$lib/svg/IconDownload.svelte';
	import type { AppFullDetail, CompanyCreative, RankedApps } from '../types';
	import IconGoogle from './svg/IconGoogle.svelte';
	import IconiOs from './svg/IconiOS.svelte';
	import { formatNumber } from '$lib/utils/formatNumber';
	import TrendingDownIcon from 'lucide-svelte/icons/trending-down';
	import TrendingUpIcon from 'lucide-svelte/icons/trending-up';

	interface Props {
		app: AppFullDetail | CompanyCreative | RankedApps;
	}

	let { app }: Props = $props();
</script>

<div class="grid grid-cols-1 p-2">
	<div class="flex flex-1">
		<p class="text-base md:text-xl text-primary-900-100">{app.name}</p>
	</div>

	<div class="flex flex-row gap-2">
		<div class="flex flex-row gap-2">
			<div class="flex flex-1 items-center justify-center gap-2">
				{#if app.store == 1 || (app.store_link && app.store_link.includes('google.com'))}
					<IconGoogle size="20" />
				{/if}
				{#if app.store == 2 || (app.store_link && app.store_link.includes('apple.com'))}
					<IconiOs size="20" />
				{/if}
			</div>
		</div>
		<!-- Ratings: STARS (123) -->
		{#if app.rating_count && app.rating_count != 0}
			<div class="inline-flex p-1 gap-2">
				<Rating total={5} size={20} rating={app.rating} />
				{formatNumber(app.rating_count)} ratings
			</div>
		{/if}
	</div>
	<div class="flex flex-row gap-2 text-primary-900-100 text-sm md:text-base">
		<!-- Installs DownloadIcon -->
		{#if app.installs && app.installs != 0}
			<div class="block p-0">
				<div class="inline-flex items-center gap-1">
					<IconDownload />
					{formatNumber(app.installs)} installs
				</div>
			</div>
		{/if}
	</div>
	<!-- installs week trend -->
	<div class="flex items-center gap-1 text-primary-800-200 text-xs md:text-sm">
		<span class="inline-flex items-center gap-1">
			{#if app.installs_sum_1w > 0}
				+{formatNumber(app.installs_sum_4w)}
				<TrendingUpIcon /> monthly installs
			{/if}
			{#if !app.installs && app.ratings_sum_4w > 0}
				~{formatNumber(app.ratings_sum_4w * 50)}
				<TrendingUpIcon /> monthly installs
			{/if}
		</span>
	</div>
</div>
