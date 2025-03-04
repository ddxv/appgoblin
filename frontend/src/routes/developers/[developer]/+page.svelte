<script lang="ts">
	import type { DeveloperResponse } from '../../../types';
	import AppsCard from '$lib/AppGroupCard.svelte';
	import { page } from '$app/state';
	import ExternalLink from '$lib/ExternalLink.svelte';
	interface Props {
		data: DeveloperResponse;
	}

	import CompanyOverviewTable from '$lib/CompanyOverviewTable.svelte';

	let { data }: Props = $props();
</script>

<svelte:head>
	<link rel="canonical" href="https://appgoblin.info/developers/{page.params.developer}" />
	{#await data.devs then dev}
		<title>{dev.title} Android Trends | {page.params.developer} | AppGoblin Developer Data</title>
		<meta
			name="description"
			content="Explore {dev.title} Android & iOS app's analytics and market trends with AppGoblin. Detailed app rankings and download statistics to inform your Android & iOS app strategy and discover top-performing apps."
		/>
		<meta
			name="keywords"
			content="{dev.title}, {page.params
				.developer}, analytics, ads, market data, Android app rankings, app reviews, download statistics, Google Play data, app comparison, mobile app insights, Android"
		/>
		<meta
			property="og:title"
			content="{dev.title} Android App Stats & Info - AppGoblin | {page.params.developer}"
		/>
		<meta
			property="og:description"
			content="Explore {dev.title} Android & iOS app analytics and market trends with AppGoblin. {dev.title} by {page
				.params
				.developer}. Dive into detailed app rankings and download statistics to inform your Android & iOS app strategy and discover top-performing apps."
		/>
		<meta
			name="twitter:title"
			content="{dev.title} Android & iOS | {page.params.developer} | App Stats & Info - AppGoblin"
		/>
		<meta
			name="twitter:description"
			content="Explore {dev.title} Android & iOS app analytics and market trends with AppGoblin. {dev.title} by {page
				.params
				.developer}. Dive into detailed app rankings and download statistics to inform your Android & iOS app strategy and discover top-performing apps."
		/>

		<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
		<meta property="og:url" content={page.url.href} />
		<meta property="og:type" content="website" />
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	{/await}
</svelte:head>

<div>
	{#await data.devs}
		<div>
			<span>Loading...</span>
		</div>
	{:then devs}
		{#if typeof devs == 'string'}
			Failed to load developer
		{:else}
			<h1 class="h1 p-2">Developer: {page.params.developer}</h1>
			{#if devs.google.app_count > 0}
				<h2 class="h2 p-2">Google Play Developer: {devs.google.developer_name}</h2>
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
				<h2 class="h2 p-2">Google Apps: {devs.google.developer_name} All Apps</h2>
				<CompanyOverviewTable entries_table={devs.google.apps.apps} />
			{:else}
				<p class="p-2">No apps found for Google Play developer or matched developer URLs.</p>
			{/if}
			<hr />
			{#if devs.apple.apps.apps.length > 0}
				<h2 class="h2 p-2">Apple iOS Developer: {devs.apple.developer_name}</h2>
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
				<h2 class="h2 p-2">Apple Apps: {devs.apple.developer_name} All Apps</h2>
				<CompanyOverviewTable entries_table={devs.apple.apps.apps} />
			{:else}
				<p class="p-2">No apps found for Apple developer or matched developer URLs.</p>
			{/if}
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>
