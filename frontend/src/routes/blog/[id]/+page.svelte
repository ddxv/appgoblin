<script lang="ts">
	import { page } from '$app/state';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} | AppGoblin Blog</title>
	<meta property="og:title" content={data.title} />
	<meta name="twitter:title" content={data.title} />
	<meta name="description" content={data.description} />
	<meta property="og:description" content={data.description} />
	<meta name="twitter:description" content={data.description} />
	<link rel="canonical" href={page.url.href} />
	<meta
		name="keywords"
		content="appgoblin, blog, competitor analysis, aso, app research, sdk analysis, advertising, apps"
	/>

	<!-- Blog Post Structured Data -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": "{data.title}",
			"description": "{data.description}",
			"image": "https://appgoblin.info{data.heroImage}",
			"datePublished": "{data.pubDate.toISOString()}",
			"dateModified": "{data.pubDate.toISOString()}",
			"url": "https://appgoblin.info{data.relativeURL}",
			"mainEntityOfPage": {
				"@type": "WebPage",
				"@id": "https://appgoblin.info{data.relativeURL}"
			},
			"author": {
				"@type": "Organization",
				"name": "AppGoblin",
				"url": "https://appgoblin.info"
			},
			"publisher": {
				"@type": "Organization",
				"name": "AppGoblin",
				"url": "https://appgoblin.info",
				"logo": {
					"@type": "ImageObject",
					"url": "https://appgoblin.info/AppGoblin_Large_Logo.png"
				}
			},
			"isPartOf": {
				"@type": "Blog",
				"name": "AppGoblin Blog",
				"url": "https://appgoblin.info/blog"
			}
		}
	</script>
</svelte:head>

<!-- Navigation Breadcrumb -->
<nav class="bg-base-100 border-b border-base-300">
	<div class="container mx-auto px-4 py-4">
		<div class="flex items-center space-x-2 text-sm">
			<a href="/" class="text-primary hover:text-primary/80 transition-colors">Home</a>
			<svg
				class="w-4 h-4 text-base-content/50"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path>
			</svg>
			<a href="/blog" class="text-primary hover:text-primary/80 transition-colors">Blog</a>
			<svg
				class="w-4 h-4 text-base-content/50"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
				></path>
			</svg>
			<span class="text-base-content/70 truncate max-w-xs">{data.title}</span>
		</div>
	</div>
</nav>

<!-- Hero Section -->
<header class="bg-gradient-to-br from-primary/5 to-secondary/5">
	<div class="container mx-auto px-4 py-12">
		<div class="max-w-4xl mx-auto text-center">
			<!-- Publication Date -->
			<time
				class="inline-block text-primary font-medium mb-4"
				datetime={data.pubDate.toISOString()}
			>
				{data.pubDate.toLocaleDateString('en-us', {
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</time>

			<!-- Title -->
			<h1 class="text-4xl md:text-5xl font-bold text-base-content mb-6 leading-tight">
				{data.title}
			</h1>

			<!-- Description -->
			<p class="text-xl text-base-content/70 mb-8 max-w-3xl mx-auto leading-relaxed">
				{data.description}
			</p>
		</div>
	</div>
</header>

<!-- Hero Image -->
{#if data.heroImage}
	<div class="container mx-auto px-4 -mt-8 mb-12">
		<div class="max-w-4xl mx-auto">
			<figure class="overflow-hidden rounded-lg shadow-xl">
				<img
					src={data.heroImage}
					alt={data.title}
					class="w-full h-64 md:h-96 object-cover"
					loading="eager"
				/>
			</figure>
		</div>
	</div>
{/if}

<!-- Article Content -->
<main class="container mx-auto px-4 pb-16">
	<div class="max-w-4xl mx-auto">
		<article class="prose prose-lg max-w-none">
			{@html data.contentHTML}
		</article>

		<!-- Back to Blog Button -->
		<div class="mt-12 pt-8 border-t border-base-300">
			<a
				href="/blog"
				class="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
			>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
					></path>
				</svg>
				Back to Blog
			</a>
		</div>
	</div>
</main>
