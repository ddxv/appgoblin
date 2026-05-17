<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { getPlanSummary } from '$lib/account/subscription';

	let { data }: { data: PageData } = $props();
	let planSummary = $derived(getPlanSummary(data.subscriptionTier));

	function formatDate(date: string | Date | null | undefined): string {
		if (!date) return 'Not available';

		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatStatus(status: string): string {
		return status.charAt(0).toUpperCase() + status.slice(1);
	}
</script>

<svelte:head>
	<title>Subscription - AppGoblin</title>
</svelte:head>

<div class="space-y-6">
	<div class="p-6 md:p-8 space-y-2 border-b border-surface-300-700">
		<h1 class="text-2xl font-bold">Subscription</h1>
		<p class="text-sm">Review your current plan, renewal timing, and API limits.</p>
	</div>

	<section class="space-y-4">
		<div class="p-6 md:p-8 space-y-6">
			{#if data.subscription}
				<div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div>
						{#if data.subscription.status === 'active' && data.subscription.cancel_at}
							<p class="text-sm text-warning-700-300 font-medium mb-1">
								Active (Cancels {new Date(data.subscription.cancel_at).toLocaleDateString()})
							</p>
						{:else}
							<p class="font-bold text-xl mb-1">{formatStatus(data.subscription.status)}</p>
						{/if}

						<p>Plan: {data.subscriptionTier ?? planSummary.name}</p>
						<p class="mt-3 max-w-2xl text-sm">{planSummary.description}</p>

						<div class="mt-2">
							{#if data.subscription.cancel_at}
								<p class="text-sm text-warning-700-300">Access available until end of period</p>
							{:else}
								<p class="text-sm">
									Renews on {new Date(data.subscription.current_period_end).toLocaleDateString()}
								</p>
							{/if}
						</div>
					</div>
					<span
						class="badge px-3 py-1 font-medium {data.subscription.status === 'active'
							? 'preset-filled-success-300-700'
							: 'preset-filled-warning-500'}"
					>
						{formatStatus(data.subscription.status)}
					</span>
				</div>

				<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
					<div class="rounded-lg border border-surface-300-700 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide">Plan tier</p>
						<p class="mt-1 font-semibold">{data.subscriptionTier ?? planSummary.name}</p>
					</div>
					<div class="rounded-lg border border-surface-300-700 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide">API limits</p>
						<p class="mt-1 font-semibold">{planSummary.limits}</p>
					</div>
					<div class="rounded-lg border border-surface-300-700 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide">Current period started</p>
						<p class="mt-1 font-semibold">{formatDate(data.subscription.current_period_start)}</p>
					</div>
					<div class="rounded-lg border border-surface-300-700 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide">
							{data.subscription.cancel_at ? 'Access ends' : 'Next renewal'}
						</p>
						<p class="mt-1 font-semibold">
							{formatDate(data.subscription.cancel_at ?? data.subscription.current_period_end)}
						</p>
					</div>
				</div>

				{#if data.subscription.cancel_requested_at || data.subscription.cancel_at}
					<div
						class="rounded-lg border border-warning-500/30 bg-warning-500/10 p-4 text-sm text-warning-700-300"
					>
						{#if data.subscription.cancel_requested_at}
							Cancellation requested on {formatDate(data.subscription.cancel_requested_at)}.
						{/if}
						{#if data.subscription.cancel_at}
							Access remains available through {formatDate(data.subscription.cancel_at)}.
						{/if}
					</div>
				{/if}

				<form method="POST" action="?/portal" use:enhance>
					<button type="submit" class="btn preset-tonal w-full sm:w-auto"
						>Manage Subscription at Stripe</button
					>
				</form>
			{:else}
				<div class="space-y-6 py-2">
					<div>
						<h3 class="text-lg font-bold">{planSummary.name} Plan</h3>
						<p class="mt-2">{planSummary.description}</p>
					</div>
					<div class="grid gap-3 md:grid-cols-2">
						<div class="rounded-lg border border-surface-300-700 p-4">
							<p class="text-xs font-semibold uppercase tracking-wide">API limits</p>
							<p class="mt-1 font-semibold">{planSummary.limits}</p>
						</div>
						<div class="rounded-lg border border-surface-300-700 p-4">
							<p class="text-xs font-semibold uppercase tracking-wide">Upgrade</p>
							<p class="mt-1 font-semibold">Unlock higher limits and paid data workflows</p>
						</div>
					</div>
					<a href="/pricing" class="btn preset-filled-primary-500">View Pricing & Upgrade</a>
				</div>
			{/if}
		</div>
	</section>

	{#if data.subscriptionHistory?.length}
		<section class="space-y-4">
			<div class="p-6 md:p-8 space-y-4 border-t border-surface-300-700">
				<div>
					<h2 class="text-lg font-bold">Previous Subscriptions</h2>
					<p class="text-sm">Recent ended plans retained for billing history and support checks.</p>
				</div>

				<div class="space-y-3">
					{#each data.subscriptionHistory as entry}
						<div class="rounded-lg border border-surface-300-700 p-4">
							<div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
								<div>
									<p class="font-semibold">{entry.planName}</p>
									<p class="mt-1 text-sm text-surface-600-400">
										{formatStatus(entry.status)}
										{#if entry.cancel_at}
											, ended {formatDate(entry.cancel_at)}
										{:else}
											, last period ended {formatDate(entry.current_period_end)}
										{/if}
									</p>
								</div>
								<span class="badge px-3 py-1 font-medium preset-filled-surface-500">
									{formatStatus(entry.status)}
								</span>
							</div>

							<div class="mt-3 grid gap-3 md:grid-cols-3 text-sm">
								<div>
									<p class="text-xs font-semibold uppercase tracking-wide">Period started</p>
									<p class="mt-1 font-semibold">{formatDate(entry.current_period_start)}</p>
								</div>
								<div>
									<p class="text-xs font-semibold uppercase tracking-wide">Period ended</p>
									<p class="mt-1 font-semibold">{formatDate(entry.current_period_end)}</p>
								</div>
								<div>
									<p class="text-xs font-semibold uppercase tracking-wide">
										Cancellation requested
									</p>
									<p class="mt-1 font-semibold">{formatDate(entry.cancel_requested_at)}</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</div>
