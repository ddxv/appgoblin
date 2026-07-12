<script lang="ts">
	import { enhance } from '$app/forms';
	import 'altcha';

	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<h2 class="text-2xl font-bold">Create an account</h2>
<p>Name must be at least 2 characters long and password must be at least 8 characters long.</p>
<form class="space-y-1" method="post" use:enhance>
	{#if data.redirectTo}
		<input type="hidden" name="redirectTo" value={data.redirectTo} />
	{/if}
	<label class="label" for="form-signup.username">Name</label>
	<input
		class="input"
		id="form-signup.username"
		name="username"
		required
		value={form?.username ?? ''}
		minlength="2"
		maxlength="31"
	/><br />
	<label class="label" for="form-signup.email">Email</label>
	<input
		class="input"
		type="email"
		id="form-signup.email"
		name="email"
		autocomplete="username"
		required
		value={form?.email ?? ''}
	/><br />
	<label class="label" for="form-signup.password">Password</label>
	<input
		class="input"
		type="password"
		id="form-signup.password"
		name="password"
		autocomplete="new-password"
		required
	/><br />
	<label class="label" for="form-signup.referral">
		Where did you hear about AppGoblin?
		<span class="text-sm font-normal text-gray-500"> — Optional but greatly appreciated</span>
	</label>
	<input
		class="input"
		id="form-signup.referral"
		name="referral_source"
		value={form?.referral_source ?? ''}
		placeholder="e.g. Google, Twitter, friend, conference..."
	/><br />
	<altcha-widget challenge="/api/altcha-challenge"></altcha-widget><br />
	<button class="btn preset-filled">Create Account</button>
	<p>{form?.message ?? ''}</p>
</form>
<a
	class="btn preset-tonal"
	href="/auth/login?redirectTo={encodeURIComponent(data.redirectTo || '')}"
	>Already have an account? Sign in</a
>
