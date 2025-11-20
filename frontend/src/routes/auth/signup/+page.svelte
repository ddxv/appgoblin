<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h2 class="text-2xl font-bold">Create an account</h2>
<p>Name must be at least 4 characters long and password must be at least 8 characters long.</p>
<form class="space-y-1" method="post" use:enhance>
	<label class="label" for="form-signup.username">Name</label>
	<input
		class="input"
		id="form-signup.username"
		name="username"
		required
		value={form?.username ?? ''}
		minlength="4"
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
	<button class="btn preset-filled">Create Account</button>
	<p>{form?.message ?? ''}</p>
</form>
<a class="btn preset-tonal" href="/auth/login">Already have an account? Sign in</a>
