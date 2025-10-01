import type { Handle, ServerInit } from '@sveltejs/kit';
import type { CatData, CompanyTypes, AppStore, CollectionRanks, CategoryRanks } from './types';

interface Country {
	code: string;
	name: string;
}

interface CachedData {
	appCats: CatData;
	appsOverview: any; // Define proper type based on your API response
	companyTypes: CompanyTypes;
	countries: Country[];
	myRankingsMap?: any; // Define proper type based on your API response
	storeIDLookup: Record<number, AppStore>;
	collectionIDLookup: Record<number, Record<number, CollectionRanks>>;
	categoryIDLookup: Record<number, Record<number, CategoryRanks>>;
}

// Cache with default empty values
let cachedData: CachedData = {
	appCats: { categories: [] },
	appsOverview: {},
	companyTypes: { types: [] },
	countries: [],
	storeIDLookup: {},
	collectionIDLookup: {},
	categoryIDLookup: {}
};

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

const API_BASE_URL = 'http://localhost:8000/api';

async function fetchWithRetry(url: string, retries = 10): Promise<any> {
	for (let i = 0; i < retries; i++) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			return await response.json();
		} catch (error) {
			console.error(`Attempt ${i + 1} failed for ${url}:`, error);
			if (i === retries - 1) throw error;
			// Wait before retrying (exponential backoff)
			await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
		}
	}
}

function buildRankingsLookups(rankings: { stores_rankings: AppStore[] }) {
	const storeIDLookup: Record<number, AppStore> = {};
	const collectionIDLookup: Record<number, Record<number, CollectionRanks>> = {};
	const categoryIDLookup: Record<number, Record<number, CategoryRanks>> = {};

	rankings.stores_rankings.forEach((store) => {
		storeIDLookup[store.store_id] = store;
		store.collections.forEach((collection) => {
			if (!collectionIDLookup[store.store_id]) collectionIDLookup[store.store_id] = {};
			collectionIDLookup[store.store_id][collection.collection_id] = collection;
			collection.categories.forEach((category) => {
				if (!categoryIDLookup[collection.collection_id])
					categoryIDLookup[collection.collection_id] = {};
				categoryIDLookup[collection.collection_id][category.category_id] = category;
			});
		});
	});

	return { storeIDLookup, collectionIDLookup, categoryIDLookup };
}

async function initializeCache(): Promise<void> {
	if (isInitialized) return;

	console.log('Initializing cache on server start...');

	try {
		const [appCats, appsOverview, companyTypes, countries, myStoreRankingsMap] = await Promise.all([
			fetchWithRetry(`${API_BASE_URL}/categories`),
			fetchWithRetry(`${API_BASE_URL}/apps/overview`),
			fetchWithRetry(`${API_BASE_URL}/companies/types`),
			fetchWithRetry(`${API_BASE_URL}/categories/countries`),
			fetchWithRetry(`${API_BASE_URL}/rankings`)
		]);

		const { storeIDLookup, collectionIDLookup, categoryIDLookup } =
			buildRankingsLookups(myStoreRankingsMap);

		cachedData = {
			appCats,
			appsOverview,
			companyTypes,
			countries,
			storeIDLookup,
			collectionIDLookup,
			categoryIDLookup
		};

		isInitialized = true;
		console.log('Cache initialized successfully');
	} catch (error) {
		console.error('Failed to initialize cache:', error);
	}
}

export const init: ServerInit = async () => {
	initializationPromise = initializeCache();
	await initializationPromise;
};

export const getCachedData = async (): Promise<CachedData> => {
	// Ensure initialization is complete
	if (!isInitialized && initializationPromise) {
		await initializationPromise;
	}

	return cachedData;
};

export const handle: Handle = async ({ event, resolve }) => {
	const route = event.url.pathname;

	if (route.startsWith('/networks')) {
		return new Response(undefined, {
			status: 301,
			headers: { Location: '/companies/types/ad-networks' }
		});
	}
	if (route.startsWith('/companies/github.com/')) {
		return new Response(undefined, {
			status: 301,
			headers: { Location: route.replace('github.com/', 'github.com-') }
		});
	}
	if (route.startsWith('/trackers')) {
		return new Response(undefined, {
			status: 301,
			headers: { Location: '/companies/types/ad-attribution' }
		});
	}
	if (route.startsWith('/adtech')) {
		return new Response(undefined, { status: 301, headers: { Location: '/companies' } });
	}
	if (route.startsWith('/companies/types/monetization')) {
		return new Response(undefined, {
			status: 301,
			headers: { Location: '/companies/types/ad-networks' }
		});
	}
	if (route == '/collections/new_weekly') {
		return new Response(undefined, {
			status: 301,
			headers: { Location: '/collections/new_weekly/google/overall' }
		});
	}
	if (route == '/collections/new_monthly') {
		return new Response(undefined, {
			status: 301,
			headers: { Location: '/collections/new_monthly/google/overall' }
		});
	}
	if (route == '/collections/new_yearly') {
		return new Response(undefined, {
			status: 301,
			headers: { Location: '/collections/new_yearly/google/overall' }
		});
	}

	// let start = performance.now();
	const response = await resolve(event);
	// let end = performance.now();
	// let duration = end - start;
	// duration = duration.toFixed(2);
	// console.log(`${route} took ${duration}ms`);
	const cacheablePaths = ['/companies', '/about', '/apps', '/ad-creatives'];
	const shouldCache = cacheablePaths.some((path) => event.url.pathname.startsWith(path));

	if (shouldCache) {
		response.headers.set('cache-control', 'public, max-age=86400, stale-while-revalidate=3600');
	}
	return response;
};
