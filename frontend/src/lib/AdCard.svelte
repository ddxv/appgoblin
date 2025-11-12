<script lang="ts">
	import type { CompanyCreative } from '../types';

	interface Props {
		creative: CompanyCreative;
	}

	let { creative: creative }: Props = $props();
</script>

<div class="card card-hover overflow-hidden">
	<!-- Creative Preview -->
	<div class="relative">
		<img
			class="h-48 w-full object-cover rounded-t-lg"
			src={creative.creative_thumb_url}
			alt="Ad creative"
			referrerpolicy="no-referrer"
			loading="lazy"
		/>
		<div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
			{creative.file_extension}
		</div>
	</div>

	<!-- Content -->
	<div class="p-4 space-y-4">
		<!-- Publisher: Shown By -->
		<div>
			<p class="text-xs text-surface-600 dark:text-surface-400 mb-2">Shown by</p>
			<a
				href={`/apps/${creative.publisher_store_id}/monetized-ads`}
				class="flex items-center gap-3 hover:opacity-80 transition-opacity"
			>
				<img
					class="h-12 w-12 rounded-lg"
					src={creative.publisher_icon_url}
					alt={creative.publisher_name}
					referrerpolicy="no-referrer"
					loading="lazy"
				/>
				<span class="text-sm font-medium truncate">{creative.publisher_name}</span>
			</a>
		</div>

		<!-- Advertiser: Advertising For (if available) -->
		{#if creative.advertiser_store_id}
			<div class="border-t border-surface-200 dark:border-surface-700 pt-4">
				<p class="text-xs text-surface-600 dark:text-surface-400 mb-2">Advertising for</p>
				<a
					href={`/apps/${creative.advertiser_store_id}/ad-placements`}
					class="flex items-center gap-3 hover:opacity-80 transition-opacity"
				>
					<img
						class="h-12 w-12 rounded-lg"
						src={creative.advertiser_icon_url}
						alt={creative.advertiser_name}
						referrerpolicy="no-referrer"
						loading="lazy"
					/>
					<span class="text-sm font-medium truncate">{creative.advertiser_name}</span>
				</a>
			</div>
		{/if}
		{#if creative.advertiser_domain_name}
			<div class="border-t border-surface-200 dark:border-surface-700 pt-4">
				<p class="text-xs text-surface-600 dark:text-surface-400 mb-2">
					Advertiser click destination
				</p>
				<span class="text-sm font-medium truncate">{creative.advertiser_domain_name}</span>
			</div>
		{/if}

		<!-- Metadata -->
		<div
			class="border-t border-surface-200 dark:border-surface-700 pt-3 text-xs text-surface-600 dark:text-surface-400"
		>
			Last seen: {creative.last_seen}
		</div>
	</div>
</div>
