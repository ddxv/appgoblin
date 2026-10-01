<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="max-w-lg mx-auto p-6 md:p-8">
	<div class="border border-surface-100-900 rounded-lg p-6 md:p-8 space-y-6">
		<div>
			<h2 class="text-2xl font-bold">Verify your email address</h2>
			<p class="text-sm mt-1">Sent an 8-digit code to {data.email}.</p>
			<p class="text-sm text-surface-500 mt-2">
				Please check your spam or junk folder if you do not see the email.
			</p>
		</div>

		<form class="space-y-4" method="post" use:enhance>
			<div class="space-y-1">
				<label class="label font-medium text-sm" for="form-verify.code">Code</label>
				<input
					class="input"
					id="form-verify.code"
					name="code"
					inputmode="numeric"
					autocomplete="one-time-code"
					required
				/>
			</div>

			<div class="pt-2">
				<button class="btn preset-filled w-full">Verify</button>
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
