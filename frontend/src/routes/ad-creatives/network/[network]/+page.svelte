<script lang="ts">
	import AdCreativesReport from '$lib/AdCreativesReport.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.pageTitle || `Ad Creatives by Network | AppGoblin`}</title>
	<meta
		name="description"
		content={data.pageDescription || `Browse mobile ad creatives filtered by ad network.`}
	/>
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={data.canonicalUrl || `https://appgoblin.info/ad-creatives`} />
</svelte:head>

<AdCreativesReport {data} />
