<!-- Error page for company routes — renders a sign-in prompt on 401
     so that Googlebot sees a clean 401 status (page requires auth)
     while users still see a clear call to action. -->
<script lang="ts">
	import { page } from '$app/state';
	import Crown from 'lucide-svelte/icons/crown';

	const redirectTo = $derived(page.url.pathname + page.url.search);
</script>

<svelte:head>
	<title>Sign In Required - AppGoblin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="max-w-2xl mx-auto py-12 px-4">
	{#if page.status === 401}
		<div class="border border-surface-100-900 rounded-lg p-6 md:p-8 space-y-6 text-center">
			<h1 class="text-2xl md:text-3xl font-bold">Sign In Required</h1>
			<p class="text-surface-600-400 leading-relaxed max-w-md mx-auto">
				This page requires authentication. Please sign in or create a free account to continue.
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
					<span>It's free to create an account. No credit card required.</span>
				</p>
			</div>
		</div>
	{:else}
		<div class="text-center py-12">
			<h1 class="text-4xl font-bold text-error-800-200 mb-4">{page.status}</h1>
			<h2 class="text-xl font-semibold mb-4">
				{page.error?.message || 'An unexpected error occurred'}
			</h2>
			<a href="/" class="btn preset-filled">Go Home</a>
		</div>
	{/if}
</div>
