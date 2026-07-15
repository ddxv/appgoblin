<!--
	Shared sign-in prompt for 401 error pages.
	Derives contextual messaging from the URL pathname so users understand
	what they'll be able to access after signing in (mirrors the login
	page's redirectTo-based CTA pattern).

	Usage in +error.svelte:
	  {#if page.status === 401}
	    <LoginPrompt />
	  {/if}
-->
<script lang="ts">
	import { page } from '$app/state';
	import Crown from 'lucide-svelte/icons/crown';

	const redirectTo = $derived(page.url.pathname + page.url.search);

	type ContextKey =
		| 'account'
		| 'app-comparison'
		| 'keywords'
		| 'sdks'
		| 'app-explorer'
		| 'app-adstxt'
		| 'data-exports'
		| 'default';

	const contextKey = $derived.by((): ContextKey => {
		const path = page.url.pathname;
		if (path.startsWith('/account/')) return 'account';
		if (path.startsWith('/apps/comparison')) return 'app-comparison';
		if (path.includes('/keywords/')) return 'keywords';
		if (path.startsWith('/sdks/')) return 'sdks';
		if (path.startsWith('/app-explorer')) return 'app-explorer';
		if (path.includes('/app-adstxt/')) return 'app-adstxt';
		if (path.includes('/data-exports')) return 'data-exports';
		return 'default';
	});

	type ContextInfo = {
		heading: string;
		message: string;
	};

	const contextMap: Record<ContextKey, ContextInfo> = {
		account: {
			heading: 'Sign In to Your Account',
			message:
				'Access your account dashboard, manage your watchlists, configure API keys, and track your subscriptions.'
		},
		'app-comparison': {
			heading: 'Sign In to Compare Apps',
			message:
				'Compare apps side-by-side with SDK, API, and market data. Find the tools and signals that matter for your next decision.'
		},
		keywords: {
			heading: 'Sign In to Track Keywords',
			message:
				'Track keyword rankings, discover ASO opportunities, and monitor your app store visibility over time.'
		},
		sdks: {
			heading: 'Unlock Mobile SDK Data',
			message:
				'View which apps and companies use this SDK. Good news — it is completely free! Simply create an account to start analyzing app architecture, performing competitor research, and tracking mobile trends.'
		},
		'app-explorer': {
			heading: 'Sign In to Explore Apps',
			message:
				'Cross-reference app store metrics, SDK signals, and ad monetization data. Filter and discover apps that match your criteria.'
		},
		'app-adstxt': {
			heading: 'Sign In to View App-Ads.txt Data',
			message:
				'View publisher app-ads.txt records for supply chain analysis. Map programmatic relationships and identify compliance risks.'
		},
		'data-exports': {
			heading: 'Sign In to Download Data',
			message:
				'Download structured intelligence datasets for analysis, prospecting, and competitive research.'
		},
		default: {
			heading: 'Sign In Required',
			message:
				'This page requires authentication. Please sign in or create a free account to continue.'
		}
	};

	const context = $derived(contextMap[contextKey]);
</script>

<svelte:head>
	<title>Sign In Required - AppGoblin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="max-w-2xl mx-auto py-12 px-4">
	<div class="border border-surface-100-900 rounded-lg p-6 md:p-8 space-y-6 text-center">
		<h1 class="text-2xl md:text-3xl font-bold">{context.heading}</h1>
		<p class="text-surface-600-400 leading-relaxed max-w-md mx-auto text-sm md:text-base">
			{context.message}
		</p>

		<div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
			<a
				class="btn preset-filled w-full sm:w-auto"
				href="/auth/login?redirectTo={encodeURIComponent(redirectTo)}"
			>
				Sign In
			</a>
			<a
				class="btn preset-tonal w-full sm:w-auto"
				href="/auth/signup?redirectTo={encodeURIComponent(redirectTo)}"
			>
				Create Free Account
			</a>
		</div>

		<div class="pt-4 border-t border-surface-100-900 text-sm text-surface-500-400">
			<p>
				Already have an account?
				<a
					href="/auth/login?redirectTo={encodeURIComponent(redirectTo)}"
					class="underline font-medium hover:text-primary-500"
				>
					Sign in here
				</a>
			</p>
			<p class="mt-3 flex items-center justify-center gap-1">
				<Crown class="w-4 h-4 text-primary-900-100" aria-hidden="true" />
				<span>It is free to create an account. No credit card required.</span>
			</p>
		</div>
	</div>
</div>
