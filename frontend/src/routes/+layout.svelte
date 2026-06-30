<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';

	import IconSearch from '$lib/svg/IconSearch.svelte';
	import MenuIcon from 'lucide-svelte/icons/menu';
	import MoonIcon from 'lucide-svelte/icons/moon';
	import SunIcon from 'lucide-svelte/icons/sun';

	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import discordIconSvg from '$lib/svg/discord-mark-black.svg?raw';
	import githubIconSvg from '$lib/svg/github-mark.svg?raw';
	import LoginAccountButton from '$lib/LoginAccountButton.svelte';
	import MainContent from '$lib/MainContent.svelte';
	import NavTabs from '$lib/NavTabs.svelte';
	import { initializeTheme, resolvedThemeMode, toggleTheme } from '$lib/stores/theme.svelte';

	let { children } = $props();
	let isSearchStarting = $state(false);
	const discordIcon = discordIconSvg.replace('<svg ', '<svg class="h-full w-full" ');
	const githubIcon = githubIconSvg
		.replace('<svg ', '<svg class="h-full w-full" ')
		.replace('fill="#24292f"', 'fill="currentColor"');

	async function handleSearchSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (isSearchStarting) return;

		const form = event.currentTarget as HTMLFormElement;
		const termValue = new FormData(form).get('term');
		const term = typeof termValue === 'string' ? termValue.trim() : '';

		if (!term) return;

		isSearchStarting = true;

		try {
			await goto(`/search/${encodeURIComponent(term)}`);
		} finally {
			isSearchStarting = false;
		}
	}

	onMount(() => {
		initializeTheme();
	});

	// Identify logged-in users in Umami analytics.
	$effect(() => {
		const user = page.data.user;
		if (user && typeof window !== 'undefined' && (window as any).umami?.identify) {
			(window as any).umami.identify({ id: String(user.id) });
		}
	});
</script>

