<script lang="ts">
	import { page } from '$app/state';
	import MainContent from '$lib/MainContent.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let isLoginPage = $derived(page.url.pathname === '/auth/login');
</script>

<MainContent class="mx-auto w-full {isLoginPage ? 'max-w-none' : 'max-w-md space-y-8 px-8'}">
	{@render children?.()}
</MainContent>
