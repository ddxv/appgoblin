<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { Menu, Portal } from '@skeletonlabs/skeleton-svelte';

	import IconSearch from '$lib/svg/IconSearch.svelte';
	import MenuIcon from 'lucide-svelte/icons/menu';
	import Mail from 'lucide-svelte/icons/mail';

	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import githubIcon from '$lib/svg/github-mark.svg?raw';
	import discordIcon from '$lib/svg/discord-mark-black.svg?raw';

	let searchTerm: string = $state('');

	function navigateToSearch(event: any) {
		if (event.key === 'Enter' && searchTerm.trim() !== '') {
			// Replace spaces with '+'
			const encodedSearchTerm = encodeURIComponent(searchTerm.replace(/\s+/g, '+'));

			// Navigate to the search route
			window.location.href = `/search/${encodedSearchTerm}`;
		}
	}

	import NavTabs from '$lib/NavTabs.svelte';

	let { children } = $props();
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<header class="sticky top-0 z-10">
		<AppBar class="bg-surface-50-950">
			<AppBar.Toolbar class="grid-cols-[0.25fr_1fr_0.25fr]">
				<AppBar.Lead>
					<div class="flex items-center">
						<a href="/" class="flex">
							<div class="flex items-center flex-col md:flex-row">
								<img
									class="md:ml-2 h-8 md:h-12 w-8 md:w-12"
									src="/goblin_purple_hat_60.png"
									alt="AppGoblin Icon"
								/>
								<strong
									class="text-xs ml-1 md:ml-2 md:text-lg xl:text-xl uppercase text-primary-900-100"
									>AppGoblin</strong
								>
							</div>
						</a>
					</div>
				</AppBar.Lead>

				<AppBar.Headline>
					<div class="hidden md:inline-flex">
						<NavTabs />
					</div>
				</AppBar.Headline>

				<AppBar.Trail>
					<div>
						<div class="input-group grid-cols-2 grid-cols-[auto_1fr]">
							<div class="input-group-shim p-1 md:p-2">
								<IconSearch />
							</div>
							<div class="text-xs md:text-base p-1">
								<input
									type="search"
									bind:value={searchTerm}
									onkeydown={navigateToSearch}
									placeholder="Search Apps & Companies"
									class="p-0"
								/>
							</div>
						</div>
						<div class="flex items-center p-1 gap-1 md:gap-2">
							<a href="mailto:contact@appgoblin.info" target="_blank" rel="noreferrer">
								<button
									type="button"
									class="btn-primary inline-flex items-center px-2 md:px-4 py-1 md:py-2 bg-white rounded-lg hover:scale-105 transition-transform duration-200 shadow-lg"
								>
									<div
										class="inline-flex items-center text-black font-bold text-xs md:text-sm gap-1 md:gap-2"
									>
										<Mail size={24} /> Contact
									</div>
								</button>
							</a>

							<a href="https://github.com/appgoblin-dev/appgoblin" target="_blank" rel="noreferrer">
								<button
									type="button"
									class="btn preset-tonal hover:preset-tonal-primary p-1 md:p-2"
								>
									<div class="inline-flex items-center text-xs md:text-sm gap-1 md:gap-2">
										{@html githubIcon} GitHub
									</div>
								</button>
							</a>

							<a href="https://discord.gg/7jpWEhkXRW" target="_blank" rel="noreferrer">
								<button
									type="button"
									class="btn preset-tonal hover:preset-tonal-primary p-1 md:p-2"
								>
									<div class="inline-flex items-center text-xs md:text-sm gap-1 md:gap-2">
										{@html discordIcon} Discord
									</div>
								</button>
							</a>
						</div>
					</div>
				</AppBar.Trail>
			</AppBar.Toolbar>
		</AppBar>
	</header>

	<main>
		{@render children?.()}
	</main>

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
									<NavTabs />
								</Menu.Content>
							</Menu.Positioner>
						</Portal>
					</Menu>
				</div>
			{/if}
		</div>
		<!-- Footer -->
		<div class="mt-12 py-8 border-t text-center text-gray-500 text-sm">
			<div class="mb-2">
				<a href="/about" class="underline hover:text-primary-900-100">About AppGoblin</a>
				&nbsp;|&nbsp;
				<a href="/privacy_policy.html" class="underline hover:text-primary-900-100"
					>Privacy Policy</a
				>
				&nbsp;|&nbsp;
				<a
					href="https://github.com/appgoblin-dev/appgoblin"
					class="underline hover:text-primary-900-100">GitHub</a
				>
				&nbsp;|&nbsp;
				<a
					href="https://linkedin.com/companies/AppGoblin"
					class="underline hover:text-primary-900-100">LinkedIn</a
				>
				&nbsp;|&nbsp;
				<a href="mailto:contact@appgoblin.info" class="underline hover:text-primary-900-100"
					>Contact</a
				>
			</div>
			<div>© {new Date().getFullYear()} AppGoblin. All rights reserved.</div>
		</div>
	</footer>
</div>
