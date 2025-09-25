<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="p-6 text-center">
	<h1 class="text-2xl font-bold text-error-800-200">
		{page.status} — {page.error?.message}
	</h1>
	{#if page.status == 404}
		<p class="mt-2 text-base px-8 md:px-32">
			The app (store id: '{page.params.id}') you’re looking for could not be found. If this is a new
			app, please search for it in the search bar which will trigger a new scan.
		</p>
		<p class="mt-2 text-base px-8 md:px-32">
			If you have any questions, please reach out on Discord or GitHub.
		</p>
	{:else if page.status == 500}
		<p class="mt-2 text-base px-8 md:px-32">
			An error occurred while fetching the app. Please contact support.
		</p>
	{:else}
		<p class="mt-2 text-base px-8 md:px-32">
			An error occurred while fetching the app. Please try again later.
		</p>
	{/if}

	<a href="/" class="btn mt-4">Back to Homepage</a>
</div>
