<script lang="ts">
	import type { DeveloperResponse } from '../../../types';
	import AppsCard from '$lib/AppGroupCard.svelte';
	import ExternalLink from '$lib/ExternalLink.svelte';
	import DeveloperAppsTable from '$lib/DeveloperAppsTable.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';
	import IconGoogle from '$lib/svg/IconGoogle.svelte';
	import IconiOS from '$lib/svg/IconiOS.svelte';

	interface Props {
		data: DeveloperResponse;
	}

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
				<!-- Apps by Developer ID (Full Width - Only one platform will have data) -->
				{#if devs.google && devs.google.apps.apps.length > 0}
					<section class="mb-8">
						<h2 class="h2 p-2 md:my-4 my-8 flex items-center gap-2">
							<IconGoogle size="32" /> Google Play Developer
						</h2>
						<p class="p-2">
							<strong>{devs.google.developer_name}</strong>
							<br />
							App Count: {devs.google.apps.apps.length}
							<br />
							{#if devs.google.developer_url}
								Developer URL: <ExternalLink domain={devs.google.developer_url} />
							{:else}
								Developer URL: None
							{/if}
						</p>
						<div class="mb-6">
							<AppsCard
								apps={{
									apps: devs.google.apps.apps.slice(0, 10),
									title: `All apps from developer ID: ${devs.google.developer_name}`
								}}
							/>
						</div>
						{#if devs.google.apps.apps.length > 10}
							<div class="mt-4">
								<DeveloperAppsTable data={devs.google.apps.apps} isiOS={false} />
							</div>
						{/if}
					</section>
				{/if}

				{#if devs.apple && devs.apple.apps.apps.length > 0}
					<section class="mb-8">
						<h2 class="h2 p-2 md:my-4 my-8 flex items-center gap-2">
							<IconiOS size="32" /> Apple iOS Developer
						</h2>
						<p class="p-2">
							<strong>{devs.apple.developer_name}</strong>
							<br />
							Matched Developer ID:
							<a href={`/developers/${devs.apple.developer_id}`}>{devs.apple.developer_id}</a>
							<br />
							App Count: {devs.apple.apps.apps.length}
							<br />
							{#if devs.apple.developer_url}
								Developer URL: <ExternalLink domain={devs.apple.developer_url} />
							{:else}
								Developer URL: None
							{/if}
						</p>
						<div class="mb-6">
							<AppsCard
								apps={{
									apps: devs.apple.apps.apps.slice(0, 10),
									title: `All apps from developer ID: ${devs.apple.developer_name}`
								}}
							/>
						</div>
						{#if devs.apple.apps.apps.length > 10}
							<div class="mt-4">
								<DeveloperAppsTable data={devs.apple.apps.apps} isiOS={true} />
							</div>
						{/if}
					</section>
				{/if}

				<!-- Apps Matched by Domain (Two Columns - May have both platforms) -->
				{#if (devs.google && devs.google.apps_by_url.apps.length > 0) || (devs.apple && devs.apple.apps_by_url.apps.length > 0)}
					<div class="mb-8">
						<h2 class="h2 p-2 md:my-4 my-8">Apps Matched by Domain (Possibly Related)</h2>
						<p>
							There are {devs.google.apps_by_url.apps.length + devs.apple.apps_by_url.apps.length} apps
							that are possibly related via the developer's domain ({devs.google.pub_domain_url ||
								devs.apple.pub_domain_url ||
								'no domain found'}). These may be developer apps on other App Stores or App Store
							Developers. For social networks like FB/TikTok/X there may be unrelated apps using
							their social pages as their official domain.
						</p>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<!-- Android/Google Domain Matches -->
							<div>
								{#if devs.google && devs.google.apps_by_url.apps.length > 0}
									<div class="flex items-center gap-2 mb-4">
										<IconGoogle size="24" /> <span class="text-lg font-semibold">Android Apps</span>
									</div>
									<AppsCard
										apps={{
											apps: devs.google.apps_by_url.apps.slice(0, 10),
											title: ``
										}}
									/>
									{#if devs.google.apps_by_url.apps.length > 10}
										<div class="mt-4">
											<DeveloperAppsTable data={devs.google.apps_by_url.apps} isiOS={false} />
										</div>
									{/if}
								{/if}
							</div>

							<!-- iOS/Apple Domain Matches -->
							<div>
								{#if devs.apple && devs.apple.apps_by_url.apps.length > 0}
									<div class="flex items-center gap-2 mb-4">
										<IconiOS size="24" /> <span class="text-lg font-semibold">iOS Apps</span>
									</div>
									<AppsCard
										apps={{
											apps: devs.apple.apps_by_url.apps.slice(0, 10),
											title: ``
										}}
									/>
									{#if devs.apple.apps_by_url.apps.length > 10}
										<div class="mt-4">
											<DeveloperAppsTable data={devs.apple.apps_by_url.apps} isiOS={true} />
										</div>
									{/if}
								{/if}
							</div>
						</div>
					</div>
				{/if}
			{/if}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
	</div>
</Tabs.Panel>
