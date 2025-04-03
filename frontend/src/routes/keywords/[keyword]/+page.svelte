<script lang="ts">
	let { data } = $props();
	import { page } from '$app/state';
</script>

<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
	<h1 class="text-2xl font-bold">Keyword Details for {page.params.keyword}</h1>
</div>
