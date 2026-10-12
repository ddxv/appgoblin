<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import Users from '@lucide/svelte/icons/users';
	import UserPlus from '@lucide/svelte/icons/user-plus';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<title>Team - AppGoblin</title>
</svelte:head>

<div class="space-y-6">
	<div class="border-b border-surface-300-700 p-6 md:p-8 space-y-2">
		<h1 class="text-2xl font-bold">Team</h1>
		<p class="text-sm">Manage the people who share your organization’s paid access.</p>
	</div>

	{#if data.organization}
		<section class="p-6 md:p-8 space-y-4">
			<div class="flex items-center gap-3">
				<Users size={22} class="text-primary-500" />
				<div>
					<h2 class="text-lg font-semibold">{data.organization.organizationName}</h2>
					<p class="text-sm">
						{data.seats?.seatsUsed ?? 0} of {data.seats?.seatsTotal ?? 3} seats used
					</p>
				</div>
			</div>

			<div class="space-y-2">
				{#each data.members as member}
					<div class="flex items-center gap-3 rounded-lg border border-surface-300-700 p-4">
						<div class="flex-1 min-w-0">
							<p class="font-medium truncate">{member.username}</p>
							<p class="text-sm truncate">{member.email}</p>
						</div>
						<span class="badge preset-tonal text-xs capitalize">{member.role}</span>
					</div>
				{/each}
			</div>
		</section>

		{#if data.organization.role === 'owner'}
			<section class="border-t border-surface-300-700 p-6 md:p-8 space-y-4">
				<div>
					<h2 class="text-lg font-semibold">Organization settings</h2>
					<p class="text-sm">Choose the name your team sees on AppGoblin.</p>
				</div>
				<form method="post" action="?/rename" use:enhance class="flex flex-col gap-3 sm:flex-row">
					<label class="sr-only" for="organization-name">Organization name</label>
					<input
						id="organization-name"
						name="name"
						type="text"
						value={data.organization.organizationName}
						minlength="2"
						maxlength="120"
						required
						class="input flex-1"
					/>
					<button class="btn preset-tonal" type="submit">Save name</button>
				</form>
				{#if form?.renameSuccess}<p class="text-sm text-success-600">
						Organization name updated.
					</p>{/if}
			</section>

			<section class="border-t border-surface-300-700 p-6 md:p-8 space-y-4">
				<div>
					<h2 class="text-lg font-semibold">Invite a member</h2>
					<p class="text-sm">
						Invitations expire after seven days. If they do not see the email, remind them to check
						their Spam or Junk folder.
					</p>
				</div>
				<form method="post" action="?/invite" use:enhance class="flex flex-col gap-3 sm:flex-row">
					<label class="sr-only" for="invite-email">Email address</label>
					<input
						id="invite-email"
						name="email"
						type="email"
						required
						placeholder="colleague@example.com"
						class="input flex-1"
					/>
					<button
						class="btn preset-filled-primary-500 flex items-center justify-center gap-2"
						type="submit"
					>
						<UserPlus size={18} /> Invite
					</button>
				</form>
				{#if form?.message}<p class="text-sm text-error-500">{form.message}</p>{/if}
				{#if form?.success}<p class="text-sm text-success-600">Invitation created.</p>{/if}
			</section>
		{/if}
	{:else}
		<section class="p-6 md:p-8">
			<p>Your organization is not available yet. Please contact support.</p>
		</section>
	{/if}
</div>
