<script lang="ts">
	import { page } from '$app/state';
	import UsersIcon from 'lucide-svelte/icons/users';

	type Props = {
		storeId: string;
	};

	let { storeId }: Props = $props();

	const items = $derived([
		{ href: `/apps/${storeId}/keywords`, label: 'Overview' },
		{ href: `/apps/${storeId}/keywords/ranking`, label: 'Ranking' },
		{ href: `/apps/${storeId}/keywords/discovery`, label: 'Discovery' },
		{ href: `/apps/${storeId}/keywords/tracked`, label: 'My Keywords', requiresAuth: true },
		{ href: `/apps/${storeId}/keywords/compare`, label: 'Compare', requiresAuth: true }
	]);

	const isActive = (href: string) => page.url.pathname === href;
</script>

<nav class="rounded-xl border border-surface-300-700 bg-surface-100-900 p-3 shadow-sm">
	<div class="flex gap-2 overflow-x-auto pb-1">
		{#each items as item (item.href)}
			<a
				href={item.href}
				class={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors ${
					isActive(item.href)
						? 'bg-surface-200-800 text-primary-contrast-500'
						: 'bg-surface-200-800 text-primary-900-100 hover:bg-surface-300-700'
				}`}
			>
				<span class="inline-flex items-center gap-1.5">
					{#if item.requiresAuth}
						<UsersIcon class="h-3.5 w-3.5" aria-hidden="true" />
					{/if}
					{item.label}
				</span>
			</a>
		{/each}
	</div>
</nav>
