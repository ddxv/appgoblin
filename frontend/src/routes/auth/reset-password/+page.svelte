<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="max-w-lg mx-auto p-6 md:p-8">
	<div class="border border-surface-100-900 rounded-lg p-6 md:p-8 space-y-6">
		<div>
			<h2 class="text-2xl font-bold">Enter your new password</h2>
			<p class="text-sm mt-1">Choose a strong password for your AppGoblin account.</p>
		</div>

		<form class="space-y-4" method="post" use:enhance>
			<div class="space-y-1">
				<label class="label font-medium text-sm" for="form-reset.password">Password</label>
				<input
					class="input"
					type="password"
					id="form-reset.password"
					name="password"
					autocomplete="new-password"
					required
				/>
			</div>

			<div class="pt-2">
				<button class="btn preset-filled w-full">Reset password</button>
			</div>

			{#if form?.message}
				<div
					class="p-3 rounded bg-error-500/10 border border-error-500/30 text-error-600 text-center text-sm font-medium"
				>
					{form.message}
				</div>
			{/if}
		</form>
	</div>
</div>
