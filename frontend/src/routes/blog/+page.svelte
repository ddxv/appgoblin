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

Blog Home page needs work
{#each data.posts as post (post.id)}
	post each
	<a class="card bg-base-100 group w-sm shadow-sm" href={post.relativeURL}>
		<figure>
			<img
				class="h-64 w-sm scale-100 object-cover duration-100 ease-in group-hover:scale-105"
				src={post.heroImage}
				alt={post.title}
			/>
		</figure>
		<div class="card-body">
			<time datetime={post.pubDate.toISOString()}>
				{post.pubDate.toLocaleDateString('en-us', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</time>
			<h2 class="card-title">{post.title}</h2>
		</div>
	</a>
{/each}
