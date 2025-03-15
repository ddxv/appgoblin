<script lang="ts">
	import WhiteCard from '$lib/WhiteCard.svelte';
	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';
	import CompanyButton from '$lib/CompanyButton.svelte';

	import { Accordion } from '@skeletonlabs/skeleton-svelte';

	import StoreIcon from './StoreIcon.svelte';

	let accordionValue = $state(['allclosed']);
	const androidNameFont = 'text-xs md:text-sm px-8 md:px-16';

	import type { DeveloperSDKResponse, CompanyTypes } from '../types';

	interface Props {
		myPackageInfo: DeveloperSDKResponse['devSDKs'];
		companyTypes: CompanyTypes;
	}

	let { myPackageInfo, companyTypes }: Props = $props();

	let crawled_store_ids = $derived(myPackageInfo.success_store_ids.length);
	let failed_store_ids = $derived(myPackageInfo.failed_store_ids.length);
</script>

<p class="p-4">
	These are the SDKs that the developer has used in their apps which have been detected by our
	scrapers. Only tagged companies are included, each app may have additional untagged SDKs.
</p>

{#await myPackageInfo}
	Loading permissions and tracker data...
{:then packageInfo}
	{#if typeof packageInfo == 'string'}
		<p>
			Permissions, SDKs and trackers info not yet available for these apps. You can request scans
			for the apps on the app pages.
		</p>
	{:else if packageInfo.sdks && Object.keys(packageInfo.sdks).length > 0}
		{#await companyTypes}
			Loading company types...
		{:then myCompanyTypes}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each Object.keys(packageInfo.sdks) as category}
					<WhiteCard>
						{#snippet title()}
							{myCompanyTypes.types.find((x: { url_slug: string }) => x.url_slug === category)
								?.name || category}
						{/snippet}
						<div class="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
							{#each packageInfo.sdks[category] as company}
								<div class="border border-primary-900 rounded-md p-2 grid grid-flow-col">
									<CompanyButton
										companyName={company.company_name}
										companyDomain={company.company_domain}
									/>
									<Accordion
										value={accordionValue}
										onValueChange={(e) => (accordionValue = e.value)}
										multiple
									>
										<Accordion.Item value={company.company_domain}>
											<!-- Control -->
											{#snippet control()}
												<div class="grid grid-cols-2 gap-1 md:gap-2">
													<p class="text-xs md:text-sm">
														Apps: {company.count} / {crawled_store_ids}
													</p>
												</div>
											{/snippet}

											<!-- Panel -->
											{#snippet panel()}
												<ul>
													{#each company.apps as app}
														<li>
															<a href={`/apps/${app.store_id}`} class={androidNameFont}>
																<span class="inline-flex gap-1 md:gap-2">
																	<StoreIcon store={app.store} />
																	{app.app_name}
																</span>
															</a>
														</li>
													{/each}
												</ul>
											{/snippet}
										</Accordion.Item>
									</Accordion>
								</div>
							{/each}
						</div>
					</WhiteCard>
				{/each}
			</div>
		{/await}
	{:else}
		<p>App not yet scanned for SDKs.</p>
		<RequestSDKScanButton />
	{/if}
{/await}
