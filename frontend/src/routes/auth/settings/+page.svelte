<script lang="ts">
	import { enhance } from "$app/forms";

	import type { PageData, ActionData } from "./$types";

	export let data: PageData;
	export let form: ActionData;
</script>

<header>
	<a href="/">Home</a>
	<a href="/auth/settings">Settings</a>
</header>
<main class="space-y-4">
	<h2 class="text-2xl font-bold">Settings</h2>
	<section>
		<h3 class="text-lg font-bold">Update email</h3>
		<p class="text-sm text-gray-500 my-2">Current email: {data.user.email}</p>
		<form class="space-y-1" method="post" use:enhance action="?/email">
			<label class="label" for="form-email.email">New email</label>
			<input class="input" type="email" id="form-email.email" name="email" required />
			<button class="btn preset-filled">Update Email</button>
			<p>{form?.email?.message ?? ""}</p>
		</form>
	</section>
	<section>
		<h3 class="text-lg font-bold">Update password</h3>
		<form class="space-y-1" method="post" use:enhance action="?/password">
			<label class="label" for="form-password.password">Current password</label>
			<input class="input" type="password" id="form-email.password" name="password" autocomplete="current-password" required />
			<label class="label" for="form-password.new-password">New password</label>
			<input
				class="input"
				type="password"
				id="form-password.new-password"
				name="new_password"
				autocomplete="new-password"
				required
			/>
			<button class="btn preset-filled">Update Password</button>
			<p>{form?.password?.message ?? ""}</p>
		</form>
	</section>
	{#if data.user.registered2FA}
		<section>
			<h3 class="text-lg font-bold">Update two-factor authentication</h3>
			<a class="btn preset-tonal" href="/auth/2fa/setup">Update</a>
		</section>
	{/if}
	{#if data.recoveryCode !== null}
		<section>
			<h3 class="text-lg font-bold">Recovery code</h3>
			<p>2FA Recovery code: {data.recoveryCode}</p>
		</section>
	{/if}
</main>
