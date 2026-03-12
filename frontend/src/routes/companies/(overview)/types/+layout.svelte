<script lang="ts">
	import type { CompanyTypes } from '../../../../types';
	import { page } from '$app/state';

	let { data, children } = $props();

	let companyTypes = page.data.companyTypes;

	let type_title: string = $derived(getTypeTitle(companyTypes, page.params.type));
	let category_title = $derived(getCategoryName(page.params.category));

	function getTypeTitle(myTypes: CompanyTypes, currentType: string | undefined) {
		if (myTypes.types && currentType) {
			return (
				myTypes.types.find((type: { url_slug: string }) => type.url_slug === currentType)?.name ||
				''
			);
		}
		return '';
	}

	function getCategoryName(category: string | undefined) {
		if (category) {
			return (
				data?.appCats?.categories?.find((cat: { id: string }) => cat.id == category)?.name ||
				category
			);
		}
		return '';
	}

	let resolvedTypeTitle = $derived(type_title || 'Mobile App Service Companies');
	let resolvedCategoryTitle = $derived(category_title || 'All App Categories');
	let title = $derived(
		`Top ${resolvedTypeTitle}${page.params.category ? ` in ${resolvedCategoryTitle}` : ''} | AppGoblin`
	);
	let description = $derived(
		`Explore leading ${resolvedTypeTitle}${page.params.category ? ` in ${resolvedCategoryTitle}` : ''} by app coverage, SDK/API footprint, and app-ads.txt visibility in the mobile ecosystem.`
	);
	let keywords = $derived(
		`${resolvedTypeTitle}, ${resolvedCategoryTitle}, android, ios, adtech, advertising network, data tracking, mobile measurement, programmatic advertising, app-ads.txt, mobile advertising, ad tech analytics, AppGoblin`
	);
	let structuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'CollectionPage',
		name: title,
		description,
		url: page.url.href,
		inLanguage: 'en',
		isPartOf: {
			'@type': 'WebSite',
			name: 'AppGoblin',
			url: 'https://appgoblin.info'
		},
		about: [
			{
				'@type': 'Thing',
				name: resolvedTypeTitle
			},
			{
				'@type': 'Thing',
				name: resolvedCategoryTitle
			}
		]
	});
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="canonical" href={page.url.href} />
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />

	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content={page.url.href} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta name="robots" content="index, follow" />
	{@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<main>
	{@render children?.()}
</main>
