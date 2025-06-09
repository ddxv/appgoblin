<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import { Popover } from '@skeletonlabs/skeleton-svelte';

	import IconSearch from '$lib/svg/IconSearch.svelte';
	import { Menu } from 'lucide-svelte';
	import OpenSideBarDrawer from '$lib/utils/OpenSideBarDrawer.svelte';
	import SideBar from '$lib/SideBar.svelte';

	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	import { homeCategoryMap } from '../stores';

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
	interface Props {
		data: any;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	homeCategoryMap.set(data.appCats);

	let menuBarOpenState = $state(false);

	function popoverClose() {
		menuBarOpenState = false;
	}
</script>

<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<header class="sticky top-0 z-10">
		<AppBar
			leadBase="mr-2"
			trailBase="mx-2 my-1"
			padding="p-1 md:px-2 md:py-1"
			centerBase="hidden md:block"
			background="bg-surface-50-950"
		>
			{#snippet lead()}
				<div class="flex items-center">
					<a href="/" class="flex">
						<div class="flex items-center flex-col md:flex-row">
							<img
								class="md:ml-2 h-8 md:h-12 w-8 md:w-12"
								src="/goblin_purple_hat_60.png"
								alt="AppGoblin Icon"
							/>
							<strong class="text-xs ml-1 md:ml-2 md:text-xl uppercase text-primary-900-100"
								>AppGoblin</strong
							>
						</div>
					</a>
				</div>
			{/snippet}

			<div class="hidden md:inline-flex">
				<NavTabs />
			</div>

			{#snippet trail()}
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
						<a href="https://github.com/ddxv/appgoblin" target="_blank" rel="noreferrer">
							<button type="button" class="btn preset-tonal hover:preset-tonal-primary p-1 md:p-2">
								<div class="inline-flex items-center text-xs md:text-base gap-1 md:gap-2">
									{@html githubIcon} Star on GitHub
								</div>
							</button>
						</a>

						<a href="https://discord.gg/7jpWEhkXRW" target="_blank" rel="noreferrer">
							<button type="button" class="btn preset-tonal hover:preset-tonal-primary p-1 md:p-2">
								<div class="inline-flex items-center text-xs md:text-base gap-1 md:gap-2">
									{@html discordIcon} Discord
								</div>
							</button>
						</a>
					</div>
				</div>
			{/snippet}
		</AppBar>
	</header>

	<div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
		<aside class="hidden md:block">
			<div>
				{#await data.appCats then myCatData}
					<SideBar {myCatData} />
				{/await}
			</div>
		</aside>

		<main>
			{@render children?.()}
		</main>
	</div>

	<footer class="sticky bottom-0 z-10 bg-surface-50-950 p-2">
		<div class="md:hidden p-2">
			{#if page.url.pathname.startsWith('/collections') || page.url.pathname.startsWith('/rankings') || page.url.pathname.startsWith('/companies') || page.url.pathname.startsWith('/fastest-growing-apps')}
				{#await data.appCats then myCatData}
					<OpenSideBarDrawer {myCatData} />
				{/await}
			{/if}
		</div>
		{#if page.url.pathname.startsWith('/blog/')}
			<div class="inline-flex md:hidden">
				<NavTabs hideLinks={true} />
			</div>
		{:else}
			<div class="fixed right-4 bottom-4 p-4">
				<Popover
					open={menuBarOpenState}
					onOpenChange={(e) => (menuBarOpenState = e.open)}
					positioning={{ placement: 'top' }}
					triggerBase="btn preset-tonal-primary"
					contentBase="card bg-surface-200-800 p-4 space-y-4 max-w-[320px]"
					arrow
					arrowBackground="!bg-surface-200 dark:!bg-surface-800"
				>
					{#snippet trigger()}
						<span class="flex items-center gap-2">
							Menu <Menu size={24} />
						</span>
					{/snippet}
					{#snippet content()}
						<NavTabs />
					{/snippet}
				</Popover>
			</div>
		{/if}
	</footer>
</div>
