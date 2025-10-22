<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let myMessage = $state('');

	function handleSubmit() {
		return async ({ result }: { result: any }) => {
			// Handle the form submission result
			if (result.type === 'success') {
				// You can add additional success handling here if needed
				myMessage = 'Successfully requested SDK scan!';
			} else {
				myMessage = 'Failed to request SDK scan.';
			}
		};
	}
</script>

<form
	class="mx-auto w-full max-w-md space-y-1"
	method="POST"
	action="?/requestSDKScan"
	use:enhance={handleSubmit}
>
	<input type="hidden" name="appId" value={page.params.id} />
	<button class="btn preset-tonal text-tertiary-900-100 text-sm md:text-base"
		>Request New SDK Scan</button
	>
	{#if myMessage}
		<p class="text-green-500">{myMessage}</p>
	{/if}
	<p class="text-xs md:text-sm">
		The download and scan process is automated but can require manual troubleshooting. Feel free to
		reach out if your request does not complete in 24hrs or if you have any questions.
	</p>
</form>
