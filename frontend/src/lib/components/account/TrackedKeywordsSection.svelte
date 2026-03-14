<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { AccountFormResult, TrackedKeyword } from './types';

	let {
		keywords,
		form
	}: {
		keywords: TrackedKeyword[];
		form?: AccountFormResult;
	} = $props();

	let editingId = $state<number | null>(null);

	const syncFormAndCloseEditor: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();

			if (result.type === 'success') {
				editingId = null;
			}
		};
	};
</script>

<section class="space-y-4">
	<h2 class="text-lg font-semibold">Keyword Watchlist</h2>
	<p class="text-sm text-surface-500">Keywords are private to your account and scoped by app ID.</p>

	<form
		method="POST"
		action="?/addTrackedKeyword"
		use:enhance
		class="grid gap-2 md:grid-cols-[1fr_1fr_auto]"
	>
		<input type="text" name="store_id" class="input" placeholder="App store ID" required />
		<input type="text" name="keyword_text" class="input" placeholder="Keyword" required />
		<button type="submit" class="btn preset-tonal">Add</button>
	</form>

	{#if form?.section === 'tracked-keywords' && form?.message}
		<p class="text-sm {form.success ? 'text-success-600' : 'text-error-600'}">{form.message}</p>
	{/if}

	<div class="space-y-2">
		{#if keywords.length === 0}
			<p class="text-sm text-surface-500">No keywords in your watchlist yet.</p>
		{:else}
			{#each keywords as keyword (keyword.id)}
				<div class="rounded-lg bg-surface-100-900 p-3">
					{#if editingId === keyword.id}
						<form
							method="POST"
							action="?/updateTrackedKeyword"
							use:enhance={syncFormAndCloseEditor}
							class="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-center"
						>
							<input type="hidden" name="id" value={keyword.id} />
							<input type="text" name="store_id" class="input" value={keyword.store_id} required />
							<input
								type="text"
								name="keyword_text"
								class="input"
								value={keyword.keyword_text}
								required
							/>
							<div class="flex gap-2">
								<button type="submit" class="btn preset-tonal">Save</button>
								<button
									type="button"
									class="btn preset-outlined"
									onclick={() => (editingId = null)}
								>
									Cancel
								</button>
							</div>
						</form>
					{:else}
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="font-medium">{keyword.keyword_text}</p>
								<p class="text-xs text-surface-500">
									{#if keyword.app_name}
										{keyword.app_name} ({keyword.store_id})
									{:else}
										{keyword.store_id}
									{/if}
								</p>
							</div>

							<div class="flex gap-2">
								<button
									type="button"
									class="btn preset-outlined"
									onclick={() => (editingId = keyword.id)}
								>
									Edit
								</button>
								<form
									method="POST"
									action="?/deleteTrackedKeyword"
									use:enhance={syncFormAndCloseEditor}
								>
									<input type="hidden" name="id" value={keyword.id} />
									<button type="submit" class="btn preset-outlined-error-500">Remove</button>
								</form>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</section>
