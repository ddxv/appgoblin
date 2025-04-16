<script lang="ts">
	import type { AppFullDetail } from '../types';
	interface Props {
		myapp: AppFullDetail;
	}
	let { myapp }: Props = $props();
	import RatingInstallsLarge from '$lib/RatingInstallsLarge.svelte';
	import StarsRating from '$lib/StarsRating.svelte';
</script>

<div class="grid grid-cols-1 gap-2">
	<div class="inline-flex">
		<div class="grid grid-cols-2 gap-2">
			{#if myapp.icon_url_512}
				<img
					src={myapp.icon_url_512}
					alt={myapp.name}
					class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-60 xl:h-60"
					referrerpolicy="no-referrer"
				/>
			{/if}
			{#if myapp.installs}
				<RatingInstallsLarge app={myapp} />
			{/if}
		</div>
	</div>
	<!-- Ratings: STARS (123) -->
	<div class="md:hidden">
		<StarsRating total={5} size={20} rating={myapp.rating} />
	</div>
	<div class="hidden md:inline-flex">
		<StarsRating total={5} size={40} rating={myapp.rating} />
	</div>
</div>
