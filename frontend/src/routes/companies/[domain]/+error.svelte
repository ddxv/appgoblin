<!-- Error page for company routes — renders a sign-in prompt on 401
     so that Googlebot sees a clean 401 status (page requires auth)
     while users still see a clear call to action. -->
<script lang="ts">
	import { page } from '$app/state';
	import LoginPrompt from '$lib/LoginPrompt.svelte';
</script>

<svelte:head>
	<title>Sign In Required - AppGoblin</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="max-w-2xl mx-auto py-12 px-4">
	{#if page.status === 401}
		<LoginPrompt />
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
