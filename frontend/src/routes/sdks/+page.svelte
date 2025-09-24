<script lang="ts">
	import SDKsOverviewTable from '$lib/SDKsOverviewTable.svelte';
	import SDKsLatestAppsTable from '$lib/SDKsLatestAppsTable.svelte';
	import SDKsUserRequestAppsTable from '$lib/SDKsUserRequestAppsTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import SDKOverview from '$lib/utils/SDKOverview.svelte';
	import { Tabs } from '@skeletonlabs/skeleton-svelte';

	let group = $state('user_requested');

	let { data } = $props();
</script>

<div class="mx-2 md:mx-16">
	<h1 class="text-2xl font-bold text-primary-900-100">Free Mobile App SDK Scanning</h1>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
		<WhiteCard>
			{#snippet title()}
				SDKs Overview
			{/snippet}
			<p class="text-sm md:text-base p-2 md:p-4">
				AppGoblin provides free SDK and API scanning to detect mobile app SDKs, trackers and
				permissions. Users can request apps to be SDK and API scanned for free on AppGoblin.
			</p>
		</WhiteCard>
		<SDKOverview {data} />
	</div>

	<div>
		<Tabs value={group} onValueChange={(e) => (group = e.value)}>
			{#snippet list()}
				<Tabs.Control value="user_requested" labelClasses="p-0 md:p-8"
					><p class="text-xs md:text-base">User Requests</p></Tabs.Control
				>
				<Tabs.Control value="latest_success" labelClasses="p-0 md:p-8"
					><p class="text-xs md:text-base">Latest Success</p></Tabs.Control
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
						Users can request apps to be SDK and API scanned for free on AppGoblin. User requested
						app SDK scans are automated and usually happen quickly (~1hr). The results will
						aggregate to the dashboard in about a day. If you see that your request failed, please
						reach out on Discord/Email as manual processing may be needed.
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
</div>
