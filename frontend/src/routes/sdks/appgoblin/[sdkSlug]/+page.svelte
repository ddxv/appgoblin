<script lang="ts">
	import { enhance } from '$app/forms';
	import Mail from '@lucide/svelte/icons/mail';
	import Loader2 from '@lucide/svelte/icons/loader-2';
	import SDKOverviewTable from '$lib/SDKOverviewTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	let { data, form } = $props();
	let isExporting = $state(false);
	let exportMessage = $derived(typeof form?.exportMessage === 'string' ? form.exportMessage : '');
	let exportError = $derived(typeof form?.error === 'string' ? form.error : '');
</script>

<input type="hidden" name="sdk_id" value={data.sdk_id} />

<svelte:head><meta name="robots" content="noindex, nofollow" /></svelte:head>

<div class="p-2 md:p-4 space-y-4 md:space-y-6">
	<header class="px-2 md:px-4">
		<p class="text-sm uppercase tracking-wider text-surface-600-400">SDK</p>
		<h1 class="text-3xl md:text-4xl font-bold break-all">{data.sdk_name}</h1>
	</header>

	<section class="px-2 md:px-4">
		<WhiteCard>
			{#snippet title()}
				<div class="flex items-center justify-between gap-3">
					<span>Top apps</span>
					<form
						method="POST"
						action="?/emailExport"
						use:enhance={() => {
							isExporting = true;
							return async ({ update }) => {
								await update({ reset: false });
								isExporting = false;
							};
						}}
					>
						<input type="hidden" name="sdk_id" value={data.sdk_id} />
						<button
							type="submit"
							disabled={!data.hasB2BSdkAccess || isExporting}
							class="btn preset-tonal-primary flex items-center gap-2 text-sm"
						>
							{#if isExporting}<Loader2 size={16} class="animate-spin" />{:else}<Mail
									size={16}
								/>{/if}
							{isExporting ? 'Queueing CSV Email...' : 'Generate & Email Full Report'}
						</button>
					</form>
				</div>
			{/snippet}
			{#if exportMessage}<p class="px-4 text-success-900-100 text-sm">{exportMessage}</p>{/if}
			{#if exportError}<p class="px-4 text-error-900-100 text-sm">{exportError}</p>{/if}
			<SDKOverviewTable entries_table={data.apps} previewMode={!data.hasB2BSdkAccess} />
		</WhiteCard>
	</section>

	<section class="px-2 md:px-4">
		<WhiteCard>
			{#snippet title()}Companies using {data.sdk_name}{/snippet}
			<div class="p-4 space-y-2">
				{#each data.companies as company}
					<a class="block underline" href={`/companies/${company.company_domain}`}
						>{company.company_name}</a
					>
				{:else}<p>No companies found.</p>{/each}
			</div>
		</WhiteCard>
	</section>
</div>
