<script lang="ts">
	let { data } = $props();

	let title = 'Blog | AppGoblin Latest News';
	const description =
		'Latest news and updates from the AppGoblin team. Grow your app with free ASO tools and analytics from AppGoblin.';
	const keywords =
		'blog, appgoblin, aso, app store optimization, app marketing, app growth, monetization, reports, analysis, sdks, competitor analysis';
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />
</svelte:head>

<iframe
	srcdoc={data.myblog}
	class="h-screen w-full"
	frameborder="0"
	title="Blog Content"
	id="frame"
	style="color-scheme: dark;"
></iframe>
