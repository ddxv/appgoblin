import { error, redirect } from '@sveltejs/kit';

import {
	buildAdCreativeCategoryOptions,
	buildAdCreativesPath,
	buildAdCreativesUrl,
	getAdCreativeCategoryLabel,
	getAdCreativeNetworkLabel,
	normalizeAdCreativeCategory,
	normalizeAdCreativeFormat,
	normalizeAdCreativeNetwork
} from '$lib/ad-creatives';
import { loginUrl } from '$lib/server/auth/auth';
import { createApiClient } from '$lib/server/api';

import { getCachedData } from '../../hooks.server';

type PrimaryFilter = 'base' | 'network' | 'app-category';

interface LoadAdCreativesPageOptions {
	fetch: typeof globalThis.fetch;
	isSignedIn: boolean;
	url: URL;
	primaryFilter: PrimaryFilter;
	category?: string | null;
	network?: string | null;
}

const ANONYMOUS_CREATIVE_LIMIT = 8;
const NETWORK_FILTER_SOURCE_LIMIT = 1000;

export async function loadAdCreativesPage({
	fetch,
	isSignedIn,
	url,
	primaryFilter,
	category,
	network
}: LoadAdCreativesPageOptions) {
	const queryCategory = normalizeAdCreativeCategory(url.searchParams.get('category'));
	const queryFormat = normalizeAdCreativeFormat(url.searchParams.get('format'));
	const queryCompany = normalizeAdCreativeNetwork(url.searchParams.get('company'));
	const routeCategory = normalizeAdCreativeCategory(category);
	const routeNetwork = normalizeAdCreativeNetwork(network);
	const allowAdvancedFilters = isSignedIn;

	if (!allowAdvancedFilters && primaryFilter === 'app-category') {
		throw redirect(308, '/ad-creatives');
	}

	if (primaryFilter === 'base' && (queryCategory || queryCompany)) {
		throw redirect(
			308,
			buildAdCreativesUrl({
				category: allowAdvancedFilters ? queryCategory : null,
				format: allowAdvancedFilters ? queryFormat : null,
				network: queryCompany
			})
		);
	}

	const selectedCategory = allowAdvancedFilters ? (routeCategory ?? queryCategory ?? 'overall') : 'overall';
	const selectedFormat = allowAdvancedFilters ? (queryFormat ?? 'all') : 'all';
	const searchCompany = routeNetwork ?? queryCompany ?? '';
	const { appCats } = await getCachedData();
	const categoryOptions = buildAdCreativeCategoryOptions(appCats);

	if (selectedCategory !== 'overall') {
		validateCategory(selectedCategory, appCats);
	}

	const api = createApiClient(fetch);
	const params = new URLSearchParams();
	let apiUrl = '/creatives/clusters';

	if (selectedCategory !== 'overall') {
		params.set('app_category', selectedCategory);
	}
	if (selectedFormat !== 'all') {
		params.set('format', selectedFormat);
	}
	if (searchCompany) {
		params.set('company', searchCompany);
	}

	const queryString = params.toString();
	if (queryString) {
		apiUrl += `?${queryString}`;
	}

	let networkApiUrl = '/creatives/clusters';
	const networkParams = new URLSearchParams();
	if (selectedCategory !== 'overall') {
		networkParams.set('app_category', selectedCategory);
	}
	if (selectedFormat !== 'all') {
		networkParams.set('format', selectedFormat);
	}
	networkParams.set('limit', String(NETWORK_FILTER_SOURCE_LIMIT));

	const networkQueryString = networkParams.toString();
	if (networkQueryString) {
		networkApiUrl += `?${networkQueryString}`;
	}

	const [creativeClustersResponse, networkFilterSourceClusters] = await Promise.all([
		api.get(apiUrl, 'Ad Creatives'),
		api.get(networkApiUrl, 'Ad Creative Network Filters')
	]);
	const creativeClusters = Array.isArray(creativeClustersResponse)
		? creativeClustersResponse.slice(0, allowAdvancedFilters ? creativeClustersResponse.length : ANONYMOUS_CREATIVE_LIMIT)
		: creativeClustersResponse;
	const seo = getAdCreativesSeo({
		primaryFilter,
		categoryOptions,
		selectedCategory,
		searchCompany
	});

	return {
		creativeClusters,
		networkFilterSourceClusters,
		categoryOptions,
		selectedCategory,
		selectedFormat,
		searchCompany,
		isSignedIn,
		allowAdvancedFilters,
		anonymousCreativeLimit: ANONYMOUS_CREATIVE_LIMIT,
		signInUrl: loginUrl(url.pathname + url.search),
		...seo
	};
}

function validateCategory(
	category: string,
	appCats: Awaited<ReturnType<typeof getCachedData>>['appCats']
) {
	const isValidCategory = appCats.categories.some((item) => item.id === category);

	if (!isValidCategory) {
		throw error(404, {
			message: `Category "${category}" not found`
		});
	}
}

function getAdCreativesSeo({
	primaryFilter,
	categoryOptions,
	selectedCategory,
	searchCompany
}: {
	primaryFilter: PrimaryFilter;
	categoryOptions: ReturnType<typeof buildAdCreativeCategoryOptions>;
	selectedCategory: string;
	searchCompany: string;
}) {
	const categoryLabel = getAdCreativeCategoryLabel(selectedCategory, categoryOptions);
	const networkLabel = getAdCreativeNetworkLabel(searchCompany);

	if (primaryFilter === 'network' && searchCompany) {
		const canonicalPath = buildAdCreativesPath({ network: searchCompany });
		const inCategoryText =
			selectedCategory !== 'overall' ? ` filtered to ${categoryLabel} apps` : '';

		return {
			pageTitle: `${networkLabel} Mobile Ad Creatives | AppGoblin`,
			pageDescription: `Browse top mobile ad videos and images associated with ${networkLabel}${inCategoryText}.`,
			pageHeading: `${networkLabel} Ad Creative Explorer`,
			pageIntro: `Browse actual videos and images seen across mobile ads associated with ${networkLabel}${inCategoryText}.`,
			canonicalPath,
			canonicalUrl: `https://appgoblin.info${canonicalPath}`
		};
	}

	if (primaryFilter === 'app-category' && selectedCategory !== 'overall') {
		const canonicalPath = buildAdCreativesPath({ category: selectedCategory });
		const onNetworkText = searchCompany ? ` associated with ${networkLabel}` : '';

		return {
			pageTitle: `${categoryLabel} Mobile Ad Creatives | AppGoblin`,
			pageDescription: `Browse top mobile ad videos and images running in ${categoryLabel} apps${onNetworkText}.`,
			pageHeading: `${categoryLabel} Ad Creative Explorer`,
			pageIntro: `Browse actual videos and images used by leading advertisers in ${categoryLabel} apps${onNetworkText}.`,
			canonicalPath,
			canonicalUrl: `https://appgoblin.info${canonicalPath}`
		};
	}

	const canonicalPath = '/ad-creatives';

	return {
		pageTitle: 'Ad Creative Explorer | AppGoblin',
		pageDescription:
			'Browse top mobile advertising videos and images for inspiration and competitor analysis.',
		pageHeading: 'Ad Creative Explorer',
		pageIntro: 'Browse actual videos and images used by top advertisers across ad networks.',
		canonicalPath,
		canonicalUrl: `https://appgoblin.info${canonicalPath}`
	};
}
