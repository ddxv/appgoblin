<script lang="ts">
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<h2 class="text-2xl font-bold">2FA Recovery code</h2>
<p>2FA recovery code: {data.recoveryCode}</p>
<p>You can use this recovery code if you lose access to your 2FA app.</p>
<a class="btn preset-tonal" href="/">Next</a>
