<script lang="ts">
	import { onMount } from 'svelte';
	import type { AppSummary } from './types';

	let { storeId, href = `/apps/${storeId}` }: { storeId: string; href?: string } = $props();
	let summary = $state<AppSummary | null>(null);
	let loading = $state(true);
	let container: HTMLDivElement;

	onMount(() => {
		let cancelled = false;
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				fetch(`/api/apps/${encodeURIComponent(storeId)}/summary`)
					.then((response) => (response.ok ? response.json() : null))
					.then((value: AppSummary | null) => {
						if (!cancelled) summary = value;
					})
					.catch(() => undefined)
					.finally(() => {
						if (!cancelled) loading = false;
					});
			},
			{ rootMargin: '200px' }
		);

		observer.observe(container);
		return () => {
			cancelled = true;
			observer.disconnect();
		};
	});

	const installsLabel = $derived(
		summary?.installs == null ? null : new Intl.NumberFormat().format(summary.installs)
	);
</script>

<div bind:this={container} class="flex min-w-0 items-center gap-2">
	{#if summary?.icon}
		<img class="h-8 w-8 rounded-lg" src={summary.icon} alt="" loading="lazy" />
	{/if}
	<div class="min-w-0">
		<p class="truncate font-medium">
			<a class="hover:underline" {href}>{summary?.name ?? (loading ? 'Loading app…' : storeId)}</a>
		</p>
		<p class="text-xs text-surface-500">
			{#if installsLabel}{installsLabel} installs ·
			{/if}{storeId}
		</p>
	</div>
</div>
