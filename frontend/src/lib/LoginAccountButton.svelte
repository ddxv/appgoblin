<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import UserRound from 'lucide-svelte/icons/user-round';
	import LogIn from 'lucide-svelte/icons/log-in';

	type LiveUser = { username: string; emailVerified: boolean };

	let liveUser = $state<LiveUser | null | undefined>(undefined);

	// Until the live fetch resolves, fall back to page data (correct for SSR pages).
	let user = $derived(liveUser !== undefined ? liveUser : page.data.user);

	// `page.url.search` cannot be read during prerendering, so only build the
	// `redirectTo` in the browser. During SSR/prerender we link to plain /auth/login.
	let loginHref = $derived(
		browser
			? `/auth/login?redirectTo=${encodeURIComponent(page.url.pathname + page.url.search)}`
			: '/auth/login'
	);

	$effect(() => {
		// Reactive dependency: re-fetch auth state whenever the route changes.
		void page.url.pathname;

		fetch('/auth/me', { credentials: 'same-origin' })
			.then((res) => (res.ok ? res.json() : null))
			.then((data: { user: LiveUser | null } | null) => {
				if (data) liveUser = data.user;
			})
			.catch(() => {
				// Network error: keep the page-data fallback.
			});
	});
</script>

{#if user}
	<a
		href="/account"
		class="btn preset-tonal p-1.5 md:p-2 flex items-center gap-1 md:gap-2"
		title={user ? `Account: ${user.username}` : 'Login'}
	>
		<UserRound size={20} class="" />
		<span class="hidden lg:inline text-sm">{user.username}</span>
	</a>
{:else}
	<a
		href={loginHref}
		class="btn preset-tonal-primary inline-flex items-center gap-2 p-2"
		title="Login"
	>
		<span class="text-xs md:text-sm font-bold flex items-center gap-2">
			<LogIn size={18} /> LOGIN</span
		>
	</a>
{/if}
