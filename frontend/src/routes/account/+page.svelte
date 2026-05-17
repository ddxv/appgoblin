<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LogOut from 'lucide-svelte/icons/log-out';
	import ShieldCheck from 'lucide-svelte/icons/shield-check';
	import { getPlanSummary } from '$lib/account/subscription';

	let { data }: { data: PageData } = $props();
	let planSummary = $derived(getPlanSummary(data.subscriptionTier));

	function formatDate(date: string | Date | null | undefined): string {
		if (!date) return 'Not scheduled';

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
	<title>Account - AppGoblin</title>
</svelte:head>

<div class="p-6 md:p-8 space-y-8">
	<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
		<div>
			<h1 class="text-2xl font-bold">Hello, {data.user.username}!</h1>
			<p class="text-sm">Review your plan, security status, and account access in one place.</p>
		</div>

		<form method="post" action="?/logout" use:enhance>
			<button class="btn preset-tonal flex items-center justify-center gap-2 w-full sm:w-auto">
				<LogOut size={18} />
				Sign Out
			</button>
		</form>
	</div>

	<section class="space-y-4">
		<div class="grid gap-4 lg:grid-cols-2">
			<!-- Subscription Status -->
			<div class="space-y-4 rounded-lg border border-surface-300-700 p-6">
				<div class="flex items-start justify-between gap-3">
					<div>
						<h2 class="text-sm font-semibold uppercase tracking-wide">Subscription Plan</h2>
						<div class="mt-2 flex items-center gap-2">
							<CreditCard size={18} class="text-primary-500" />
							<p class="text-xl font-bold">{data.subscriptionTier ?? planSummary.name}</p>
						</div>
					</div>
					<a href="/account/subscription" class="btn btn-sm preset-tonal shrink-0">Manage</a>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					{#if data.subscription}
						<span class="badge preset-filled-success-300-700 text-xs">
							{formatStatus(data.subscription.status)}
						</span>
						{#if data.subscription.cancel_at}
							<span class="badge preset-filled-warning-500 text-xs">
								Cancels {formatDate(data.subscription.cancel_at)}
							</span>
						{/if}
					{:else}
						<span class="badge preset-filled-surface-500 text-xs">Free Plan</span>
					{/if}
				</div>

				<p class="text-sm">{planSummary.description}</p>

				<div class="grid gap-3 sm:grid-cols-2">
					<div class="rounded-lg border border-surface-300-700 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide">API limits</p>
						<p class="mt-1 font-semibold">{planSummary.limits}</p>
					</div>
					<div class="rounded-lg border border-surface-300-700 p-4">
						<p class="text-xs font-semibold uppercase tracking-wide">
							{data.subscription
								? data.subscription.cancel_at
									? 'Access through'
									: 'Renews on'
								: 'Upgrade path'}
						</p>
						<p class="mt-1 font-semibold">
							{data.subscription
								? formatDate(data.subscription.current_period_end)
								: 'See pricing for paid plans'}
						</p>
					</div>
				</div>
			</div>

			<!-- Quick Security Status -->
			<div class="space-y-4 rounded-lg border border-surface-300-700 p-6">
				<div class="flex items-start justify-between gap-3">
					<div>
						<h2 class="text-sm font-semibold uppercase tracking-wide">Security Status</h2>
						<p class="mt-2 text-xl font-bold">
							{data.user.registered2FA ? 'Protected' : 'Needs setup'}
						</p>
					</div>
					<a href="/account/security" class="btn btn-sm preset-tonal shrink-0">Manage</a>
				</div>

				<div class="flex items-center gap-3 rounded-lg border border-surface-300-700 p-4">
					<ShieldCheck
						size={24}
						class={data.user.registered2FA ? 'text-success-500' : 'text-surface-400'}
					/>
					<div>
						<p class="font-bold">{data.user.registered2FA ? '2FA Enabled' : 'Add 2FA'}</p>
						<p class="text-sm">
							{data.user.registered2FA ? 'Your account is secure.' : 'Not set up yet.'}
						</p>
					</div>
				</div>

				<div class="rounded-lg border border-surface-300-700 p-4">
					<p class="text-xs font-semibold uppercase tracking-wide">Email</p>
					<p class="mt-1 font-semibold">{data.user.email}</p>
					<p class="mt-1 text-sm">
						{data.user.emailVerified ? 'Email verified.' : 'Email verification still pending.'}
					</p>
				</div>
			</div>
		</div>
	</section>
</div>
