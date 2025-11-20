<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData } from "./$types";

	export let form: ActionData;
</script>


<form class = "space-y-2" method="post" use:enhance>
<h2 class="text-2xl font-bold">Sign In</h2>
	<label class = "label" for="form-login.email">Email</label>
	<input
	class="input"
		type="email"
		id="form-login.email"
		name="email"
		autocomplete="username"
		required
		value={form?.email ?? ""}
	/><br />
	<label class="label" for="form-login.password">Password</label>
	<input class="input" type="password" id="form-login.password" name="password" autocomplete="current-password" required /><br />
	<button class="btn preset-filled">Sign In</button>
    <a class = "btn preset-tonal" href="/auth/forgot-password">Forgot password?</a>
	<p>{form?.message ?? ""}</p>
</form>
<h2 class="text-2xl font-bold">Create a free account</h2>
<a class = "btn preset-filled" href="/auth/signup"><span class="text-black font-semibold">Create AppGoblin Account</span></a>
