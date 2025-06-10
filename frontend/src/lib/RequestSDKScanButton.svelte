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
	<button class="btn preset-tonal text-tertiary-900-100 text-sm md:text-base"
		>Request New SDK Scan</button
	>
	{#if myMessage}
		<!-- this message is ephemeral; it exists because the page was rendered in
	       response to a form submission. it will vanish if the user reloads -->
		<p class="text-green-500">{myMessage}</p>
	{/if}
	<p class="text-sm md:text-base">
		Scanning should take 24 hours to decompile the app's SDKs and check what API calls it makes. The
		process is automated 80% of the time but can require manual troubleshooting. Feel free to reach
		out on Discord if you have any questions.
	</p>
</form>
