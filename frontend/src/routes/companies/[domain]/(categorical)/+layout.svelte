<script lang="ts">
	import MainContent from '$lib/MainContent.svelte';
	import SideBarCompanies from '$lib/SideBarCompanies.svelte';

	let { data, children } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-[0.25fr_1fr]">
	<aside class="hidden md:block">
		<div>
			<SideBarCompanies myCatData={data.appCats} />
		</div>
	</aside>

	<MainContent>
		{@render children?.()}
	</MainContent>
</div>
