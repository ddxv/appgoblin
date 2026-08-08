	<script lang="ts">
		let { data }: { data: any } = $props();
	</script>

	<div class="p-2 md:p-16 mt-2 md:mt-4">
		<section class="grid grid-cols-1">
			<h2 class="h1 md:h3 p-2">App Queries</h2>
			{#if data.myPackageInfo.app_queries && data.myPackageInfo.app_queries.length > 0}
				<p class="px-2 md:px-4">
					These are the other apps that {data.myapp.name} requests to know other apps are also installed:
				</p>
				<div class="px-4 md:px-8 max-w-sm md:max-w-md lg:max-w-full overflow-x-scroll">
					{#each data.myPackageInfo.app_queries as app_query}
						<p><a href="/apps/{app_query}" rel="nofollow">{app_query}</a></p>
					{/each}
				</div>
			{:else}
				<p class="px-2 md:px-4">No app queries data available.</p>
			{/if}
		</section>
	</div>
