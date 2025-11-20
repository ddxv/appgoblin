<script lang="ts">
	import { enhance } from '$app/forms';

	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<h2 class="text-2xl font-bold">Verify your email address</h2>
<p>We sent an 8-digit code to {data.email}.</p>
<form class="space-y-1" method="post" use:enhance action="?/verify">
	<label class="label" for="form-verify.code">Code</label>
	<input class="input" id="form-verify.code" name="code" required />
	<button class="btn preset-filled">Verify</button>
	<p>{form?.verify?.message ?? ''}</p>
</form>
<form method="post" use:enhance action="?/resend">
	<button class="btn preset-tonal">Resend code</button>
	<p>{form?.resend?.message ?? ''}</p>
</form>
<a class="btn preset-tonal" href="/auth/settings">Change email</a>
