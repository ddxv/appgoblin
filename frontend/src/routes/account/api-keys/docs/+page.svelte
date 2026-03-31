<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Copy from 'lucide-svelte/icons/copy';
	import Check from 'lucide-svelte/icons/check';

	let copiedSnippet = $state<string | null>(null);

	function copyCode(code: string, id: string) {
		navigator.clipboard.writeText(code);
		copiedSnippet = id;
		setTimeout(() => (copiedSnippet = null), 2000);
	}

	const curlExample = `curl -H "X-API-Key: YOUR_API_KEY" \\
  https://appgoblin.info/api/v1/companies`;

	const pythonExample = `import requests

response = requests.get(
    "https://appgoblin.info/api/v1/companies",
    headers={"X-API-Key": "YOUR_API_KEY"}
)

data = response.json()
for company in data:
    print(company["name"], company["count"])`;

	const jsExample = `const response = await fetch(
  "https://appgoblin.info/api/v1/companies",
  { headers: { "X-API-Key": "YOUR_API_KEY" } }
);

const data = await response.json();
data.forEach(company => {
  console.log(company.name, company.count);
});`;

	const responseExample = `[
  {
    "company_id": 123,
    "name": "Google",
    "count": 45000
  },
  {
    "company_id": 456,
    "name": "Meta",
    "count": 32000
  }
]`;
</script>

