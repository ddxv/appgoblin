<script lang="ts">
	import { TrendingUpIcon, TrendingDownIcon } from 'lucide-svelte';
	import IconDownload from '$lib/svg/IconDownload.svelte';
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
	<h1 class="p-0 md:p-2 text-primary-900-100 text-3xl font-bold">{app.name}</h1>
	<div class="grid grid-cols-1 gap-2 p-0 md:p-2 text-primary-900-100 text-xl">
		<!-- Installs -->
		<div class="inline-flex">
			{#if app.installs != '0' && app.installs != 'N/A'}
				<IconDownload />
				{app.installs}
			{:else if app.rating_count != '0' && app.rating_count != 'N/A'}
				Installs: ~{formatNumber(Number(app.rating_count.replace(/,/g, '')) * 50)}
				- {formatNumber(Number(app.rating_count.replace(/,/g, '')) * 100)}
			{:else}
				Installs not yet available
			{/if}
		</div>

		<!-- Ratings -->
		{#if app.rating_count != '0' && app.rating_count != 'N/A'}
			<div>
				Ratings: {app.rating_count}
			</div>
		{:else}
			Ratings not yet available
		{/if}

		<div class="text-sm">
			{#if app.installs_z_score_2w > 0}
				<div class="inline-flex">
					<div class="text-success-900-100">
						<TrendingUpIcon />
					</div>
					Trending Up
				</div>
			{:else if app.installs_z_score_2w < 0}
				<div class="inline-flex">
					<div class="text-danger-900-100">
						<TrendingDownIcon />
					</div>
					Trending Down
				</div>
			{/if}

			{#if app.installs_z_score_2w == 0 && app.rating_z_score_2w > 0}
				<div class="inline-flex">
					<div class="text-success-900-100">
						<TrendingUpIcon />
					</div>
					Trending Up
				</div>
			{:else if app.installs_z_score_2w == 0 && app.rating_z_score_2w < 0}
				<div class="inline-flex">
					<div class="text-danger-900-100">
						<TrendingDownIcon />
					</div>
					Trending Down
				</div>
			{/if}

			{#if app.installs_sum_1w > 0}
				<p class="text-primary-800-200">
					+{formatNumber(app.installs_sum_1w)} (week)
				</p>
			{/if}
			{#if app.installs_sum_4w > 0}
				<p class="text-primary-600-400">
					+{formatNumber(app.installs_sum_4w)}
					(month)
				</p>
			{/if}

			{#if app.ratings_sum_1w > 0}
				<p class="text-primary-600-400">
					+{formatNumber(app.ratings_sum_1w)}
					(week)
				</p>
			{/if}
			{#if app.ratings_sum_4w > 0}
				<p class="text-primary-600-400">
					+{formatNumber(app.ratings_sum_4w)}
					(month)
				</p>
			{/if}
		</div>
	</div>
</div>
