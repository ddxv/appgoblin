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

<p class="text-sm mb-3">
	This view tracks apps that recently added this company through SDK, API-call, or app-ads.txt
	direct signals across the latest available quarter and the quarter before it.
</p>

{#if !data.hasB2BSdkAccess}
	<div class="mb-4 rounded-md border border-primary-200 bg-primary-50/50 p-4 text-sm">
		Preview only. Recently changed app lists are available on the
		<a href="/pricing" class="underline hover:text-primary-600-400">B2B SDK Intelligence</a>
		tier.
	</div>
{/if}

{#if data.quarterlyAppChanges.length > 0}
	<div class="space-y-6">
		{#each data.quarterlyAppChanges as entry (entry.label)}
			<section class="space-y-4">
				<div>
					<h2 class="text-lg font-semibold">
						{entry.label}: {entry.appChanges.year} Q{entry.appChanges.quarter}
					</h2>
				</div>
				<CompanyAppChangesGrid
					appChanges={entry.appChanges}
					companyName={data.companyName}
					previewMode={!data.hasB2BSdkAccess}
					status="added"
				/>
			</section>
		{/each}
	</div>
{:else}
	<p class="text-center p-4">
		No recently added apps found for this company in the latest two quarters.
	</p>
{/if}
