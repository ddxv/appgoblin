<script lang="ts">
	import type { CompanySDKsDict } from '../types';
	import WhiteCard from './WhiteCard.svelte';
	import { formatNumber } from './utils/formatNumber';
	import Crown from '@lucide/svelte/icons/crown';
	import Mail from '@lucide/svelte/icons/mail';

	interface Props {
		mySdks: CompanySDKsDict;
		hasB2BSdkAccess: boolean;
	}

	let { mySdks, hasB2BSdkAccess }: Props = $props();
	const uniquePaths = $derived([
		...new Set(
			Object.values(mySdks.companies || {})
				.flatMap((c) => c.sdks || [])
				.flatMap((c) => c.paths || [])
				.map((pattern) => pattern.pattern)
				.filter((path) => path != null)
		)
	]);

	function truncateList<T>(list: T[], maxItems = 20) {
		return list.slice(0, maxItems);
	}
</script>

{#if !hasB2BSdkAccess}
	<div class="mx-2 md:mx-4 mt-2 p-3 bg-warning-50-950/20 rounded-lg border border-warning-800-200">
		<p class="text-sm text-warning-950-50 flex items-center gap-2">
			<Crown class="w-4 h-4 text-primary-900-100" aria-hidden="true" />
			B2B SDK Intelligence tier.
			<a href="/pricing" class="underline hover:text-primary-600-400">Upgrade</a>
			to unlock full reports.
		</p>
	</div>
{/if}

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-4">
	{#each Object.entries(mySdks.companies) as [companyName, sdks]}
		{#each Object.entries(sdks) as [sdkName, patterns]}
			<div class="col-span-1">
				<WhiteCard>
					{#snippet title()}
						<a class="text-sm font-semibold underline" href={`/sdks/appgoblin/${patterns.sdk_slug}`}
							>{companyName} - {sdkName}</a
						>
					{/snippet}
					<div class="p-4 text-xs">
						<form method="POST" action="?/emailExport" class="mb-3">
							<input type="hidden" name="sdk_id" value={patterns.sdk_id} />
							<button
								type="submit"
								disabled={!hasB2BSdkAccess}
								class="btn preset-tonal-primary flex items-center gap-2 text-sm"
							>
								<Mail size={14} /> Generate & Email Report
							</button>
						</form>
						{#if !hasB2BSdkAccess}
							<a href="/pricing" class="underline text-primary-600-400"
								>Upgrade to generate reports</a
							>
						{/if}
						{#if patterns && patterns.package_patterns.length > 0}
							<h4 class="font-medium uppercase tracking-wider mb-1">Package Patterns</h4>
							<ul class="list-disc list-inside space-y-0.5">
								{#each truncateList(patterns.package_patterns) as pattern}
									<li class="">
										<a href={`/sdks/${pattern.pattern}`} rel="nofollow">{pattern.pattern}</a>
										{#if pattern.app_count !== null}
											<span class="text-gray-500">({formatNumber(pattern.app_count)} apps)</span>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}

						{#if patterns && patterns.paths.length > 0}
							<h4 class="font-medium uppercase tracking-wider mt-3 mb-1">Path Patterns</h4>
							<ul class="list-disc list-inside space-y-0.5">
								{#each truncateList(patterns.paths) as path}
									<li>
										{path.pattern}
										{#if path.app_count !== null}
											<span class="text-gray-500">({formatNumber(path.app_count)} apps)</span>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}

						{#if patterns && patterns.mediation_patterns.length > 0}
							<h4 class="font-medium uppercase tracking-wider mt-3 mb-1">Mediation Patterns</h4>
							<ul class="list-disc list-inside space-y-0.5">
								{#each truncateList(patterns.mediation_patterns) as mediation}
									<li>
										{mediation.pattern}
										{#if mediation.app_count !== null}
											<span class="text-gray-500">({formatNumber(mediation.app_count)} apps)</span>
										{/if}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</WhiteCard>
			</div>
		{/each}
	{/each}

	<!-- Separate card for unique paths -->
	{#if uniquePaths.length > 0}
		<WhiteCard>
			{#snippet title()}
				<h3 class="text-sm font-semibold">Unique Path Patterns</h3>
			{/snippet}
			<div class="p-4 text-xs">
				<ul class="list-disc list-inside space-y-0.5">
					{#each truncateList(uniquePaths) as path}
						<li class="">{path}</li>
					{/each}
				</ul>
			</div>
		</WhiteCard>
	{/if}
</div>
