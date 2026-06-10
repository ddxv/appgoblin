<script lang="ts">
	import { page } from '$app/state';
	import ScanText from 'lucide-svelte/icons/scan-text';

	let {
		compact = false,
		fullWidth = false
	}: {
		compact?: boolean;
		fullWidth?: boolean;
	} = $props();

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

<div class="space-y-1">
	<button
		type="button"
		class={`btn preset-tonal-secondary ${compact ? 'btn-sm' : ''} ${fullWidth ? 'w-full justify-center' : ''}`}
		onclick={handleClick}
		disabled={isLoading}
	>
		{#if isLoading}
			Requesting...
		{:else}
			<ScanText class="h-3.5 w-3.5" aria-hidden="true" /> Scan SDK & API
		{/if}
	</button>
	{#if myMessage}
		<p class="text-green-500 text-sm">{myMessage}</p>
	{/if}
</div>
