<script lang="ts">
	import type { DeveloperSDKResponse } from '../../../../types';

	import CompanyButton from '$lib/CompanyButton.svelte';

	interface Props {
		data: DeveloperSDKResponse;
	}

	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let { data }: Props = $props();
</script>

<Tabs.Panel value="sdks">
	<h2 class="text-2xl font-bold text-primary-900-100">SDKs</h2>
	<p class="text-sm md:text-base p-2 md:p-4">Developers SDKS</p>

	<div>
		{#await data.devSDKs}
			<div>
				<span>Loading...</span>
			</div>
		{:then sdks}
			{#if typeof sdks == 'string'}
				Failed to load sdks
			{:else}
				{console.log('sdks', sdks)}
				<table class="table">
					<thead>
						<tr>
							<th>Store ID</th>
							<th>Category Slug</th>
							<th>Company</th>
						</tr>
					</thead>
					<tbody>
						{#each sdks.sdks as sdk}
							<tr>
								<td>{sdk.store_id}</td>
								<td>{sdk.category_slug}</td>
								<td>
									<CompanyButton companyName={sdk.company_name} companyDomain={sdk.company_domain}
									></CompanyButton>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</Tabs.Panel>
