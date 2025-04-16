<script lang="ts">
	import { TrendingUpIcon, TrendingDownIcon } from 'lucide-svelte';
	import IconDownload from '$lib/svg/IconDownload.svelte';
	import Star from './Star.svelte';
	import type { AppFullDetail } from '../types';
	interface Props {
		app: AppFullDetail;
	}

	let { app }: Props = $props();

	function formatNumber(num: number) {
		if (num >= 1000000000000) return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
		if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
		if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
		if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
		return num;
	}
</script>

<div class="inline-block">
	<div class="grid grid-cols-1 p-0 md:p-2 text-primary-900-100 text-xl gap-1 md:gap-4">
		<div class="items-center">
			{#if app.installs != '0' && app.installs != 'N/A'}
				<div class="flex items-center gap-2">
					<IconDownload />
					<span class="font-medium">{app.installs}</span>
				</div>
			{:else if app.rating_count != '0' && app.rating_count != 'N/A'}
				<div class="flex items-center">
					<IconDownload />
					<span class="font-medium"
						>~{formatNumber(Number(app.rating_count.replace(/,/g, '')) * 50)}</span
					>
					<span class="text-sm text-primary-600-400"
						>- {formatNumber(Number(app.rating_count.replace(/,/g, '')) * 100)}</span
					>
				</div>
			{:else}
				<span class="text-primary-600-400">Installs not yet available</span>
			{/if}
		</div>

		{#if app.rating_count != '0' && app.rating_count != 'N/A'}
			<div class="flex items-center gap-2">
				<Star />
				<span class="font-medium"> {app.rating_count}</span>
			</div>
		{:else}
			<span class="text-primary-600-400">Ratings not yet available</span>
		{/if}

		{#if app.installs_z_score_2w > 0 || (app.installs_z_score_2w == 0 && app.rating_z_score_2w > 0)}
			<div class="flex items-center gap-1 text-success-900-100">
				<TrendingUpIcon />
				<span>Trending Up</span>
			</div>
		{:else if app.installs_z_score_2w < 0 || (app.installs_z_score_2w == 0 && app.rating_z_score_2w < 0)}
			<div class="flex items-center gap-1 text-danger-900-100">
				<TrendingDownIcon />
				<span>Trending Down</span>
			</div>
		{/if}

		{#if app.installs_sum_1w > 0}
			<div class="flex items-center gap-1 text-primary-800-200">
				<span>+{formatNumber(app.installs_sum_1w)}</span>
				<span class="text-primary-600-400">(week)</span>
			</div>
		{/if}
		{#if app.installs_sum_4w > 0}
			<div class="flex items-center gap-1 text-primary-600-400">
				<span>+{formatNumber(app.installs_sum_4w)}</span>
				<span>(month)</span>
			</div>
		{/if}

		{#if app.ratings_sum_1w > 0}
			<div class="flex items-center gap-1 text-primary-600-400">
				<span>+{formatNumber(app.ratings_sum_1w)}</span>
				<span>(week)</span>
			</div>
		{/if}
		{#if app.ratings_sum_4w > 0}
			<div class="flex items-center gap-1 text-primary-600-400">
				<span>+{formatNumber(app.ratings_sum_4w)}</span>
				<span>(month)</span>
			</div>
		{/if}
	</div>
</div>
