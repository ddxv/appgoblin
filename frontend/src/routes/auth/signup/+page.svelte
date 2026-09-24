<script lang="ts">
	import SignupForm from '$lib/SignupForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<SignupForm redirectTo={data.redirectTo} {form} />
