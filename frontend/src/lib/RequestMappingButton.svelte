<script lang="ts">
	let {
		mapType,
		valueToBeMapped,
		additionalInfo,
		label = 'Request mapping'
	}: {
		mapType: 'company_domain_name' | 'app_sdk';
		valueToBeMapped: string;
		additionalInfo?: { store_id: string };
		label?: string;
	} = $props();

	let isLoading = $state(false);
	let requested = $state(false);
	let message = $state('');

	async function requestMapping() {
		if (isLoading || requested) return;
		isLoading = true;
		message = '';

		try {
			const response = await fetch('/api/request-mapping', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ mapType, valueToBeMapped, additionalInfo })
			});

			if (response.ok) {
				requested = true;
			} else if (response.status === 401) {
				message = 'Sign in to request mappings.';
			} else {
				message = 'Failed to submit mapping request.';
			}
		} catch {
			message = 'Failed to submit mapping request.';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="space-y-1">
	<button
		type="button"
		class="btn preset-tonal-secondary btn-sm"
		onclick={requestMapping}
		disabled={isLoading || requested}
	>
		{#if isLoading}
			Submitting...
		{:else if requested}
			Requested
		{:else}
			{label}
		{/if}
	</button>
	{#if requested}
		<p class="text-sm">
			If you have tips or information, please reach out:
			<a href="/contact" class="underline hover:text-primary-600-400">Contact</a>
		</p>
	{/if}
	{#if message}<p class="text-xs text-warning-600">{message}</p>{/if}
</div>
