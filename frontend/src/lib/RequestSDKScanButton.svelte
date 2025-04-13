<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let myMessage = $state('');

	function handleSubmit() {
		return async ({ result }: { result: any }) => {
			// Handle the form submission result
			if (result.type === 'success') {
				// You can add additional success handling here if needed
				console.log('success');
				myMessage = 'Successfully requested SDK scan!';
			} else {
				myMessage = 'Failed to request SDK scan.';
			}
		};
	}
</script>

<form
	class="mx-auto w-full max-w-md space-y-4"
	method="POST"
	action="?/requestSDKScan"
	use:enhance={handleSubmit}
>
	<input type="hidden" name="appId" value={page.params.id} />
	<button class="btn preset-tonal text-tertiary-900-100">Request New SDK Scan</button>
	{#if myMessage}
		<!-- this message is ephemeral; it exists because the page was rendered in
	       response to a form submission. it will vanish if the user reloads -->
		<p class="text-green-500">{myMessage}</p>
	{/if}
	<p>
		This will request a new SDK scan for this app. Scanning may take several days, or require manual
		troubleshooting. Please reach out on Discord and we can help work on the scan. iOS is currently
		not working well due to changes in Apple APIs and may not be possible.
	</p>
</form>
