<script lang="ts">
	let { data, size = 'md' } = $props();
</script>

<div class="overflow-x-auto relative">
	<div
		class="flex gap-3 snap-x snap-mandatory overflow-x-auto scrollbar-hide border-2 border-surface-100-900 p-4 pr-4"
	>
		{#each data.top_md5_hashes.slice(0, 6) as md5_hash}
			<a href="/apps/{data.advertiser_store_id}/ad-placements" class="snap-start shrink-0">
				<card class="card-hover">
					<div class="card-header justify-center">
						<img
							src="https://media.appgoblin.info/creatives/thumbs/{md5_hash}.jpg"
							alt="Creative for {data.advertiser_name}"
							class="h-{size === 'md'
								? '44'
								: size === 'sm'
									? '24'
									: '88'} w-full object-cover rounded-lg"
						/>
					</div>
				</card>
			</a>
		{/each}
	</div>
	<div
		class="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-surface-100-900 to-transparent"
	></div>
</div>
