<script lang="ts">
	import { page } from '$app/state';
	import RatingInstallsLarge from '$lib/RatingInstallsLarge.svelte';
	import StarsRating from '$lib/StarsRating.svelte';
	import type { CompanyTypes, AppFullDetail, CatData } from '../../../types';
	let {
		data,
		children
	}: {
		data: {
			myapp: AppFullDetail;
			companyTypes: CompanyTypes;
			appCats: CatData;
		};
		children: any;
	} = $props();

	import AvailableOniOs from '$lib/svg/AvailableOniOS.svelte';

	import AppTabs from '$lib/utils/AppTabs.svelte';

	function isAndroid() {
		return !/^\d+$/.test(page.params.id);
	}

	let isAndroidApp = $derived(isAndroid());

	function getCategoryName(category: string) {
		if (category) {
			return (
				data?.appCats?.categories?.find((cat: { id: string }) => cat.id == category)?.name ||
				category
			);
		}
		return '';
	}
</script>

<svelte:head>
	<link rel="canonical" href="https://appgoblin.info/apps/{page.params.id}" />
	{#await data.myapp then myapp}
		{#if myapp.store_link.includes('google')}
			<title>{myapp.name} Android Trends | {myapp.developer_name} | AppGoblin App Data</title>
			<meta
				name="description"
				content="Explore {myapp.name} Android app's analytics and market trends on Google Play with AppGoblin. Developed by {myapp.developer_name} (ID: {myapp.developer_id}) in {getCategoryName(
					myapp.category
				)} category. Check out detailed app statistics, rankings, and more."
			/>
			<meta
				name="keywords"
				content="{myapp.name}, {myapp.developer_name}, {myapp.developer_id}, {getCategoryName(
					myapp.category
				)}, analytics, ads, market data, Android app rankings, app reviews, download statistics, Google Play data, app comparison, mobile app insights, Android"
			/>
			<meta
				property="og:title"
				content="{myapp.name} Android App Stats & Info - AppGoblin | {myapp.developer_name}"
			/>
			<meta
				property="og:description"
				content="Explore {myapp.name} Android app analytics and market trends on Google Play with AppGoblin. {myapp.name} by {myapp.developer_name} (ID: {myapp.developer_id}). Dive into detailed app rankings and download statistics to inform your Android app strategy and discover top-performing apps."
			/>
			<meta
				name="twitter:title"
				content="{myapp.name} Android | {myapp.developer_name} | App Stats & Info - AppGoblin"
			/>
			<meta
				name="twitter:description"
				content="Explore {myapp.name} Android app analytics and market trends on Google Play with AppGoblin. {myapp.name} by {myapp.developer_name} (ID: {myapp.developer_id}). Dive into detailed app rankings and download statistics to inform your Android app strategy and discover top-performing apps."
			/>
		{:else}
			<title>{myapp.name} iOS Trends | {myapp.developer_name} | AppGoblin App Data</title>
			<meta
				name="description"
				content="Explore {myapp.name} iOS app's analytics and market trends on the App Store with AppGoblin. Developed by {myapp.developer_name} (ID: {myapp.developer_id}). Dive into detailed app rankings and download statistics to inform your iOS app strategy and discover top-performing apps."
			/>
			<meta
				name="keywords"
				content="{myapp.name}, {myapp.developer_name}, {myapp.developer_id}, {myapp.category} analytics, market data, iOS app rankings, app reviews, download statistics, App Store data, app comparison, mobile app insights, iOS"
			/>
			<meta
				property="og:title"
				content="{myapp.name} iOS | {myapp.developer_name} | App Stats & Info - AppGoblin"
			/>
			<meta
				property="og:description"
				content="Explore {myapp.name} iOS app analytics and market trends on the App Store with AppGoblin. {myapp.name} by {myapp.developer_name} (ID: {myapp.developer_id}). Dive into detailed app rankings and download statistics to inform your iOS app strategy and discover top-performing apps."
			/>
			<meta
				name="twitter:title"
				content="{myapp.name} iOS | {myapp.developer_name} | App Stats & Info - AppGoblin "
			/>
			<meta
				name="twitter:description"
				content="Explore {myapp.name} iOS app analytics and market trends on the App Store with AppGoblin. {myapp.name} by {myapp.developer_name} (ID: {myapp.developer_id}). Dive into detailed app rankings and download statistics to inform your iOS app strategy and discover top-performing apps."
			/>
		{/if}
		<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
		<meta property="og:url" content={page.url.href} />
		<meta property="og:type" content="website" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
		<meta name="robots" content="index, follow" />
	{/await}
</svelte:head>

<div class="card-header px-4 md:px-8">
	{#await data.myapp}
		<div class="animate-pulse flex space-x-4">
			<div class="rounded-full bg-primary-100-900/20 h-12 w-12"></div>
			<div class="flex-1 space-y-4 py-1">
				<div class="h-4 bg-primary-100-900/20 rounded w-3/4"></div>
				<div class="space-y-3">
					<div class="h-4 bg-primary-100-900/20 rounded"></div>
				</div>
			</div>
		</div>
	{:then myapp}
		<h1 class="text-primary-900-100 text-3xl font-bold mb-4">{myapp.name}</h1>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
			<!-- COL 1  -->
			<div class="grid grid-cols-3 gap-0">
				<div class="col-span-1">
					{#if myapp.icon_url_512}
						<img
							src={myapp.icon_url_512}
							alt={myapp.name}
							class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-60 xl:h-60"
							referrerpolicy="no-referrer"
						/>
					{/if}
					<!-- Ratings: STARS (123) -->
					<div class="md:hidden">
						<StarsRating total={5} size={20} rating={myapp.rating} />
					</div>
					<div class="hidden md:inline-flex">
						<StarsRating total={5} size={40} rating={myapp.rating} />
					</div>
				</div>

				<div class="space-y-2 md:space-y-4 col-span-2">
					<div class="flex items-center justify-center">
						<a
							href={myapp.store_link}
							target="_blank"
							class="anchor inline-flex items-center hover:scale-105 transition-transform"
						>
							{#if myapp.store_link.includes('google')}
								<img
									class="w-32 md:w-48 md:w-64"
									src="/gp_en_badge_web_generic.png"
									alt={myapp.name}
								/>
							{:else}
								<AvailableOniOs size={180} />
							{/if}
						</a>
					</div>
					{#if myapp.developer_id}
						<a href="/developers/{myapp.developer_id}" class="block">
							<div class="btn preset-tonal hover:preset-tonal-primary w-full">
								<span class="flex items-center gap-1 md:gap-2 text-sm md:text-base">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
									</svg>
									Developer: {myapp.developer_name || myapp.developer_id}
								</span>
							</div>
						</a>
					{/if}

					<a href="/categories/{myapp.category}" class="block">
						<div class="btn preset-tonal hover:preset-tonal-primary w-full">
							<span class="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"
									/>
								</svg>
								Category: {getCategoryName(myapp.category)}
							</span>
						</div>
					</a>
				</div>
			</div>
			<!-- COL 2  -->
			<div>
				{#if myapp.installs}
					<RatingInstallsLarge app={myapp} />
				{/if}
			</div>
			<!-- COL 3  -->
			<!-- EMPTY COL? -->
		</div>
	{/await}
</div>

<nav class="bg-surface-100-800-token border-y border-surface-300-600-token my-2 md:my-6">
	<div class="mx-1: md:mx-8">
		{#await data.myapp then myapp}
			<AppTabs {isAndroidApp} {myapp} />
		{/await}
	</div>
</nav>

{@render children?.()}