<svelte:head>
	<title>API Documentation - AppGoblin</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="card preset-tonal p-6 md:p-8 space-y-4">
		<a href="/account/api-keys" class="flex items-center gap-2 text-sm text-surface-500 hover:text-surface-300 transition-colors">
			<ArrowLeft size={16} />
			Back to API Keys
		</a>
		<h1 class="text-2xl font-bold">API Documentation</h1>
		<p class="text-surface-600-400">
			Reference for the AppGoblin public API. All endpoints require authentication via API key.
		</p>
	</div>

	<!-- Base URL -->
	<div class="card preset-tonal p-6 md:p-8 space-y-3">
		<h2 class="text-lg font-semibold">Base URL</h2>
		<code class="block p-3 rounded-lg bg-surface-950-50 text-sm font-mono">
			https://appgoblin.info/api/v1/
		</code>
	</div>

	<!-- Authentication -->
	<div class="card preset-tonal p-6 md:p-8 space-y-3">
		<h2 class="text-lg font-semibold">Authentication</h2>
		<p class="text-sm text-surface-600-400">
			Include your API key in the <code class="bg-surface-200-800 px-1.5 py-0.5 rounded text-xs">X-API-Key</code> header of every request.
		</p>
		<code class="block p-3 rounded-lg bg-surface-950-50 text-sm font-mono">
			X-API-Key: ag_your_api_key_here
		</code>
	</div>

	<!-- Rate Limits -->
	<div class="card preset-tonal p-6 md:p-8 space-y-3">
		<h2 class="text-lg font-semibold">Rate Limits</h2>
		<p class="text-sm text-surface-600-400">
			Every API key has two layers of rate limiting: per-minute burst protection and a daily quota.
		</p>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-surface-300-700 text-left">
						<th class="pb-2 font-semibold">Plan</th>
						<th class="pb-2 font-semibold">req/min</th>
						<th class="pb-2 font-semibold">req/day</th>
					</tr>
				</thead>
				<tbody>
					<tr class="border-b border-surface-300-700/50">
						<td class="py-2">Free</td>
						<td class="py-2 text-surface-500">30</td>
						<td class="py-2 text-surface-500">1,000</td>
					</tr>
					<tr class="border-b border-surface-300-700/50">
						<td class="py-2">Premium Access</td>
						<td class="py-2 text-surface-500">200</td>
						<td class="py-2 text-surface-500">10,000</td>
					</tr>
					<tr class="border-b border-surface-300-700/50">
						<td class="py-2">Business SDK / App-Ads.txt</td>
						<td class="py-2 text-surface-500">2,000</td>
						<td class="py-2 text-surface-500">100,000</td>
					</tr>
					<tr>
						<td class="py-2">Premium B2B</td>
						<td class="py-2 text-surface-500">10,000</td>
						<td class="py-2 text-surface-500">500,000</td>
					</tr>
				</tbody>
			</table>
		</div>
		<p class="text-sm text-surface-600-400">
			Rate limit and quota information is returned in response headers:
		</p>
		<code class="block p-3 rounded-lg bg-surface-950-50 text-sm font-mono whitespace-pre">X-RateLimit-Limit: 200&#10;X-RateLimit-Remaining: 195&#10;X-RateLimit-Policy: 10000;w=86400&#10;X-RateLimit-Quota-Remaining: 9805</code>
	</div>

	<!-- Endpoints -->
	<div class="card preset-tonal p-6 md:p-8 space-y-3">
		<h2 class="text-lg font-semibold">Endpoints</h2>

		<!-- GET /companies -->
		<div class="border border-surface-300-700 rounded-lg overflow-hidden">
			<div class="p-4 bg-surface-100-900 flex items-center gap-3">
				<span class="badge preset-filled-success-900-100 text-xs font-mono">GET</span>
				<code class="text-sm font-mono">/api/v1/companies</code>
			</div>
			<div class="p-4 space-y-3">
				<p class="text-sm text-surface-600-400">
					Returns a list of all mapped companies with their app counts across stores.
				</p>
				<p class="text-xs text-surface-500">
					<strong>Tier required:</strong> All plans
				</p>
				<p class="text-sm font-medium">Response</p>
				<pre class="block p-3 rounded-lg bg-surface-950-50 text-xs font-mono overflow-x-auto">{responseExample}</pre>
			</div>
		</div>
	</div>

	<!-- Error Responses -->
	<div class="card preset-tonal p-6 md:p-8 space-y-3">
		<h2 class="text-lg font-semibold">Error Responses</h2>
		<div class="space-y-2">
			<div class="flex items-start gap-3 p-3 rounded-lg bg-surface-100-900">
				<span class="badge preset-filled-error-500 text-xs font-mono shrink-0 mt-0.5">401</span>
				<div>
					<p class="text-sm font-medium">Unauthorized</p>
					<p class="text-xs text-surface-500">Missing or invalid <code>X-API-Key</code> header.</p>
				</div>
			</div>
			<div class="flex items-start gap-3 p-3 rounded-lg bg-surface-100-900">
				<span class="badge preset-filled-warning-500 text-xs font-mono shrink-0 mt-0.5">429</span>
				<div>
					<p class="text-sm font-medium">Too Many Requests</p>
					<p class="text-xs text-surface-500">
						Per-minute rate limit or daily quota exceeded. Check the <code>Retry-After</code>
						and <code>X-RateLimit-Quota-Remaining</code> headers.
					</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Code Examples -->
	<div class="card preset-tonal p-6 md:p-8 space-y-3">
		<h2 class="text-lg font-semibold">Code Examples</h2>

		<!-- cURL -->
		<div>
			<div class="flex items-center justify-between mb-1">
				<p class="text-sm font-medium">cURL</p>
				<button
					type="button"
					class="btn btn-sm preset-tonal flex items-center gap-1"
					onclick={() => copyCode(curlExample, 'curl')}
				>
					{#if copiedSnippet === 'curl'}
						<Check size={14} class="text-success-500" />
					{:else}
						<Copy size={14} />
					{/if}
				</button>
			</div>
			<pre class="p-3 rounded-lg bg-surface-950-50 text-sm font-mono overflow-x-auto">{curlExample}</pre>
		</div>

		<!-- Python -->
		<div>
			<div class="flex items-center justify-between mb-1">
				<p class="text-sm font-medium">Python</p>
				<button
					type="button"
					class="btn btn-sm preset-tonal flex items-center gap-1"
					onclick={() => copyCode(pythonExample, 'python')}
				>
					{#if copiedSnippet === 'python'}
						<Check size={14} class="text-success-500" />
					{:else}
						<Copy size={14} />
					{/if}
				</button>
			</div>
			<pre class="p-3 rounded-lg bg-surface-950-50 text-sm font-mono overflow-x-auto">{pythonExample}</pre>
		</div>

		<!-- JavaScript -->
		<div>
			<div class="flex items-center justify-between mb-1">
				<p class="text-sm font-medium">JavaScript</p>
				<button
					type="button"
					class="btn btn-sm preset-tonal flex items-center gap-1"
					onclick={() => copyCode(jsExample, 'js')}
				>
					{#if copiedSnippet === 'js'}
						<Check size={14} class="text-success-500" />
					{:else}
						<Copy size={14} />
					{/if}
				</button>
			</div>
			<pre class="p-3 rounded-lg bg-surface-950-50 text-sm font-mono overflow-x-auto">{jsExample}</pre>
		</div>
	</div>
</div>
