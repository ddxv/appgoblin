<script lang="ts">
	import { page } from '$app/state';

	const title = 'API Docs | AppGoblin Public API';
	const description =
		'Generated OpenAPI reference for the AppGoblin public v1 API, including API token authentication, schemas, and interactive endpoint browsing.';
	const keywords =
		'api docs, openapi, appgoblin api, public api, api token, scalar api reference, api reference';

	const docsUrl = $derived.by(() => {
		const { hostname, origin } = page.url;
		const backendOrigin =
			hostname === 'localhost' || hostname === '127.0.0.1' ? 'http://localhost:8000' : origin;
		return `${backendOrigin}/api/v1/docs/openapi`;
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="canonical" href="https://appgoblin.info/api-docs" />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://appgoblin.info/api-docs" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:card" content="summary" />
</svelte:head>
<div class="space-y-4 py-4 md:py-6">
	<div class="px-4 md:px-6">
		<h1 class="text-2xl font-bold md:text-3xl">API Documentation</h1>
		<div class="mt-3 max-w-4xl space-y-3 text-sm md:text-base">
			<p>
				The AppGoblin public API includes paid company churn tracking through
				<code>GET /api/v1/companies/{'{'}company_domain{'}'}/app-changes</code>. Query a known
				company by quarter, then use <code>status=lost</code> to review apps that removed it or
				<code>status=added</code> to review apps that newly adopted it.
			</p>
			<p>
				This is useful for ad-network prospecting, competitor monitoring, and compliance review. For
				example, sales teams can pull apps that recently lost a monetization or analytics vendor,
				while compliance teams can review recent SDK removals for a specific provider.
			</p>
			<p class="opacity-80">
				The current endpoint is scoped to quarterly company deltas for a known domain. It does not
				directly correlate one vendor's removal with another vendor's addition in the same response.
			</p>
		</div>
	</div>

	<iframe
		title="API Documentation"
		src={docsUrl}
		class="block min-h-[82vh] w-full border-0 bg-white"
		loading="eager"
	></iframe>
</div>
