<script lang="ts">
	import { page } from '$app/state';
	let { data } = $props();
	console.log(data);
</script>

<svelte:head>
	<title>{data.title}</title>
	<meta property="og:title" content={data.title} />
	<meta name="twitter:title" content={data.title} />
	<meta name="description" content={data.description} />
	<link rel="canonical" href={page.url.href} />
	<meta
		name="keywords"
		content="appgoblin, blog, competitor analysis, aso, app research, sdk analysis, advertising, apps"
	/>
	<meta property="og:description" content={data.description} />
	<meta name="twitter:description" content={data.description} />
</svelte:head>

<article class="mx-48 p-8 post">
	{@html data.contentHTML}
</article>
