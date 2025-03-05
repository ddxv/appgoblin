<script lang="ts">
	import AppTitle from '$lib/AppTitle.svelte';
	import { page } from '$app/state';
	let { data, children } = $props();
</script>

{#await data.myapp}
	Loading app details...
{:then myapp}
	<AppTitle {myapp} />
{/await}

<div class="p-2 md:py-2">
	<a href="/apps/{page.params.id}">
		<div class="btn preset-tonal hover:preset-tonal-primary">
			<span>Back to App Main Page</span>
		</div>
	</a>
</div>

{@render children?.()}
