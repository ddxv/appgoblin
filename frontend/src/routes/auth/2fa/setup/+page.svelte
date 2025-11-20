<script lang="ts">
	import { enhance } from "$app/forms";

	import type { ActionData, PageData } from "./$types";

	export let data: PageData;
	export let form: ActionData;
</script>

<h2 class="text-2xl font-bold">Set up two-factor authentication</h2>
<div style="width:200px; height: 200px; background-color: #f0f0f0;">
	{@html data.qrcode}
</div>
<form class="space-y-1" method="post" use:enhance>
	<input name="key" value={data.encodedTOTPKey} hidden required />
	<label class="label" for="form-totp.code">Verify the code from the app</label>
	<input class="input" id="form-totp.code" name="code" required /><br />
	<button class="btn preset-filled">Save</button>
	<p>{form?.message ?? ""}</p>
</form>