<div class="grid h-screen grid grid-rows-[auto_1fr_auto]">
	<header class="sticky top-0 z-10">
		<AppBar class="bg-surface-50-950">
			<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
				<AppBar.Lead class="shrink-0 min-w-fit">
					<a href="/" class="flex items-center shrink-0">
						<img
							class="h-8 w-8 shrink-0 lg:ml-2 lg:h-12 lg:w-12"
							src="/goblin_purple_hat_60.png"
							alt="AppGoblin Icon"
						/>
						<strong
							class="hidden lg:inline-flex text-xs ml-1 lg:ml-2 lg:text-lg xl:text-xl uppercase text-secondary-800-200"
							>AppGoblin</strong
						>
					</a>
				</AppBar.Lead>

				<AppBar.Headline class="hidden md:inline-flex md:ml-8 ">
					<div>
						<NavTabs />
					</div>
				</AppBar.Headline>

				<AppBar.Trail class="overflow-hidden flex justify-end">
					<div class="flex gap-1 md:gap-2">
						<div class="hidden lg:flex items-center gap-1">
							<a
								href="https://discord.gg/7jpWEhkXRW"
								target="_blank"
								rel="noreferrer"
								class="inline-flex h-11 w-11 items-center justify-center rounded-full text-secondary-800-200 transition-colors hover:bg-secondary-900-100/10 hover:text-primary-900-100"
								aria-label="Join AppGoblin Discord"
								title="Discord"
							>
								<span class="inline-flex h-5 w-5 items-center justify-center xl:h-6 xl:w-6"
									>{@html discordIcon}</span
								>
							</a>
							<a
								href="https://github.com/appgoblin-dev/appgoblin"
								target="_blank"
								rel="noreferrer"
								class="inline-flex h-11 w-11 items-center justify-center rounded-full text-secondary-800-200 transition-colors hover:bg-secondary-900-100/10 hover:text-primary-900-100"
								aria-label="Open AppGoblin GitHub"
								title="GitHub"
							>
								<span class="inline-flex h-5 w-5 items-center justify-center xl:h-6 xl:w-6"
									>{@html githubIcon}</span
								>
							</a>
						</div>

						<form
							class="input-group grid-cols-[1fr_auto]"
							role="search"
							aria-busy={isSearchStarting}
							onsubmit={handleSearchSubmit}
						>
							<input
								class="ig-input"
								type="search"
								name="term"
								placeholder="Search Apps & Companies"
								disabled={isSearchStarting}
								required
							/>
							<button
								class="ig-cell preset-tonal inline-flex items-center justify-center p-2 md:p-4"
								type="submit"
								disabled={isSearchStarting}
								aria-label={isSearchStarting ? 'Searching' : 'Search'}
							>
								{#if isSearchStarting}
									<span
										class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
										aria-hidden="true"
									></span>
									<span class="sr-only">Searching...</span>
								{:else}
									<IconSearch />
								{/if}
							</button>
						</form>

						<LoginAccountButton />
					</div>
				</AppBar.Trail>
			</AppBar.Toolbar>
		</AppBar>
	</header>

	<MainContent>
		{@render children?.()}
	</MainContent>

	<footer>
		<div class="stick bottom-0 z-10 p-2">
			{#if page.url.pathname.startsWith('/blog/')}
				<div class="inline-flex md:hidden">
					<NavTabs hideLinks={true} />
				</div>
			{:else}
				<div class="fixed right-4 bottom-4 p-4 md:hidden">
					<Menu>
						<Menu.Trigger class="btn preset-filled"><MenuIcon /> Menu</Menu.Trigger>
						<Portal>
							<Menu.Positioner>
								<Menu.Content>
									<NavTabs flat={true} />
								</Menu.Content>
							</Menu.Positioner>
						</Portal>
					</Menu>
				</div>
			{/if}
		</div>
		<!-- Footer -->
		<div class="mt-12 border-t py-8 text-sm text-surface-600 dark:text-surface-400">
			<div class="mx-auto max-w-6xl px-4">
				<div class="flex flex-col gap-4 md:relative md:items-center">
					<div class="self-start md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">
						<button
							type="button"
							class="inline-flex items-center gap-2 rounded-full border border-surface-300 px-3 py-1.5 font-medium text-surface-700 transition-colors hover:bg-surface-100 dark:border-surface-700 dark:text-surface-200 dark:hover:bg-surface-800"
							onclick={toggleTheme}
							aria-label={$resolvedThemeMode === 'dark'
								? 'Switch to light mode'
								: 'Switch to dark mode'}
							aria-pressed={$resolvedThemeMode === 'dark'}
						>
							{#if $resolvedThemeMode === 'dark'}
								<SunIcon class="size-4" />
								<span>Light mode</span>
							{:else}
								<MoonIcon class="size-4" />
								<span>Dark mode</span>
							{/if}
						</button>
					</div>

					<div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-center">
						<a href="/about" class="underline hover:">About AppGoblin</a>
						&nbsp;|&nbsp;
						<a href="/contact" class="underline hover:">Contact</a>
						&nbsp;|&nbsp;
						<a href="/blog" class="underline hover:">Blog</a>
						&nbsp;|&nbsp;
						<a href="/reports" class="underline hover:">Reports</a>
						&nbsp;|&nbsp;
						<a href="/pricing" class="underline hover:">Pricing</a>
						&nbsp;|&nbsp;
						<a href="/privacy_policy.html" class="underline hover:">Privacy Policy</a>
						&nbsp;|&nbsp;
						<a href="https://github.com/appgoblin-dev/appgoblin" class="underline hover:">GitHub</a>
						&nbsp;|&nbsp;
						<a href="https://linkedin.com/companies/AppGoblin" class="underline hover:">LinkedIn</a>
					</div>
				</div>
			</div>
			<div>© {new Date().getFullYear()} AppGoblin. All rights reserved.</div>
		</div>
	</footer>
</div>
