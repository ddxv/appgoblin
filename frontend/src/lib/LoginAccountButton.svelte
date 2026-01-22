<script lang="ts">
	import { page } from '$app/state';
	import UserRound from 'lucide-svelte/icons/user-round';
	import LogIn from 'lucide-svelte/icons/log-in';

	// Access user from page data (set by root +layout.server.ts)
	let user = $derived(page.data.user);
</script>

{#if user}
	<a
		href="/account"
		class="btn preset-tonal hover:preset-tonal-primary p-1.5 md:p-2 flex items-center gap-1 md:gap-2"
		title={user ? `Account: ${user.username}` : 'Login'}
	>
		<UserRound size={20} class="text-primary-900-100" />
		<span class="hidden lg:inline text-sm">{user.username}</span>
	</a>
{:else}
	<a
		href="/account"
		class="btn-primary inline-flex items-center gap-2 px-2 py-2 bg-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
		title="Login"
	>
		<span class="text-xs md:text-sm text-black font-bold flex items-center gap-2">
			<LogIn size={18} /> LOGIN</span
		>
	</a>
{/if}
