<script lang="ts">
	import PlanSignupCallout from '$lib/PlanSignupCallout.svelte';
	import SignupForm from '$lib/SignupForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Create your account - AppGoblin</title>
</svelte:head>

{#if data.planKey}
	<PlanSignupCallout planKey={data.planKey} mode="signup" />
{:else}
	<h2 class="text-2xl font-bold">Create an account</h2>
	<p class="text-sm leading-relaxed">Choose a plan from the pricing page to begin a subscription.</p>
{/if}

<SignupForm redirectTo={data.redirectTo} form={form} />
