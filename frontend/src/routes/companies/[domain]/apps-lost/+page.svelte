<script lang="ts">
	import CompanyAppChangesGrid from '$lib/CompanyAppChangesGrid.svelte';
	import type { CompanyAppChangesOverview } from '../../../../types';

	type QuarterAppChangesEntry = {
		label: string;
		appChanges: CompanyAppChangesOverview;
	};

	interface Props {
		data: {
			quarterlyAppChanges: QuarterAppChangesEntry[];
			companyName: string;
			hasB2BSdkAccess: boolean;
		};
	}

	let { data }: Props = $props();
</script>

<section class="mb-4 space-y-2">
	<h2 class="text-xl font-semibold">Recently Lost Apps</h2>
	<p class="text-sm mb-3">
		This view tracks apps that recently removed this company through SDK, API-call, or app-ads.txt
		direct signals across the latest available quarter and the quarter before it.
	</p>
</section>

{#if !data.hasB2BSdkAccess}
	<div class="mb-4 p-3 bg-warning-50-950/20 rounded-lg border border-warning-800-200">
		<p class="text-sm text-warning-950-50 flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
				<path d="M7 11V7a5 5 0 0 1 10 0v4" />
			</svg>
			Preview only. Recently changed app lists are available on the B2B SDK Intelligence tier.
			<a href="/pricing" class="underline hover:text-primary-600-400">Upgrade</a>
			to unlock.
		</p>
	</div>
{/if}

{#if data.quarterlyAppChanges.length > 0}
	<div class="space-y-6">
		{#each data.quarterlyAppChanges as entry (entry.label)}
			<section class="space-y-4">
				<div>
					<h3 class="text-lg font-semibold">
						{entry.label}: {entry.appChanges.year} Q{entry.appChanges.quarter}
					</h3>
				</div>
				<CompanyAppChangesGrid
					appChanges={entry.appChanges}
					companyName={data.companyName}
					previewMode={!data.hasB2BSdkAccess}
					status="lost"
				/>
			</section>
		{/each}
	</div>
{:else}
	<p class="text-center p-4">
		No recently lost apps found for this company in the latest two quarters.
	</p>
{/if}
