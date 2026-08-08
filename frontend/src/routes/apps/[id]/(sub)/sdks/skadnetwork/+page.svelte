	<script lang="ts">
		let { data }: { data: any } = $props();
	</script>

	<div class="p-2 md:p-16 mt-2 md:mt-4">
		<section class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<h2 class="h1 md:h3 p-2 col-span-full">SKAdNetwork</h2>
			{#if data.myPackageInfo.skadnetwork && data.myPackageInfo.skadnetwork.length > 0}
				<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
					{#each data.myPackageInfo.skadnetwork as skadnetwork}
						<p>{skadnetwork}</p>
					{/each}
				</div>
			{:else}
				<p class="px-4">No SKAdNetwork identifiers found.</p>
			{/if}
		</section>
	</div>
