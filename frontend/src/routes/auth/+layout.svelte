<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	let isLoginPage = $derived(page.url.pathname === '/auth/login');
</script>

<div class="mx-auto w-full {isLoginPage ? 'max-w-none' : 'max-w-md space-y-8 px-8'}">
	{@render children?.()}
</div>
