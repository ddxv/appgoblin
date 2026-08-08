<script lang="ts">
	let { data }: { data: any } = $props();
</script>

<div class="p-2 md:p-16 mt-2 md:mt-4">
	<section class="grid grid-cols-1 md:grid-cols-2 gap-4">
		<h2 class="h1 md:h3 p-2 col-span-full">Permissions</h2>
		{#if data.myPackageInfo.permissions && data.myPackageInfo.permissions.length > 0}
			<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
				{#each data.myPackageInfo.permissions as permission}
					<p>{permission}</p>
				{/each}
			</div>
		{:else}
			<p class="px-4">No permissions data available for this app.</p>
		{/if}
	</section>
</div>
