<script lang="ts">
	import WhiteCard from './WhiteCard.svelte';
	import CompanyTopAppsTable from './CompanyTopAppsTable.svelte';
	import type { CompanyAppChangesOverview } from '../types';

	type PreviewPlatform = 'android' | 'ios';

	type PlaceholderAppPreview = {
		name: string;
		developer: string;
		metric: string;
		sourceLabel: string;
	};

	type Props = {
		appChanges: CompanyAppChangesOverview;
		companyName?: string;
		previewMode?: boolean;
		status: 'added' | 'lost';
	};

	let { appChanges, companyName = '', previewMode = false, status }: Props = $props();
	let statusLabel = $derived(status === 'lost' ? 'Lost' : 'Added');

	const placeholderPreviewByPlatform: Record<PreviewPlatform, PlaceholderAppPreview[]> = {
		android: [
			{
				name:
					status === 'lost' ? 'Premium Android churn example' : 'Premium Android addition example',
				developer: 'B2B SDK Intelligence Preview',
				metric: '1.2M',
				sourceLabel: 'SDK + API Call'
			},
			{
				name: 'More app movement hidden',
				developer: 'Upgrade to unlock the full list',
				metric: '640K',
				sourceLabel: 'App-Ads.txt'
			}
		],
		ios: [
			{
				name: status === 'lost' ? 'Premium iOS churn example' : 'Premium iOS addition example',
				developer: 'B2B SDK Intelligence Preview',
				metric: '84K',
				sourceLabel: 'SDK'
			},
			{
				name: 'More app movement hidden',
				developer: 'Upgrade to unlock the full list',
				metric: '28K',
				sourceLabel: 'API Call'
			}
		]
	};
</script>

{#snippet lockedPreviewCard(platform: PreviewPlatform)}
	{@const previewRows = placeholderPreviewByPlatform[platform]}
	<div class="space-y-4">
		<div class="overflow-hidden rounded-md border border-surface-200-800 bg-surface-50-950/40">
			<div
				class="grid grid-cols-[minmax(0,1.6fr)_auto_auto] gap-3 border-b border-surface-200-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-700-300"
			>
				<span>App</span>
				<span>{platform === 'android' ? 'Monthly Installs' : 'Monthly iOS Ratings'}</span>
				<span>Signal</span>
			</div>
			<div class="px-3 py-3">
				<div class="grid grid-cols-[minmax(0,1.6fr)_auto_auto] items-center gap-3">
					<div class="flex items-center gap-3 min-w-0">
						<div class="h-9 w-9 rounded-md bg-surface-300-700/70"></div>
						<div class="min-w-0">
							<p class="truncate text-sm font-medium">{previewRows[0].name}</p>
							<p class="truncate text-xs text-surface-700-300">{previewRows[0].developer}</p>
						</div>
					</div>
					<p class="text-sm font-medium text-surface-900-100">{previewRows[0].metric}</p>
					<span class="rounded-full bg-secondary-100-900 px-2 py-1 text-[11px] font-medium">
						{previewRows[0].sourceLabel}
					</span>
				</div>
			</div>
			<div class="relative border-t border-surface-200-800 px-3 py-3 opacity-80">
				<div class="grid grid-cols-[minmax(0,1.6fr)_auto_auto] items-center gap-3 grayscale">
					<div class="flex items-center gap-3 min-w-0">
						<div class="h-9 w-9 rounded-md bg-surface-300-700/70"></div>
						<div class="min-w-0">
							<p class="truncate text-sm font-medium">{previewRows[1].name}</p>
							<p class="truncate text-xs text-surface-700-300">{previewRows[1].developer}</p>
						</div>
					</div>
					<p class="text-sm font-medium text-surface-900-100">{previewRows[1].metric}</p>
					<span
						class="rounded-full bg-surface-200-800 px-2 py-1 text-[11px] font-medium text-surface-700-300"
					>
						{previewRows[1].sourceLabel}
					</span>
				</div>
				<div
					class="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-surface-100-900/25 to-surface-300-700/85"
				></div>
			</div>
		</div>
	</div>
{/snippet}

<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
	<WhiteCard>
		{#snippet title()}
			Recently {statusLabel} Android Apps
		{/snippet}
		{#if appChanges.android.apps && appChanges.android.apps.length > 0}
			<CompanyTopAppsTable
				data={appChanges.android.apps}
				isiOS={false}
				{companyName}
				{previewMode}
			/>
		{:else if previewMode}
			{@render lockedPreviewCard('android')}
		{:else}
			<p class="text-xs md:text-sm mb-2">No Android apps found in this quarterly change list.</p>
		{/if}
	</WhiteCard>
	<WhiteCard>
		{#snippet title()}
			Recently {statusLabel} iOS Apps
		{/snippet}
		{#if appChanges.ios.apps && appChanges.ios.apps.length > 0}
			<CompanyTopAppsTable data={appChanges.ios.apps} isiOS={true} {companyName} {previewMode} />
		{:else if previewMode}
			{@render lockedPreviewCard('ios')}
		{:else}
			<p class="text-xs md:text-sm mb-2">No iOS apps found in this quarterly change list.</p>
		{/if}
	</WhiteCard>
</div>
