<script lang="ts">
	import { TrendingUpIcon, TrendingDownIcon } from 'lucide-svelte';
	import IconDownload from '$lib/svg/IconDownload.svelte';
	import Star from './Star.svelte';
	import { formatNumber } from '$lib/utils/formatNumber';
	import type { AppFullDetail } from '../types';
	interface Props {
		app: AppFullDetail;
	}

	let { app }: Props = $props();

	// Remove the local formatNumber function (lines 11-16)
</script>

<div class="inline-block">
	<div
		class="grid grid-cols-2 md:grid-cols-1 p-0 md:p-2 text-primary-900-100 text-xl gap-0 md:gap-4"
	>
		<div class="items-center">
			{#if app.installs != '0' && app.installs != 'N/A'}
				<div class="flex items-center gap-2">
					<IconDownload />
					<span class="font-medium">{app.installs}</span>
				</div>
			{:else if app.rating_count != '0' && app.rating_count != 'N/A'}
				<div class="flex items-center">
					<IconDownload />
					<span class="font-medium">
						~{formatNumber(Number(app.rating_count.replace(/,/g, '')) * 50)}
						- {formatNumber(Number(app.rating_count.replace(/,/g, '')) * 100)}</span
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

		<!-- installs week trend -->
		{#if app.installs_sum_1w > 0}
			<div class="flex items-center gap-1 text-primary-800-200">
				<span class="text-primary-600-400 text-xs md:text-base">
					+{formatNumber(app.installs_sum_1w)}
					weekly installs
					{#if app.installs_z_score_2w > 1 || (app.installs_z_score_2w == 0 && app.ratings_z_score_2w > 1)}
						<div class="flex items-center gap-1 text-success-900-100">
							<TrendingUpIcon />
						</div>
					{:else if app.installs_z_score_2w < -1 || (app.installs_z_score_2w == 0 && app.ratings_z_score_2w < -1)}
						<div class="flex items-center gap-1 text-danger-900-100">
							<TrendingDownIcon />
						</div>
					{:else}
						<div class="flex items-center gap-0 text-primary-600-400 text-xs">
							<span>trend steady</span>
						</div>
					{/if}
				</span>
			</div>
		{/if}
		<!-- installs month trend -->
		{#if app.installs_sum_4w > 0}
			<div class="flex items-center gap-1 text-primary-800-200">
				<span class="text-primary-600-400 text-xs md:text-base">
					+{formatNumber(app.installs_sum_4w)}
					monthly installs
					{#if app.installs_z_score_4w > 1 || (app.installs_z_score_4w == 0 && app.ratings_z_score_4w > 1)}
						<div class="flex items-center gap-1 text-success-900-100">
							<TrendingUpIcon />
						</div>
					{:else if app.installs_z_score_4w < -1 || (app.installs_z_score_4w == 0 && app.ratings_z_score_4w < -1)}
						<div class="flex items-center gap-1 text-danger-900-100">
							<TrendingDownIcon />
						</div>
					{:else}
						<div class="flex items-center gap-1 text-primary-600-400 text-xs">
							<span>trend steady</span>
						</div>
					{/if}
				</span>
			</div>
		{/if}

		<!-- ratings week trend -->
		{#if app.installs == 'N/A'}
			{#if app.ratings_sum_1w > 0}
				<div class="flex items-center gap-1 text-primary-800-200">
					<span>+{formatNumber(app.ratings_sum_1w)}</span>
					<span class="text-primary-600-400 text-sm md:text-base">(week)</span>
					{#if app.ratings_z_score_2w > 1}
						<div class="flex items-center gap-1 text-success-900-100">
							<TrendingUpIcon />
						</div>
					{:else if app.ratings_z_score_2w < -1}
						<div class="flex items-center gap-1 text-danger-900-100">
							<TrendingDownIcon />
						</div>
					{:else}
						<div class="flex items-center gap-1 text-primary-600-400 text-xs">
							<span>Trend Steady</span>
						</div>
					{/if}
				</div>
			{/if}
			<!-- ratings month trend -->
			{#if app.ratings_sum_4w > 0}
				<div class="flex items-center gap-1 text-primary-800-200">
					<span>+{formatNumber(app.ratings_sum_4w)}</span>
					<span class="text-primary-600-400 text-sm md:text-base">(month)</span>
					{#if app.ratings_z_score_4w > 1}
						<div class="flex items-center gap-1 text-success-900-100">
							<TrendingUpIcon />
						</div>
					{:else if app.ratings_z_score_4w < -1}
						<div class="flex items-center gap-1 text-danger-900-100">
							<TrendingDownIcon />
						</div>
					{:else}
						<div class="flex items-center gap-1 text-primary-600-400 text-xs">
							<span>Trend Steady</span>
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</div>
</div>
