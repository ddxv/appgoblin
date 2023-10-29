import type { ChartTabularData } from '@carbon/charts-svelte';

export interface AppGroup {
	apps: AppFullDetail[];
	title: string;
}

export interface DeveloperResponse {
	results?: AppGroup;
	status?: number;
	error?: string;
}

export interface Category {
	key: string;
	google: AppGroup;
	ios: AppGroup;
}

export interface CategoryResponse {
	results?: Category;
	status?: number;
	error?: string;
}

export interface SearchResponse {
	results?: AppGroup;
	status?: number;
	error?: string;
}

export interface Collection {
	categories: AppGroup;
	title: string;
}

export interface Collections {
	myapps?: Collection;
	status?: number;
	error?: string;
}

export interface CategoryInfo {
	id: string;
	name: string;
	android: string;
	ios: string;
}

export interface MyCats {
	categories: Record<string, CategoryInfo>;
}

export interface CategoriesInfo {
	mycats: MyCats;
	status?: number;
	error?: string;
}
export interface AppRankResponse {
	myranks?: AppRankDetail;
	status?: number;
	error?: string;
}

export interface StoreCategoryRanks {
	ranks: RankedApps[];
}

export interface RankedApps {
	rank: number;
	name: string;
	store_id: string;
	icon_url_512: string;
}
export interface AppRankDetail {
	crawled_date: string;
	rank: number;
	store_collection: number;
	store_category: number;
}
export interface AppFullDetails {
	myapp?: AppFullDetail;
	myranks?: AppRankDetail[];
	status?: number;
	error?: string;
}

export interface AppFullDetail {
	icon_url_512?: string;
	name: string;
	installs?: string;
	store_id: string;
	id: number;
	developer_id?: string;
	developer_name: string;
	store_link: string;
	store_developer_link?: string;
	developer_url?: string;
	updated_at: string;
	rating: number;
	rating_count: string;
	review_count: string;
	histogram: number[];
	rating_count_num: number;
	category: string;
	free: string;
	price: string;
	size?: string;
	minimum_android?: string;
	developer_email?: string;
	content_rating?: string;
	ad_supported?: string;
	in_app_purchases?: string;
	editors_choice?: string;
	crawl_result: string;
	release_date: string;
	store_last_updated: string;
	created_at: string;
	history_table: string;
	featured_image_url?: string;
	phone_image_url_1?: string;
	phone_image_url_2?: string;
	phone_image_url_3?: string;
	tablet_image_url_1?: string;
	tablet_image_url_2?: string;
	tablet_image_url_3?: string;
	historyData?: ChartTabularData;
}

export type CategoryRanks = {
	category_id: number;
	category_name: string;
	// ... any other fields
};

export type CollectionRanks = {
	collection_id: number;
	collection_name: string;
	categories: CategoryRanks[];
};

export type Store = {
	store_id: number;
	store_name: string;
	collections: CollectionRanks[];
};

export type StoreRankingsMap = {
	stores_rankings: Store[];
};
