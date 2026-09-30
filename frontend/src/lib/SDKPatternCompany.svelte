<script lang="ts">
	import WhiteCard from './WhiteCard.svelte';
	import CompanyButton from './CompanyButton.svelte';
	import { formatNumber } from '$lib/utils/formatNumber';
	import type { SdkPatternCompany } from '../types';

	let { matches }: { matches: SdkPatternCompany[] } = $props();

	const company = $derived(matches[0]);
	const groupedPatterns = $derived(
		matches.reduce<Record<string, SdkPatternCompany[]>>((groups, match) => {
			(groups[match.pattern_type] ??= []).push(match);
			return groups;
		}, {})
	);

	function patternTitle(patternType: string) {
		return patternType
			.replaceAll('_', ' ')
			.replace(/\b\w/g, (character) => character.toUpperCase());
	}
</script>

<WhiteCard>
	{#snippet title()}
		<span class="text-sm font-semibold">Matching Company</span>
	{/snippet}
	<div class="p-4 text-xs">
		<div class="flex flex-wrap items-center gap-2 mb-4">
			<CompanyButton
				companyName={company.company_name}
				companyDomain={company.company_domain}
				companyLogoUrl={company.company_logo_url ?? undefined}
				size="lg"
			/>
			{#if company.sdk_name}
				<span class="text-sm text-gray-500">{company.sdk_name}</span>
			{/if}
		</div>

		{#if company.parent_company_name}
			<p class="mb-3 text-gray-500">
				Parent company: {company.parent_company_name}
				{#if company.parent_company_domain}({company.parent_company_domain}){/if}
			</p>
		{/if}

		{#each Object.entries(groupedPatterns) as [patternType, patterns]}
			<h4 class="font-medium uppercase tracking-wider mb-1 mt-3">{patternTitle(patternType)}</h4>
			<ul class="list-disc list-inside space-y-0.5">
				{#each patterns as pattern}
					<li>
						<a href={`/sdks/${pattern.pattern_value}`} rel="nofollow">{pattern.pattern_value}</a>
						{#if pattern.app_count !== null}
							<span class="text-gray-500">({formatNumber(pattern.app_count)} apps)</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/each}
	</div>
</WhiteCard>
