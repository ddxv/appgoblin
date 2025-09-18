<script lang="ts">
	import { page } from '$app/state';
	import RatingInstallsLarge from '$lib/RatingInstallsLarge.svelte';
	import StarsRating from '$lib/StarsRating.svelte';
	import type { CompanyTypes, AppFullDetail, CatData } from '../../../types';
	import AvailableOniOs from '$lib/svg/AvailableOniOS.svelte';
	import AppTabs from '$lib/utils/AppTabs.svelte';

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

	function isAndroid() {
		return !/^\d+$/.test(page.params.id!);
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
	{#if data.myapp.store_link.includes('google')}
		<title>{data.myapp.name} Android Analysis</title>
		<meta
			name="description"
			content="{data.myapp.name} by {data.myapp
				.developer_name} Android app's analytics and competitor analysis. Check out detailed app SDK, partners, ads, rankings, and more."
		/>
		<meta
			name="keywords"
			content="{data.myapp.name}, {data.myapp.developer_name}, {data.myapp
				.developer_id}, {getCategoryName(
				data.myapp.category
			)}, competitor analysis, creatives, analytics, ads, market data, Android app rankings, app reviews, download statistics, Google Play data, app comparison, mobile app insights, Android"
		/>
		<meta property="og:title" content="{data.myapp.name} Android Analysis" />
		<meta
			property="og:description"
			content="{data.myapp.name} by {data.myapp
				.developer_name} Android app's analytics and competitor analysis. Check out detailed app SDK, partners, ads, rankings, and more."
		/>
		<meta name="twitter:title" content="{data.myapp.name} Android Analysis" />
		<meta
			name="twitter:description"
			content="{data.myapp.name} by {data.myapp
				.developer_name} Android app's analytics and competitor analysis. Check out detailed app SDK, partners, ads, rankings, and more."
		/>
	{:else}
		<title>{data.myapp.name} iOS Analysis & Data</title>
		<meta
			name="description"
			content="{data.myapp.name} by {data.myapp
				.developer_name} iOS app's analytics and competitor analysis. Check out detailed app SDK, partners, ads, rankings, and more."
		/>
		<meta
			name="keywords"
			content="{data.myapp.name}, {data.myapp.developer_name}, {data.myapp.developer_id}, {data
				.myapp
				.category} competitor analysis, creatives, analytics, ads, market data, iOS app rankings, app reviews, download statistics, App Store data, app comparison, mobile app insights, iOS"
		/>
		<meta property="og:title" content="{data.myapp.name} iOS Analysis" />
		<meta
			property="og:description"
			content="{data.myapp.name} by {data.myapp
				.developer_name} iOS app's analytics and competitor analysis. Check out detailed app SDK, partners, ads, rankings, and more."
		/>
		<meta name="twitter:title" content="{data.myapp.name} iOS Analysis" />
		<meta
			name="twitter:description"
			content="{data.myapp.name} by {data.myapp
				.developer_name} iOS app's analytics and competitor analysis. Check out detailed app SDK, partners, ads, rankings, and more."
		/>
	{/if}
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta name="robots" content="index, follow" />
</svelte:head>

<div class="card-header px-4 md:px-8">
	<h1 class="text-primary-900-100 text-3xl font-bold mb-4">{data.myapp.name}</h1>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
		<!-- COL 1  -->
		<div class="grid grid-cols-3 gap-0">
			<div class="col-span-1">
				{#if data.myapp.icon_url_512}
					<img
						src={data.myapp.icon_url_512}
						alt={data.myapp.name}
						class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-60 xl:h-60"
						referrerpolicy="no-referrer"
					/>
				{/if}
				<!-- Ratings: STARS (123) -->
				<div class="md:hidden">
					<StarsRating total={5} size={20} rating={data.myapp.rating} />
				</div>
				<div class="hidden md:inline-flex">
					<StarsRating total={5} size={40} rating={data.myapp.rating} />
				</div>
			</div>

			<div class="space-y-2 md:space-y-4 col-span-2">
				<div class="flex items-center justify-center">
					<a
						href={data.myapp.store_link}
						target="_blank"
						class="anchor inline-flex items-center hover:scale-105 transition-transform"
					>
						{#if data.myapp.store_link.includes('google')}
							<img
								class="w-32 md:w-48 md:w-64"
								src="/gp_en_badge_web_generic.png"
								alt={data.myapp.name}
							/>
						{:else}
							<AvailableOniOs size={180} />
						{/if}
					</a>
				</div>
				{#if data.myapp.developer_id}
					<a href="/developers/{data.myapp.developer_id}" class="block">
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
								Developer: {data.myapp.developer_name.split(' ').slice(0, 3).join(' ') ||
									data.myapp.developer_id}
							</span>
						</div>
					</a>
				{/if}

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
						Category: {getCategoryName(data.myapp.category)}
					</span>
				</div>
			</div>
		</div>
		<!-- COL 2  -->
		<div>
			{#if data.myapp.installs || data.myapp.rating_count}
				<RatingInstallsLarge app={data.myapp} />
			{/if}
		</div>
		<!-- COL 3  -->
		<!-- EMPTY COL? -->
	</div>
</div>

<nav class="bg-surface-100-800-token border-y border-surface-300-600-token my-2 md:my-6">
	<div class="mx-1: md:mx-8">
		<AppTabs {isAndroidApp} myapp={data.myapp} />
	</div>
</nav>

{@render children?.()}
