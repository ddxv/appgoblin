<script lang="ts">
	let { myapp } = $props();
	import RatingInstallsLarge from '$lib/RatingInstallsLarge.svelte';
</script>

<div class="inline-flex">
	{#if myapp.icon_url_512}
		<img
			src={myapp.icon_url_512}
			alt={myapp.name}
			class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-60 xl:h-60"
			referrerpolicy="no-referrer"
		/>
	{/if}
	<div class="p-4">
		{#if myapp.installs}
			<RatingInstallsLarge app={myapp} />
		{/if}
	</div>
</div>
