<script lang="ts">
	import type { DeveloperResponse } from '../../../types';
	import AppsCard from '$lib/AppGroupCard.svelte';
	import ExternalLink from '$lib/ExternalLink.svelte';
	interface Props {
		data: DeveloperResponse;
	}

	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	import CompanyOverviewTable from '$lib/CompanyOverviewTable.svelte';

	let { data }: Props = $props();
</script>

<Tabs.Panel value="apps">
	<div>
		{#await data.devs}
			<div>
				<span>Loading...</span>
			</div>
		{:then devs}
			{#if typeof devs == 'string'}
				Failed to load developer
			{:else}
				{#if devs.google && devs.google.apps.apps.length > 0}
					<h2 class="h2 p-2 md:my-4 my-8">
						Google Play Developer: {devs.google.developer_name}
					</h2>
					<p class="p-2">
						Developer ID: <a href={`/developers/${devs.google.developer_id}`}
							>{devs.google.developer_id}</a
						>
						<br />
						App Count: {devs.google.apps.apps.length}
						<br />
						{#if devs.google.developer_url}
							Developer URL:<ExternalLink domain={devs.google.developer_url} />
						{:else}
							Developer URL: None
						{/if}
					</p>

					<AppsCard
						apps={{
							apps: devs.google.apps.apps.slice(0, 10),
							title: `${devs.google.developer_name} Top Android Apps`
						}}
					/>
					{#if devs.google.apps.apps.length > 10}
						<h2 class="h2 p-2">Google Apps: {devs.google.developer_name} All Apps</h2>
						<CompanyOverviewTable entries_table={devs.google.apps.apps} />
					{/if}
				{:else}
					<p class="p-2">No apps found for Google Play developer or matched developer URLs.</p>
				{/if}
				<hr />
				{#if devs.apple && devs.apple.apps.apps.length > 0}
					<h2 class="h2 p-2 md:my-4 my-8">
						Apple iOS Developer: {devs.apple.developer_name}
					</h2>
					<p class="p-2">
						Matched Developer ID: <a href={`/developers/${devs.apple.developer_id}`}
							>{devs.apple.developer_id}</a
						>
						<br />
						App Count: {devs.apple.apps.apps.length}
						<br />
						{#if devs.apple.developer_url}
							Developer URL:<ExternalLink domain={devs.apple.developer_url} />
						{:else}
							Developer URL: None
						{/if}
					</p>
					<AppsCard
						apps={{
							apps: devs.apple.apps.apps.slice(0, 10),
							title: `${devs.apple.developer_name} Top iOS Apps`
						}}
					/>
					{#if devs.apple.apps.apps.length > 10}
						<h2 class="h2 p-2">Apple Apps: {devs.apple.developer_name} All Apps</h2>
						<CompanyOverviewTable entries_table={devs.apple.apps.apps} />
					{/if}
				{:else}
					<p class="p-2">No apps found for Apple developer or matched developer URLs.</p>
				{/if}
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</Tabs.Panel>
