<script lang="ts">
	import SDKsOverviewTable from '$lib/SDKsOverviewTable.svelte';
	import SDKsLatestAppsTable from '$lib/SDKsLatestAppsTable.svelte';
	import SDKsUserRequestAppsTable from '$lib/SDKsUserRequestAppsTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import SDKOverview from '$lib/utils/SDKOverview.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let group = $state('latest_success');

	let { data } = $props();
</script>

<h1 class="text-2xl font-bold text-primary-900-100">SDKs</h1>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
	<WhiteCard>
		{#snippet title()}
			SDKs Overview
		{/snippet}
		<p class="text-sm md:text-base p-2 md:p-4">
			These are the top SDK parts found from Android Manifests, Info.plist, directories and files.
			There is also a lot of other things mixed in, and much has yet to be tagged. If you see
			anything you'd like to tag please reach out on Discord to help contribute.
		</p>
	</WhiteCard>
	<SDKOverview {data} />
</div>

<div>
	<Tabs value={group} onValueChange={(e) => (group = e.value)}>
		{#snippet list()}
			<Tabs.Control value="latest_success" labelClasses="p-0 md:p-8"
				><p class="text-xs md:text-base">Latest Success</p></Tabs.Control
			>
			<Tabs.Control value="user_requested" labelClasses="p-0 md:p-8"
				><p class="text-xs md:text-base">User Requests</p></Tabs.Control
			>
			<Tabs.Control value="latest_failed" labelClasses="p-0 md:p-8"
				><p class="text-xs md:text-base">Latest Failed</p></Tabs.Control
			>
			<Tabs.Control value="sdkparts" labelClasses="p-0 md:p-8"
				><p class="text-xs md:text-base">Raw SDKs Parts</p></Tabs.Control
			>
		{/snippet}

		{#snippet content()}
			<Tabs.Panel value="user_requested">
				<h2 class="text-2xl font-bold text-primary-900-100">User Requested App Scans</h2>
				<p class="text-sm md:text-base p-2 md:p-4">
					While scans can happen quickly (~1hr), the results will not aggregate to the dashboard for
					~24hrs. If you see that you
				</p>
				{#await data.sdksUserRequested}
					loading
				{:then mySdksUserRequested}
					<WhiteCard>
						{#snippet title()}
							User Requests
						{/snippet}

						{#if mySdksUserRequested.user_requested_latest_apps && mySdksUserRequested.user_requested_latest_apps.length > 0}
							<SDKsUserRequestAppsTable
								entries_table={mySdksUserRequested.user_requested_latest_apps}
							/>
						{/if}
					</WhiteCard>
				{/await}
			</Tabs.Panel>
			<Tabs.Panel value="latest_success">
				<h2 class="text-2xl font-bold text-primary-900-100">Latest Successfully Crawled Apps</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
					{#await data.sdksOverview}
						loading
					{:then mySdksOverview}
						<WhiteCard>
							{#snippet title()}
								Android Successfully Crawled Apps
							{/snippet}

							{#if mySdksOverview.android_success_latest_apps && mySdksOverview.android_success_latest_apps.length > 0}
								<SDKsLatestAppsTable entries_table={mySdksOverview.android_success_latest_apps} />
							{/if}
						</WhiteCard>

						<WhiteCard>
							{#snippet title()}
								iOS Apps SDKs
							{/snippet}

							{#if mySdksOverview.ios_success_latest_apps && mySdksOverview.ios_success_latest_apps.length > 0}
								<SDKsLatestAppsTable entries_table={mySdksOverview.ios_success_latest_apps} />
							{/if}
						</WhiteCard>
					{/await}
				</div></Tabs.Panel
			>
			<Tabs.Panel value="latest_failed">
				<h2 class="text-2xl font-bold text-primary-900-100">Latest Failed to Crawled Apps</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
					{#await data.sdksOverview}
						loading
					{:then mySdksOverview}
						<WhiteCard>
							{#snippet title()}
								Android Failed to Crawled Apps
							{/snippet}

							{#if mySdksOverview.android_failed_latest_apps && mySdksOverview.android_failed_latest_apps.length > 0}
								<SDKsLatestAppsTable entries_table={mySdksOverview.android_failed_latest_apps} />
							{/if}
						</WhiteCard>

						<WhiteCard>
							{#snippet title()}
								iOS Failed to Crawled Apps
							{/snippet}

							{#if mySdksOverview.ios_failed_latest_apps && mySdksOverview.ios_failed_latest_apps.length > 0}
								<SDKsLatestAppsTable entries_table={mySdksOverview.ios_failed_latest_apps} />
							{/if}
						</WhiteCard>
					{/await}
				</div>
			</Tabs.Panel>

			<Tabs.Panel value="sdkparts">
				<h2 class="text-2xl font-bold text-primary-900-100">SDKs Parts</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
					{#await data.sdksParts}
						loading
					{:then mySdksParts}
						<WhiteCard>
							{#snippet title()}
								Android SDKs
							{/snippet}

							{#if mySdksParts.android_sdkparts && mySdksParts.android_sdkparts.length > 0}
								<SDKsOverviewTable entries_table={mySdksParts.android_sdkparts} />
							{/if}
						</WhiteCard>

						<WhiteCard>
							{#snippet title()}
								iOS SDKs
							{/snippet}

							{#if mySdksParts.ios_sdkparts && mySdksParts.ios_sdkparts.length > 0}
								<SDKsOverviewTable entries_table={mySdksParts.ios_sdkparts} />
							{/if}
						</WhiteCard>
					{/await}
				</div>
			</Tabs.Panel>
		{/snippet}
	</Tabs>
</div>
