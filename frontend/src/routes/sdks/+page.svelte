<script lang="ts">
	import SDKsOverviewTable from '$lib/SDKsOverviewTable.svelte';
	import SDKsLatestAppsTable from '$lib/SDKsLatestAppsTable.svelte';
	import WhiteCard from '$lib/WhiteCard.svelte';

	let { data } = $props();
</script>

<h1 class="text-2xl font-bold text-primary-900-100">SDKs</h1>

<div class="my-6">
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
</div>

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

		<WhiteCard>
			{#snippet title()}
				User Requested Apps
			{/snippet}

			{#if mySdksOverview.user_requested_latest_apps && mySdksOverview.user_requested_latest_apps.length > 0}
				<SDKsLatestAppsTable entries_table={mySdksOverview.user_requested_latest_apps} />
			{/if}
		</WhiteCard>

		<WhiteCard>
			{#snippet title()}
				Android SDKs
			{/snippet}

			{#if mySdksOverview.android_sdkparts && mySdksOverview.android_sdkparts.length > 0}
				<SDKsOverviewTable entries_table={mySdksOverview.android_sdkparts} />
			{/if}
		</WhiteCard>

		<WhiteCard>
			{#snippet title()}
				iOS SDKs
			{/snippet}

			{#if mySdksOverview.ios_sdkparts && mySdksOverview.ios_sdkparts.length > 0}
				<SDKsOverviewTable entries_table={mySdksOverview.ios_sdkparts} />
			{/if}
		</WhiteCard>
	{/await}
</div>
