<script lang="ts">
	import ManifestItemList from '$lib/ManifestItemList.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	let { data }: { data: any } = $props();

	function sdkCountLabel(count: number): string {
		if (count === 0) return 'None';
		return `${count} SDK${count === 1 ? '' : 's'} detected`;
	}

	// One row per company type (name/label + number of companies detected),
	// plus any detected categories missing from the company types list.
	function buildSummaryRows(
		types: { name: string; url_slug: string }[],
		categories: Record<string, object>
	): { slug: string; name: string; count: number }[] {
		const cats = categories ?? {};
		const rows = types.map((t) => ({
			slug: t.url_slug,
			name: t.name,
			count: Object.keys(cats[t.url_slug] ?? {}).length
		}));
		for (const slug of Object.keys(cats)) {
			if (!rows.some((r) => r.slug === slug)) {
				rows.push({ slug, name: slug, count: Object.keys(cats[slug]).length });
			}
		}
		return rows;
	}
</script>

<div class="p-2 md:p-16 mt-2 md:mt-4">
	<section class="space-y-6">
		<h2 class="h1 md:h3 p-2">SDKs in {data.myapp.name || ''}</h2>

		{#if typeof data.myPackageInfo == 'string' || !data.myPackageInfo.company_categories}
			<p>Permissions, SDKs and trackers info not yet available for this app.</p>
		{:else}
			{#await data.companyTypes}
				Loading company types...
			{:then myCompanyTypes}
				{@const summaryRows = buildSummaryRows(
					myCompanyTypes.types,
					data.myPackageInfo.company_categories
				)}
				<WhiteCard>
					{#snippet title()}
						Summary
					{/snippet}
					<ul class="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 p-2 md:p-4">
						{#each summaryRows as row (row.slug)}
							<li class="text-sm md:text-base">
								{#if row.count > 0}
									<a href={`#cat-${row.slug}`} class="anchor"
										>{row.name}: {sdkCountLabel(row.count)}</a
									>
								{:else}
									<span class="opacity-75">{row.name}: {sdkCountLabel(row.count)}</span>
								{/if}
							</li>
						{/each}
					</ul>
				</WhiteCard>
				<section class="grid grid-cols-1 gap-4">
					{#each summaryRows.filter((r) => r.count > 0) as row (row.slug)}
						<div id={`cat-${row.slug}`} class="scroll-mt-24">
							<h3 class="h3">{row.name}</h3>
							<div class="p-2 lg:p-4">
								<ManifestItemList
									items={data.myPackageInfo.company_categories[row.slug]}
									companyDetails={data.myPackageInfo.company_details}
								></ManifestItemList>
							</div>
						</div>
					{/each}
				</section>
			{/await}
		{/if}
	</section>
</div>
