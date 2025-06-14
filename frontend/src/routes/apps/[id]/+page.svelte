<script lang="ts">
	import ExternalLinkSvg from '$lib/svg/ExternalLinkSVG.svelte';
	import RequestSDKScanButton from '$lib/RequestSDKScanButton.svelte';
	import type { AppFullDetails } from '../../../types';
	import WhiteCard from '$lib/WhiteCard.svelte';
	import AppSDKOverview from '$lib/AppSDKOverview.svelte';

	interface Props {
		data: AppFullDetails;
	}
	let { data }: Props = $props();
	let sum = (arr: number[]) => arr.reduce((acc, curr) => acc + curr, 0);
</script>

<section class="grid grid-flow-cols-1 md:grid-cols-2 md:gap-4 p-2">
	<!-- Column1: App Icon Title & Info -->
	<div class="card preset-filled-surface-100-900 p-0 lg:p-8">
		<div class="card-footer md:flex">
			{#await data.myapp}
				Loading app details...
			{:then myapp}
				<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
					<!-- Developer Information Section -->
					<WhiteCard>
						{#snippet title()}
							SDKs, Trackers & Permissions
						{/snippet}
						{#await data.appSDKsOverview}
							Loading SDKs...
						{:then mySDKs}
							<AppSDKOverview myPackageInfo={mySDKs} companyTypes={data.companyTypes} {myapp} />
						{/await}
					</WhiteCard>
					<!-- Developer Information Section -->
					<WhiteCard>
						{#snippet title()}
							App Details
						{/snippet}
						<div class="space-y-2 p-2">
							<div class="flex items-center gap-2">
								<span class="font-medium">Store ID:</span>
								<span class="text-primary-900-100">{myapp.store_id}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="font-medium">First Released:</span>
								<span class="text-primary-900-100">{myapp.release_date}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="font-medium">Store Last Updated:</span>
								<span class="text-primary-900-100">{myapp.store_last_updated}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="font-medium">In-App Purchases:</span>
								<span class="text-primary-900-100">{myapp.in_app_purchases ? 'Yes' : 'No'}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="font-medium">Ads:</span>
								<span class="text-primary-900-100">{myapp.ad_supported ? 'Yes' : 'No'}</span>
							</div>

							{#if myapp.developer_url}
								<div class="flex items-center gap-2">
									<span class="font-medium">Website:</span>
									<a
										href="https://{myapp.developer_url}"
										target="_blank"
										class="anchor inline-flex"
									>
										{myapp.developer_url}
										<ExternalLinkSvg />
									</a>
								</div>
							{/if}
						</div>
					</WhiteCard>

					<!-- App Information Section -->
					<WhiteCard>
						{#snippet title()}
							App Store
						{/snippet}
						<div class="space-y-2 p-2">
							<div class="flex items-center gap-2">
								<span class="font-medium">Crawl Status:</span>
								<span
									class={myapp.crawl_result == 1 ? 'text-success-900-100' : 'text-error-900-100'}
								>
									{myapp.crawl_result == 1 ? 'Success' : 'Failed'}
								</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="font-medium">Store First Crawled:</span>
								<span class="text-primary-900-100">{myapp.created_at}</span>
							</div>
							<div class="flex items-center gap-2">
								<span class="font-medium">Store Last Crawled:</span>
								<span class="text-primary-900-100">{myapp.updated_at}</span>
							</div>
						</div>
					</WhiteCard>

					<!-- Tracking Information Section -->
					<WhiteCard>
						{#snippet title()}
							Ads & App-Ads.txt
						{/snippet}
						{#if myapp.ad_supported || myapp.adstxt_crawl_result == 1}
							{#if myapp.adstxt_last_crawled}
								<div class="space-y-2 p-2">
									<div class="flex items-center gap-2">
										<span class="font-medium">Ads.txt Last Crawled:</span>
										<span class="text-primary-900-100">{myapp.adstxt_last_crawled}</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="font-medium">Ads.txt Crawl Status:</span>
										<span
											class={myapp.adstxt_crawl_result == 1
												? 'text-success-900-100'
												: 'text-error-900-100'}
										>
											{myapp.adstxt_crawl_result == 1 ? 'Success' : 'Failed'}
										</span>
									</div>
								</div>
							{:else}
								App not yet analyzed for ads.
							{/if}
						{:else}
							App does not have ads.
						{/if}
					</WhiteCard>
					<WhiteCard>
						{#snippet title()}
							SDK Tracking Status
						{/snippet}
						<div class="space-y-2 p-2">
							{#if myapp.sdk_last_crawled}
								<div class="flex items-center gap-2">
									<span class="font-medium">Successful Last Crawled:</span>
									<span class="text-primary-900-100">{myapp.sdk_successful_last_crawled}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="font-medium">Last Crawled:</span>
									<span class="text-primary-900-100">{myapp.sdk_last_crawled}</span>
								</div>
								<div class="flex items-center gap-2">
									<span class="font-medium">Last Crawl Status:</span>
									<span
										class={myapp.sdk_last_crawl_result == 1
											? 'text-success-900-100'
											: 'text-error-900-100'}
									>
										{myapp.sdk_last_crawl_result == 1 ? 'Success' : 'Failed'}
									</span>
								</div>
							{:else}
								App not yet analyzed for SDKs.
								<RequestSDKScanButton />
							{/if}
						</div>
					</WhiteCard>
				</div>
			{/await}
		</div>
		<br />
		<div class="p-2 md:flex">
			{#await data.myapp}
				Loading app rating details...
			{:then myapp}
				<div class="self-center text-center">
					<p class="text-4xl p-2 text-primary-800-200">{myapp.rating}★</p>
					<p class="text-primary-900-100">Ratings: {myapp.rating_count}</p>
				</div>
			{/await}
			<div class="flex-1">
				{#await data.myhistory}
					Loading rating details...
				{:then histdata}
					{#if histdata.histogram}
						{#each [...histdata.histogram].reverse() as count, index}
							<div class="flex bar-spacer">
								<span class="label">{histdata.histogram.length - index}★</span>
								<div class="bar-container bg-surface-100-900 grow">
									<div
										class="bar bg-primary-100-900"
										style="width: {(count / sum(histdata.histogram)) * 100}%"
										title="{index + 1} star: {count} ratings"
									></div>
								</div>
							</div>
						{/each}
					{:else}
						<p>No rating data available for this app.</p>
					{/if}
				{/await}
			</div>
		</div>
	</div>

	<!-- Column2: App Pictures -->
	<div class="card preset-filled-surface-100-900 p-2 md:p-8">
		<div class="card preset-tonal p-2 md:p-8 mt-2 md:mt-4">
			<h4 class="h4 md:h3 p-2">Screenshots</h4>
			{#await data.myapp then myapp}
				{#if myapp.featured_image_url}
					<div>
						<img
							class="h-auto max-w-full rounded-lg p-4 mx-auto"
							src={myapp.featured_image_url}
							alt=""
						/>
					</div>
				{/if}
				<section class="grid grid-cols-2 md:grid-cols-3 gap-4">
					{#each [myapp.phone_image_url_1, myapp.phone_image_url_2, myapp.phone_image_url_3, myapp.tablet_image_url_1, myapp.tablet_image_url_2, myapp.tablet_image_url_3] as imageUrl}
						{#if imageUrl && imageUrl != 'null'}
							<div>
								<img class="h-auto max-w-full rounded-lg" src={imageUrl} alt="" />
							</div>
						{/if}
					{/each}
				</section>
				<section class="">
					<h4 class="h4 md:h3 p-2">App Description</h4>
					<div>
						<p class="text-strong">{myapp.description_short}</p>
					</div>
					<div>
						<p>{@html myapp.description?.replace(/\r?\n/g, '<br>')}</p>
					</div>
				</section>
			{/await}
		</div>
	</div>
</section>

<style>
	.bar-spacer {
		margin: 10px;
	}

	.label {
		max-width: 20px;
	}

	.bar-container {
		align-self: center;
		align-items: center;
		border-radius: 5px; /* Rounded corners */
		margin-left: 5px;
		padding: 0px;
	}

	.bar {
		height: 20px; /* Fixed height for each bar */
		border-radius: 5px; /* Rounded corners */
	}
</style>
