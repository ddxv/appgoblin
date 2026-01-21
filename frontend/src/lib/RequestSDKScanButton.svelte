<script lang="ts">
	import { page } from '$app/state';

	let myMessage = $state('');
	let isLoading = $state(false);

	async function handleClick() {
		isLoading = true;
		myMessage = '';

		try {
			const response = await fetch('/api/request-sdk-scan', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ appId: page.params.id })
			});

			if (response.ok) {
				myMessage = 'Successfully requested SDK scan!';
			} else {
				myMessage = 'Failed to request SDK scan.';
			}
		} catch {
			myMessage = 'Failed to request SDK scan.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="mx-auto w-full max-w-md space-y-1">
	<button
		class="btn preset-tonal text-tertiary-900-100 text-sm md:text-base"
		onclick={handleClick}
		disabled={isLoading}
	>
		{isLoading ? 'Requesting...' : 'Request New SDK Scan'}
	</button>
	{#if myMessage}
		<p class="text-green-500">{myMessage}</p>
	{/if}
	<p class="text-xs md:text-sm">
		The download and scan process is automated but can require manual troubleshooting. Feel free to
		reach out if your request does not complete in 24hrs or if you have any questions.
	</p>
</div>
