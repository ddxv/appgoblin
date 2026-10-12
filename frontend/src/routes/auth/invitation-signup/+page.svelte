<script lang="ts">
	import SignupForm from '$lib/SignupForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Join your AppGoblin team</title>
</svelte:head>

<div class="space-y-2">
	<h1 class="text-2xl font-bold">Join your AppGoblin team</h1>
	<p class="text-sm leading-relaxed">
		Create your free AppGoblin account to join your organization. You will receive access to the
		team's shared subscription after your account is created.
	</p>
</div>

<SignupForm redirectTo={data.redirectTo} {form} />
