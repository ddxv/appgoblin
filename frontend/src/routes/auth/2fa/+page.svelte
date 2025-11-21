<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h2 class="text-2xl font-bold">Two-factor authentication</h2>
<p>Enter the code from your authenticator app.</p>
<form method="post" use:enhance>
	<label class="label" for="form-totp.code">Code</label>
	<input class="input" id="form-totp.code" name="code" autocomplete="one-time-code" required /><br
	/>
	<button class="btn preset-filled">Verify</button>
	<p>{form?.message ?? ''}</p>
</form>
<a href="/2fa/reset">Reset 2FA Recovery Code</a>
