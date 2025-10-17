import type { PageServerLoad } from './$types';

interface AppAdData {
	best_week: string;
	app_name: string;
	store_id: string;
	icon_url_100: string;
	weekly_installs: number;
	weekly_percent_increase: number;
	phash: string;
	file_extension: string;
	host_ad_domain: string;
	initial_ad_domain: string | null;
	host_company_logo_url: string;
	initial_company_logo_url: string | null;
	mmp_domain?: string | null;
	mmp_domains: string | null;
	md5_hash: string;
	pub_count: number;
}

interface AdNetworkData {
	ad_network_name: string;
	ad_network_domain: string;
	company_logo_url: string;
	all_domains: string[] | string;
	domains?: string[];
	publisher_count: number;
	advertiser_count: number;
	creatives_count: number;
}

const rawSummaryData = [
	{
		apps_analyzed: 13255,
		https_tracked: 694313,
		api_domains: 7477,
		adtech_companies: 213,
		advertisers: 152,
		creative_count: 11092
	}
];

const rawMostPopularCreatives = [
	{
		phash: 'd976a676bf5f',
		md5_hash: '2e9f32bb7f2c797e12a8843a94026229',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 48,
		first_seen: '2025-08-06T19:10:44.989Z',
		last_seen: '2025-08-27T17:42:12.479Z',
		advertiser_store_id: 'com.my6.android',
		advertiser_icon_url_100: '91dad2341537171f.png'
	},
	{
		phash: 'cf6fb670b96f',
		md5_hash: '8511981bc42178ab4af9051bc45688ae',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 45,
		first_seen: '2025-08-02T00:38:01.191Z',
		last_seen: '2025-08-27T16:29:46.871Z',
		advertiser_store_id: 'com.my6.android',
		advertiser_icon_url_100: '91dad2341537171f.png'
	},
	{
		phash: '25799add637d',
		md5_hash: 'f66d7f24b1a126abae59b7897e475f1e',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 38,
		first_seen: '2025-08-01T15:48:11.892Z',
		last_seen: '2025-08-28T01:46:00.964Z',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png'
	},
	{
		phash: '7f72db6cadcd',
		md5_hash: '7c6c57039769ed1f746b4f243160bfa7',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 24,
		first_seen: '2025-07-31T19:43:29.246Z',
		last_seen: '2025-08-08T09:07:47.081Z',
		advertiser_store_id: 'tr.com.apps.drill.and.collect',
		advertiser_icon_url_100: 'ecc4c713998c06fb.png'
	},
	{
		phash: '7f3bfe6aff88',
		md5_hash: '1b7034b54742ce9b48bb1ffb59ccb2d1',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 19,
		first_seen: '2025-08-06T06:45:40.337Z',
		last_seen: '2025-08-27T23:43:00.964Z',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png'
	},
	{
		phash: '79be743e75dd',
		md5_hash: 'db6839fedf8da61c82ece2ba1c9a99cb',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 18,
		first_seen: '2025-07-31T19:43:29.246Z',
		last_seen: '2025-08-24T20:52:06.407Z',
		advertiser_store_id: 'com.saily.android',
		advertiser_icon_url_100: 'b2b11b99cc4e6cc6.png'
	},
	{
		phash: '373770fdb256',
		md5_hash: '6acc886e2eaec4922005465641cc52cb',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 14,
		first_seen: '2025-08-02T08:03:45.697Z',
		last_seen: '2025-08-26T19:55:15.531Z',
		advertiser_store_id: 'com.saily.android',
		advertiser_icon_url_100: 'b2b11b99cc4e6cc6.png'
	},
	{
		phash: 'be3987a53deb',
		md5_hash: 'bcb5fb209f802f7af36f8e27b6f325aa',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 12,
		first_seen: '2025-08-07T23:56:06.534Z',
		last_seen: '2025-08-24T19:22:47.081Z',
		advertiser_store_id: 'com.oyo.consumer',
		advertiser_icon_url_100: 'c4ce3b31c4ce3b31.png'
	},
	{
		phash: 'fffff1336632',
		md5_hash: '0ea85b3e0b8a5e0b49fb7b9b11c9bc86',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 9,
		first_seen: '2025-08-01T16:47:43.332Z',
		last_seen: '2025-08-04T04:09:16.799Z',
		advertiser_store_id: 'tr.com.apps.drill.and.collect',
		advertiser_icon_url_100: 'ecc4c713998c06fb.png'
	},
	{
		phash: '3d71fcef75bf',
		md5_hash: '479dec88758f32703e704c447c97da45',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 8,
		first_seen: '2025-08-08T04:27:48.630Z',
		last_seen: '2025-08-27T22:39:51.773Z',
		advertiser_store_id: 'com.shopify.mobile',
		advertiser_icon_url_100: 'c63e39c46693623b.png'
	}
];

const rawAdNetworkData: AdNetworkData[] = [
	{
		ad_network_name: 'Google',
		ad_network_domain: 'google.com',
		all_domains: '{google.com}',
		company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		publisher_count: 1451,
		advertiser_count: 80,
		creatives_count: 1086
	},
	{
		ad_network_name: 'YouAppi',
		ad_network_domain: 'youappi.com',
		all_domains: '{youappi.com}',
		company_logo_url: 'company-logos\/youappi.com\/logo_64x64.ico',
		publisher_count: 214,
		advertiser_count: 4,
		creatives_count: 61
	},
	{
		ad_network_name: 'Bigabid',
		ad_network_domain: 'bigabid.com',
		all_domains: '{bigabid.com}',
		company_logo_url: 'company-logos\/bigabid.com\/logo_200x200.jpeg',
		publisher_count: 188,
		advertiser_count: 8,
		creatives_count: 62
	},
	{
		ad_network_name: 'AppLovin',
		ad_network_domain: 'applovin.com',
		all_domains: '{applovin.com}',
		company_logo_url: 'company-logos\/applovin.com\/logo_200x200.jpeg',
		publisher_count: 103,
		advertiser_count: 0,
		creatives_count: 224
	},
	{
		ad_network_name: 'Digital Turbine',
		ad_network_domain: 'digitalturbine.com',
		all_domains: '{appreciate.mobi,fyber.com}',
		company_logo_url: 'company-logos\/digitalturbine.com\/logo_200x200.jpeg',
		publisher_count: 100,
		advertiser_count: 15,
		creatives_count: 91
	},
	{
		ad_network_name: 'Unity',
		ad_network_domain: 'unity.com',
		all_domains: '{unity.com,unity3d.com}',
		company_logo_url: 'company-logos\/unity.com\/logo_200x200.jpeg',
		publisher_count: 95,
		advertiser_count: 35,
		creatives_count: 111
	},
	{
		ad_network_name: 'Mobvista',
		ad_network_domain: 'mobvista.com',
		all_domains: '{mintegral.com}',
		company_logo_url: 'company-logos\/mobvista.com\/logo_200x200.jpeg',
		publisher_count: 88,
		advertiser_count: 24,
		creatives_count: 95
	},
	{
		ad_network_name: 'Remerge',
		ad_network_domain: 'remerge.io',
		all_domains: '{remerge.io}',
		company_logo_url: 'company-logos\/remerge.io\/logo_200x200.jpeg',
		publisher_count: 77,
		advertiser_count: 2,
		creatives_count: 43
	},
	{
		ad_network_name: 'Yandex',
		ad_network_domain: 'yandex.com',
		all_domains: '{yandex.com}',
		company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		publisher_count: 69,
		advertiser_count: 14,
		creatives_count: 202
	},
	{
		ad_network_name: 'Appodeal',
		ad_network_domain: 'appodeal.com',
		all_domains: '{bidmachine.io}',
		company_logo_url: 'company-logos\/appodeal.com\/logo_200x200.jpeg',
		publisher_count: 49,
		advertiser_count: 13,
		creatives_count: 46
	}
];

const rawData: AppAdData[] = [
	{
		best_week: '2025-08-18',
		app_name: 'Harry Potter: Puzzles & Spells',
		store_id: 'com.zynga.pottermatch',
		icon_url_100: 'e8eb95154e6cd41a.png',
		weekly_installs: 34360,
		weekly_percent_increase: 90.416374182584,
		phash: 'dfc67cdf7cd6658c',
		file_extension: 'mp4',
		host_ad_domain: 'remerge.io',
		host_company_logo_url: 'company-logos\/remerge.io\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '5292e9abe6eab1f2ba79342dc65e1684',
		pub_count: 2
	},
	{
		best_week: '2025-08-18',
		app_name: 'Draw Animation - Anim Creator',
		store_id: 'com.banix.drawsketch.animationmaker',
		icon_url_100: 'eb94da6c949263a5.png',
		weekly_installs: 202560,
		weekly_percent_increase: 56.5213359743046,
		phash: 'd5f7f82b2fbfde3e',
		file_extension: 'mp4',
		host_ad_domain: 'mintegral.com',
		host_company_logo_url: 'company-logos\/mintegral.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '121201174d4b14472d0b0f7045f4113d',
		pub_count: 1
	},
	{
		best_week: '2025-08-25',
		app_name: 'Seven Knights Idle Adventure',
		store_id: 'com.netmarble.skiagb',
		icon_url_100: '88ef2729a132b5d6.png',
		weekly_installs: 9696,
		weekly_percent_increase: 53.0383542905245,
		phash: 'c6b70d19e8724ce3',
		file_extension: 'jpg',
		host_ad_domain: 'adikteev.com',
		host_company_logo_url: 'company-logos\/adikteev.com\/logo_200x200.jpeg',
		initial_ad_domain: 'fyber.com',
		initial_company_logo_url: 'company-logos\/fyber.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: 'cd7ef42482c5c55fa1ae0559b1770916',
		pub_count: 2
	},
	{
		best_week: '2025-08-11',
		app_name: 'Goods Puzzle: Sort Challenge™',
		store_id: 'com.fc.goods.sort.matching.puzzle.triplemaster',
		icon_url_100: 'b26c326a3f3b2ec0.png',
		weekly_installs: 900794,
		weekly_percent_increase: 46.3722735788812,
		phash: 'b26c326a3f3b2ec0',
		file_extension: 'jpg',
		host_ad_domain: 'appreciate.mobi',
		host_company_logo_url: 'company-logos\/appreciate.mobi\/logo_200x200.jpeg',
		initial_ad_domain: 'mintegral.com',
		initial_company_logo_url: 'company-logos\/mintegral.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '883a6c3c8a4d5a1846129e4ec6892301',
		pub_count: 2
	},
	{
		best_week: '2025-08-04',
		app_name: 'Klondike Solitaire: Classic',
		store_id: 'com.andreyrebrik.klondike',
		icon_url_100: 'c11e6ce0329f39f1.png',
		weekly_installs: 9897,
		weekly_percent_increase: 43.6916227072545,
		phash: 'a9ab6a2a95d4ccb4',
		file_extension: 'jpeg',
		host_ad_domain: 'yandex.com',
		host_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		initial_ad_domain: 'yandex.com',
		initial_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		mmp_domains: '{appmetrica.yandex.com}',
		md5_hash: '8649899f9ba24184a630185b03f624d5',
		pub_count: 3
	},
	{
		best_week: '2025-08-18',
		app_name: 'Sudoku Master',
		store_id: 'com.openmygame.games.android.sudokumaster',
		icon_url_100: 'bf0f8d6672e08952.png',
		weekly_installs: 96225,
		weekly_percent_increase: 41.1227243395452,
		phash: 'de15215e0e5a3fa1',
		file_extension: 'gif',
		host_ad_domain: 'bidease.com',
		host_company_logo_url: 'company-logos\/bidease.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '0cc4cb0deda477dd3bcef9c20cb42019',
		pub_count: 1
	},
	{
		best_week: '2025-08-25',
		app_name: 'The Wonder Weeks - Leaps',
		store_id: 'org.twisevictory.apps.ex',
		icon_url_100: 'b0ccc63293339bcd.png',
		weekly_installs: 8423,
		weekly_percent_increase: 33.7904378673161,
		phash: 'c77938f8ebc7ffc7',
		file_extension: 'webm',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '7ab9e02f94994f708c644e755161ed8a',
		pub_count: 1
	},
	{
		best_week: '2025-08-04',
		app_name: 'My6 - Book & Save on Motel6',
		store_id: 'com.my6.android',
		icon_url_100: '91dad2341537171f.png',
		weekly_installs: 10187,
		weekly_percent_increase: 32.7181135189126,
		phash: 'bdfeff77aa7c9cce',
		file_extension: 'webm',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{branch.io}',
		md5_hash: '2e9f32bb7f2c797e12a8843a94026229',
		pub_count: 3
	},
	{
		best_week: '2025-08-18',
		app_name: 'Sago Mini World: Kids Games',
		store_id: 'com.sagosago.World.googleplay',
		icon_url_100: 'becd9403da889973.png',
		weekly_installs: 62825,
		weekly_percent_increase: 30.0518206219855,
		phash: 'fbe1bc61f79ce3cb',
		file_extension: 'webm',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '88f528f874a60ebb6842d39948065da1',
		pub_count: 1
	},
	{
		best_week: '2025-08-04',
		app_name: 'Merge Dragons!',
		store_id: 'com.gramgames.mergedragons',
		icon_url_100: 'ecdc577943234386.png',
		weekly_installs: 118782,
		weekly_percent_increase: 29.3818213505094,
		phash: 'a43f42d423e88ae7',
		file_extension: 'webm',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: 'ccc745811af993f730cbb7e0efce543d',
		pub_count: 1
	},
	{
		best_week: '2025-08-04',
		app_name: '88 Fortunes Casino Slot Games',
		store_id: 'com.ballytechnologies.f88',
		icon_url_100: 'c15f2b3538617d94.png',
		weekly_installs: 25919,
		weekly_percent_increase: 29.3298737587945,
		phash: 'fcbe3ff96f464fed',
		file_extension: 'mp4',
		host_ad_domain: 'bigabid.com',
		host_company_logo_url: 'company-logos\/bigabid.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '2ad18a10e8b0a4cda15b841e0d60e86d',
		pub_count: 1
	},
	{
		best_week: '2025-08-25',
		app_name: 'Easy Homescreen',
		store_id: 'easy.launcher',
		icon_url_100: '879368b7386e91a5.png',
		weekly_installs: 230664,
		weekly_percent_increase: 29.2510450404008,
		phash: 'e5f95fbe2dd6feed',
		file_extension: 'webm',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '66d37bb6cb4dad5369fe6d63b5a8ae07',
		pub_count: 1
	},
	{
		best_week: '2025-08-25',
		app_name: 'FreeCell Solitaire: Classic',
		store_id: 'com.andreyrebrik.freecell',
		icon_url_100: 'c11e6ce0369b39f1.png',
		weekly_installs: 4006,
		weekly_percent_increase: 29.0592783505155,
		phash: 'c4952e6ab175c49b',
		file_extension: 'jpeg',
		host_ad_domain: 'yandex.com',
		host_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		initial_ad_domain: 'yandex.com',
		initial_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		mmp_domains: '{appmetrica.yandex.com}',
		md5_hash: '7c1421959c29ea700f961bfbbb28eab7',
		pub_count: 1
	},
	{
		best_week: '2025-08-04',
		app_name: 'Saily: An eSIM travel app',
		store_id: 'com.saily.android',
		icon_url_100: 'b2b11b99cc4e6cc6.png',
		weekly_installs: 62594,
		weekly_percent_increase: 28.0293991313893,
		phash: 'c9c83f9f723442c3',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: 'db6839fedf8da61c82ece2ba1c9a99cb',
		pub_count: 1
	},
	{
		best_week: '2025-08-18',
		app_name: 'Gold Fish Casino Slot Games',
		store_id: 'com.williamsinteractive.goldfish',
		icon_url_100: '9015bf4b40e47b3d.png',
		weekly_installs: 12438,
		weekly_percent_increase: 20.8903000064796,
		phash: 'ea7f7de666de1c21',
		file_extension: 'mp4',
		host_ad_domain: 'bigabid.com',
		host_company_logo_url: 'company-logos\/bigabid.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '7313f98beccb079f8b43d5935cb9d379',
		pub_count: 2
	},
	{
		best_week: '2025-08-11',
		app_name: 'Drill & Collect: idle mine dig',
		store_id: 'tr.com.apps.drill.and.collect',
		icon_url_100: 'ecc4c713998c06fb.png',
		weekly_installs: 83822,
		weekly_percent_increase: 16.5149219499312,
		phash: 'f3d33c78dbc10486',
		file_extension: 'mp4',
		host_ad_domain: 'youappi.com',
		host_company_logo_url: 'company-logos\/youappi.com\/logo_64x64.ico',
		initial_ad_domain: 'youappi.com',
		initial_company_logo_url: 'company-logos\/youappi.com\/logo_64x64.ico',
		mmp_domains: '{metrica.yandex.com}',
		md5_hash: '7c6c57039769ed1f746b4f243160bfa7',
		pub_count: 1
	},
	{
		best_week: '2025-08-11',
		app_name: 'Pointee Play',
		store_id: 'com.playnovel.pointeeplay',
		icon_url_100: '80d57d6b3c4d70a5.png',
		weekly_installs: 4810,
		weekly_percent_increase: 15.2463860714,
		phash: 'bfa7cad65bdbe7db',
		file_extension: 'mp4',
		host_ad_domain: 'mintegral.com',
		host_company_logo_url: 'company-logos\/mintegral.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: 'cd6c193564f8caa70c5d56af00db0446',
		pub_count: 3
	}
];

const AppReachData = [
	{
		advertiser_name: 'TikTok - Videos, Shop & LIVE',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png',
		advertiser_category: 'social networking',
		advertiser_installs: 3.940370292e9,
		unique_creatives: 72,
		unique_publishers: 241,
		first_seen: '2025-07-31T16:24:39.304Z',
		last_seen: '2025-08-28T02:09:01.606Z',
		ad_network_domains: '{google.com,unity.com}',
		avg_publisher_installs: 2.034827492717087e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{0ab19cfef55c6bd4d859748dfff68c91,a793aba98d95d335647479130350154b,f4460646afc7e9699f01d512433fc35e,a793aba98d95d335647479130350154b,b5da6ddb8fad23ac2c438c802b475ad9}'
	},
	{
		advertiser_name: 'My6 - Book & Save on Motel6',
		advertiser_store_id: 'com.my6.android',
		advertiser_icon_url_100: '91dad2341537171f.png',
		advertiser_category: 'travel_and_local',
		advertiser_installs: 736767.0,
		unique_creatives: 32,
		unique_publishers: 196,
		first_seen: '2025-07-31T16:49:48.900Z',
		last_seen: '2025-08-27T20:49:12.352Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1.927674018430034e7,
		mmp_domains: '{branch.io,singular.net}',
		top_md5_hashes:
			'{9dc7d0fa2195f70033c7ac43d9923bb8,a4741849fef577400c145bc80d8a4b16,9dc7d0fa2195f70033c7ac43d9923bb8,2e9f32bb7f2c797e12a8843a94026229,2e9f32bb7f2c797e12a8843a94026229}'
	},
	{
		advertiser_name: 'Saily: An eSIM travel app',
		advertiser_store_id: 'com.saily.android',
		advertiser_icon_url_100: 'b2b11b99cc4e6cc6.png',
		advertiser_category: 'travel_and_local',
		advertiser_installs: 3226736.0,
		unique_creatives: 28,
		unique_publishers: 92,
		first_seen: '2025-07-31T19:43:29.246Z',
		last_seen: '2025-08-27T01:18:10.476Z',
		ad_network_domains: '{google.com,unity.com}',
		avg_publisher_installs: 1.2920885697478991e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{b4dad8f49dbb1cdd3d336d2959403f06,c167a8d4c78b198a8bd346bdbda0c1df,b4dad8f49dbb1cdd3d336d2959403f06,b4dad8f49dbb1cdd3d336d2959403f06,a8cb892a203845021e38db32477ad6a6}'
	},
	{
		advertiser_name: 'Drill & Collect: idle mine dig',
		advertiser_store_id: 'tr.com.apps.drill.and.collect',
		advertiser_icon_url_100: 'ecc4c713998c06fb.png',
		advertiser_category: 'game_simulation',
		advertiser_installs: 1.4251268e7,
		unique_creatives: 22,
		unique_publishers: 56,
		first_seen: '2025-07-31T18:49:18.732Z',
		last_seen: '2025-08-08T09:07:47.081Z',
		ad_network_domains: '{appodeal.com,digitalturbine.com,google.com,liftoff.io,youappi.com}',
		avg_publisher_installs: 2.6621387074380167e7,
		mmp_domains: '{adj.st,adjust.com,appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{7c6c57039769ed1f746b4f243160bfa7,70397b7c447743dde9d5e746aa66d4ce,55475998debe7d05c2c6fc3f4af4f279,795c57e9e355fffba80dd930d82c77d0,6ee808b9850db88d9a3e3898a6126feb}'
	},
	{
		advertiser_name: 'Cashman Casino Slots Games',
		advertiser_store_id: 'com.productmadness.cashmancasino',
		advertiser_icon_url_100: 'bb30c40f1bc6c5cd.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 1.9848073e7,
		unique_creatives: 4,
		unique_publishers: 43,
		first_seen: '2025-08-01T15:15:49.901Z',
		last_seen: '2025-08-27T10:29:56.307Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 2.4009349173913043e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{75a8328cfd51477adf329680eaf50e02,f106b694cb313332485421ec7011b5d2,f106b694cb313332485421ec7011b5d2,75a8328cfd51477adf329680eaf50e02,75a8328cfd51477adf329680eaf50e02}'
	},
	{
		advertiser_name: 'DoubleDown Casino Vegas Slots',
		advertiser_store_id: 'com.ddi',
		advertiser_icon_url_100: '8306bff5753c406a.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 3.3027046e7,
		unique_creatives: 9,
		unique_publishers: 37,
		first_seen: '2025-08-13T05:39:49.237Z',
		last_seen: '2025-08-26T22:45:24.050Z',
		ad_network_domains: '{appodeal.com,digitalturbine.com,google.com,liftoff.io,youappi.com}',
		avg_publisher_installs: 2.5903971657534245e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{42bfb6e090ae822725a0e6fb79545351,ab930b1b5f124f2d00a449831d1843e8,cc33e504efe176ac2ac0baa220ff6bc7,42bfb6e090ae822725a0e6fb79545351,ab930b1b5f124f2d00a449831d1843e8}'
	},
	{
		advertiser_name: 'POP! Slots™',
		advertiser_store_id: 'com.playstudios.popslots',
		advertiser_icon_url_100: 'd17266d94e4c7913.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 2.8871881e7,
		unique_creatives: 12,
		unique_publishers: 34,
		first_seen: '2025-08-05T16:52:50.093Z',
		last_seen: '2025-08-27T16:40:11.401Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 3.855654008695652e7,
		mmp_domains: '{adjust.com,singular.net}',
		top_md5_hashes:
			'{b1e74435aa6cdf4c0511cd13f5b5ee43,e940026b8077e5c6505e55276c2982f3,e940026b8077e5c6505e55276c2982f3,ebcb9caf6b273d0aff7a83e7f04fcd8c,e940026b8077e5c6505e55276c2982f3}'
	},
	{
		advertiser_name: 'Harry Potter: Puzzles & Spells',
		advertiser_store_id: 'com.zynga.pottermatch',
		advertiser_icon_url_100: 'e8eb95154e6cd41a.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 2.2909995e7,
		unique_creatives: 21,
		unique_publishers: 24,
		first_seen: '2025-08-01T19:49:46.511Z',
		last_seen: '2025-08-27T10:29:56.307Z',
		ad_network_domains:
			'{appodeal.com,digitalturbine.com,google.com,liftoff.io,mobvista.com,remerge.io,unity.com}',
		avg_publisher_installs: 2.062843662e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{30cdecc08178b0ce349ee41c15043a17,c455f370dcd18ab3d481baaf3cb2f2bf,37b0029121e90c10b97eac38be65a9d5,5cae2dc1ded9fd2b2bdc24598569fe23,f2fdfe1a4ff2aa16457d35dd82790a83}'
	},
	{
		advertiser_name: 'UNice: Wigs & Hair Bundles',
		advertiser_store_id: 'com.unice.longqihair',
		advertiser_icon_url_100: 'd3c6693d84c1cb96.png',
		advertiser_category: 'shopping',
		advertiser_installs: 356757.0,
		unique_creatives: 17,
		unique_publishers: 23,
		first_seen: '2025-07-31T22:38:43.486Z',
		last_seen: '2025-08-27T23:14:17.289Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1.4628140826923076e7,
		mmp_domains: '{developer.huawei.com}',
		top_md5_hashes:
			'{694c14528735705caea39b7954939080,f4d630692e6fbef71495b1ddbd3ab90a,e2521262d7fbaecd97fc0e031b394545,c3c54e0201f032e167fe62da823a6eba,d30cfd482c442ac720f651093f507a80}'
	},
	{
		advertiser_name: 'OYO: Hotel Booking App',
		advertiser_store_id: 'com.oyo.consumer',
		advertiser_icon_url_100: 'c4ce3b31c4ce3b31.png',
		advertiser_category: 'travel_and_local',
		advertiser_installs: 1.02919593e8,
		unique_creatives: 7,
		unique_publishers: 22,
		first_seen: '2025-08-07T19:36:53.443Z',
		last_seen: '2025-08-26T19:55:15.531Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1.498905041935484e7,
		mmp_domains: '{branch.io,singular.net}',
		top_md5_hashes:
			'{73469758416a2758f095a9972104f89e,73469758416a2758f095a9972104f89e,73e0b060d6078168922d209404f0b40b,bcb5fb209f802f7af36f8e27b6f325aa,bcb5fb209f802f7af36f8e27b6f325aa}'
	},
	{
		advertiser_name: 'Quick Hit Casino Slots Games',
		advertiser_store_id: 'com.ballytechnologies.quickhitslots',
		advertiser_icon_url_100: 'd19b2f193ae564c4.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 2.1033468e7,
		unique_creatives: 13,
		unique_publishers: 20,
		first_seen: '2025-07-31T22:38:43.486Z',
		last_seen: '2025-08-26T18:28:40.060Z',
		ad_network_domains: '{appodeal.com,bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 1.708641228888889e7,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{190008609c368e70fc7d7b25032c2c8b,cbb868ad8c75adec6884cce3b7624f7d,4b9cdfa0fa7522e5493f67e6d0876ad5,4b9cdfa0fa7522e5493f67e6d0876ad5,c4f79cbce00f5dcad6634ce2921ce961}'
	},
	{
		advertiser_name: 'Spades: Classic Card Games',
		advertiser_store_id: 'com.mobilityware.Spades',
		advertiser_icon_url_100: '95c0467b49b6276d.png',
		advertiser_category: 'game_card',
		advertiser_installs: 1.2441918e7,
		unique_creatives: 12,
		unique_publishers: 19,
		first_seen: '2025-08-07T23:00:35.411Z',
		last_seen: '2025-08-26T11:36:28.133Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,liftoff.io,unity.com}',
		avg_publisher_installs: 1.485336247368421e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{34daf506ca61c90ad5d1783e384da850,3df201a4560220e2e20886ecdd847620,7b1088af39e59c86360ea6f046232352,3dbc2955fd3e06c4a0e54d03c362214b,698132292e50a57fbffe357c0c8b8587}'
	},
	{
		advertiser_name: 'Seven Knights Idle Adventure',
		advertiser_store_id: 'com.netmarble.skiagb',
		advertiser_icon_url_100: '88ef2729a132b5d6.png',
		advertiser_category: 'game_casual',
		advertiser_installs: 4565413.0,
		unique_creatives: 10,
		unique_publishers: 17,
		first_seen: '2025-08-01T20:00:10.574Z',
		last_seen: '2025-08-26T08:59:39.207Z',
		ad_network_domains: '{adikteev.com,digitalturbine.com,google.com,mobvista.com}',
		avg_publisher_installs: 9399273.42857143,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{b2d67f34cfaf700165f9d460446cf10e,9d97f3f807eabb1cb92988d5b8b00806,efd459a98238d444d449620878e960a9,9d97f3f807eabb1cb92988d5b8b00806,b2d67f34cfaf700165f9d460446cf10e}'
	},
	{
		advertiser_name: '88 Fortunes Casino Slot Games',
		advertiser_store_id: 'com.ballytechnologies.f88',
		advertiser_icon_url_100: 'c15f2b3538617d94.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 8744554.0,
		unique_creatives: 11,
		unique_publishers: 17,
		first_seen: '2025-08-01T17:23:39.138Z',
		last_seen: '2025-08-25T10:10:40.737Z',
		ad_network_domains: '{appodeal.com,bigabid.com,google.com,unity.com}',
		avg_publisher_installs: 1870002.0,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{193d84098a91a91c08bd21ff2503cf3b,a96107a31748b90ffcb54f54a7b945d5,a96107a31748b90ffcb54f54a7b945d5,8e383570af9533d6efe7eb8b1749a2a2,9b430f0d5a631f726eae018abad966d8}'
	},
	{
		advertiser_name: 'Shopify: Sell online\/in person',
		advertiser_store_id: 'com.shopify.mobile',
		advertiser_icon_url_100: 'c63e39c46693623b.png',
		advertiser_category: 'business',
		advertiser_installs: 2.4125903e7,
		unique_creatives: 13,
		unique_publishers: 15,
		first_seen: '2025-08-05T16:07:56.925Z',
		last_seen: '2025-08-27T22:39:51.773Z',
		ad_network_domains: '{amazonaws.com,appodeal.com,smadex.com}',
		avg_publisher_installs: 1.8687245606060605e7,
		mmp_domains: '{sng.link}',
		top_md5_hashes:
			'{e51b6fc266ce29d1f6060ac3a16395bd,0ee41def2181c9a851e64fa54c807668,a6f62bd5f264eec919a481ce94c65841,8ea6539de038a1fbf928efac0ecf584f,63c2193fc9f505b34370f66d63d1fd7a}'
	},
	{
		advertiser_name: 'Sliding Puzzle: Classic Wood',
		advertiser_store_id: 'com.andreyrebrik.fifteen',
		advertiser_icon_url_100: 'a0daad7a5a2d5a25.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 1441571.0,
		unique_creatives: 6,
		unique_publishers: 15,
		first_seen: '2025-08-02T23:56:05.571Z',
		last_seen: '2025-08-27T09:27:48.660Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 1353689.1875,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{cabb60bf3b311f58986d68daeaac4b66,6dd54845c40c36f834bf2c463539eef0,6dd54845c40c36f834bf2c463539eef0,4954bf85f71f5369a956f50f34d152d5,6dd54845c40c36f834bf2c463539eef0}'
	},
	{
		advertiser_name: 'Jackpot Party Casino Slots',
		advertiser_store_id: 'com.williamsinteractive.jackpotparty',
		advertiser_icon_url_100: '9401f30e7f3ac32b.jpeg',
		advertiser_category: 'game_casino',
		advertiser_installs: 3.266611e7,
		unique_creatives: 7,
		unique_publishers: 13,
		first_seen: '2025-07-31T16:22:52.025Z',
		last_seen: '2025-08-23T13:16:11.925Z',
		ad_network_domains: '{bigabid.com,google.com,liftoff.io,unity.com}',
		avg_publisher_installs: 5513806.411764706,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{7f1b3712a473e5cd48b7c33bc561d399,7f1b3712a473e5cd48b7c33bc561d399,9c1efde1274a95d4da48ebbf23a4f6fd,9f7f0ac6d8fcfdb59ad4c00194150469,6426985750d7683460e259da9c2f06b7}'
	},
	{
		advertiser_name: 'Instacart: Get Food Delivery',
		advertiser_store_id: 'com.instacart.client',
		advertiser_icon_url_100: 'e631cb668d8e8e32.png',
		advertiser_category: 'food_and_drink',
		advertiser_installs: 2.4084071e7,
		unique_creatives: 8,
		unique_publishers: 12,
		first_seen: '2025-08-07T10:24:46.098Z',
		last_seen: '2025-08-26T18:51:52.152Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 2.2663449e7,
		mmp_domains: '{branch.io}',
		top_md5_hashes:
			'{c28cf0c139053b124a5681b0a5088850,c28cf0c139053b124a5681b0a5088850,8f326c33441b8594d15ae2436039b137,9b973bf4fcb5b324851f13d1d4d02849,dfe21cdcb4032aec4e286458f3cbb25f}'
	},
	{
		advertiser_name: 'Fate\/Grand Order (English)',
		advertiser_store_id: 'com.aniplex.fategrandorder.en',
		advertiser_icon_url_100: '8f9ef604e3e0e88c.png',
		advertiser_category: 'game_role_playing',
		advertiser_installs: 4707561.0,
		unique_creatives: 4,
		unique_publishers: 9,
		first_seen: '2025-08-18T05:26:44.645Z',
		last_seen: '2025-08-27T09:19:55.978Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5461720.333333333,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{bcbc54a2c467fbc75806638447b92192,bcbc54a2c467fbc75806638447b92192,bcbc54a2c467fbc75806638447b92192,d8c3e4ca23d54c2fd87d5dab0eaaddf5,2bbfb6921a269a52121dab605dd57219}'
	},
	{
		advertiser_name: 'Mighty Fu Casino Slots Games',
		advertiser_store_id: 'com.productmadness.fafafagold',
		advertiser_icon_url_100: 'd11e69b262bd16c3.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 6140987.0,
		unique_creatives: 9,
		unique_publishers: 9,
		first_seen: '2025-08-07T16:32:07.131Z',
		last_seen: '2025-08-13T07:17:46.144Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 2.919082453125e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{c82dc54d2fb1e05b8ac9d987abc75897,4bfaf61ccfa586d76fe7e42a6a63bc67,2ce72dca9fd9b3ef0e2df6863c667da4,4bfaf61ccfa586d76fe7e42a6a63bc67,4bfaf61ccfa586d76fe7e42a6a63bc67}'
	},
	{
		advertiser_name: 'Slots: Heart of Vegas Casino',
		advertiser_store_id: 'com.productmadness.hovmobile',
		advertiser_icon_url_100: 'd84f5a8f31287764.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 2.3850128e7,
		unique_creatives: 5,
		unique_publishers: 8,
		first_seen: '2025-07-31T19:26:49.340Z',
		last_seen: '2025-08-04T11:30:45.725Z',
		ad_network_domains: '{bigabid.com,google.com,unity.com}',
		avg_publisher_installs: 1834543.6666666667,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{3ba8076f0cb60d135dd1011f3b5382e3,9576b994eed81d1bc3b45546aaf1ea2b,3ba8076f0cb60d135dd1011f3b5382e3,2c9fe8bc22d9bd6e8bf7b925d3beaf09,25524809edd3175c79ef99d8dfcfe857}'
	},
	{
		advertiser_name: 'Zombattle Tank',
		advertiser_store_id: 'zt.zombattle.tank',
		advertiser_icon_url_100: '911c37659c8bda27.png',
		advertiser_category: 'game_casual',
		advertiser_installs: 2298278.0,
		unique_creatives: 9,
		unique_publishers: 7,
		first_seen: '2025-08-03T22:01:10.372Z',
		last_seen: '2025-08-26T04:43:13.775Z',
		ad_network_domains: '{amazonaws.com,appodeal.com,joyy.com,mobvista.com,unity.com}',
		avg_publisher_installs: 7170407.714285715,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{84d54b99e8df5c20bb95047dd62ca1d7,d2c8e8b0919598c3a947dfde36c5b27c,e0c368dc80cf7af269f91151e0bb7f35,c40cd5b98aa02738af7f2f687f6f16a0,e0c368dc80cf7af269f91151e0bb7f35}'
	},
	{
		advertiser_name: 'NewsBreak: Local News & Alerts',
		advertiser_store_id: 'com.particlenews.newsbreak',
		advertiser_icon_url_100: 'b4d9c52e309347d9.png',
		advertiser_category: 'news',
		advertiser_installs: 8.5930953e7,
		unique_creatives: 5,
		unique_publishers: 7,
		first_seen: '2025-08-01T15:52:51.733Z',
		last_seen: '2025-08-29T22:40:08.387Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1.319088725e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{ddd8604c9b8fd9871dda3427182bb7d9,ddd8604c9b8fd9871dda3427182bb7d9,ddd8604c9b8fd9871dda3427182bb7d9,ddd8604c9b8fd9871dda3427182bb7d9,9b193e16c2c1c6def434d02ad426850b}'
	},
	{
		advertiser_name: 'Easy Homescreen',
		advertiser_store_id: 'easy.launcher',
		advertiser_icon_url_100: '879368b7386e91a5.png',
		advertiser_category: 'personalization',
		advertiser_installs: 1.2865428e7,
		unique_creatives: 6,
		unique_publishers: 7,
		first_seen: '2025-08-08T08:34:48.641Z',
		last_seen: '2025-08-30T07:40:50.209Z',
		ad_network_domains: '{amazonaws.com,appodeal.com,google.com,smadex.com}',
		avg_publisher_installs: 1.84390216e7,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{66d37bb6cb4dad5369fe6d63b5a8ae07,66d37bb6cb4dad5369fe6d63b5a8ae07,89a834cf0d2d7f83d6e8ff260d96f6f3,26375f5f9fddda3ad4bfd9564cd0cf2f,567b8300d97b0480d299184eed39deca}'
	},
	{
		advertiser_name: 'Gold Fish Casino Slot Games',
		advertiser_store_id: 'com.williamsinteractive.goldfish',
		advertiser_icon_url_100: '9015bf4b40e47b3d.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 1.3243566e7,
		unique_creatives: 3,
		unique_publishers: 7,
		first_seen: '2025-08-12T05:08:14.600Z',
		last_seen: '2025-08-25T02:30:16.996Z',
		ad_network_domains: '{bigabid.com,google.com,unity.com}',
		avg_publisher_installs: 2.2994762e7,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{7313f98beccb079f8b43d5935cb9d379,7313f98beccb079f8b43d5935cb9d379,159cda0327faa753d532a1d111b9df4d,6c82de1904749a30362a6caf0443943e,159cda0327faa753d532a1d111b9df4d}'
	},
	{
		advertiser_name: 'ABCmouse 2: Kids Learning Game',
		advertiser_store_id: 'com.aofl.abcmouse',
		advertiser_icon_url_100: 'b98e716586c99a9c.png',
		advertiser_category: 'education',
		advertiser_installs: 1576072.0,
		unique_creatives: 1,
		unique_publishers: 7,
		first_seen: '2025-08-03T13:45:20.722Z',
		last_seen: '2025-08-30T03:56:32.926Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4092665.285714286,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{25461562c47fccf3c66055991bcae08a,f441605d34be403a041e454adacec3e5,f441605d34be403a041e454adacec3e5,f441605d34be403a041e454adacec3e5,f441605d34be403a041e454adacec3e5}'
	},
	{
		advertiser_name: 'Cheap Flights & Plane Tickets',
		advertiser_store_id: 'com.flightsbooking.tickets.app',
		advertiser_icon_url_100: '9a18356564ce3b73.png',
		advertiser_category: 'travel_and_local',
		advertiser_installs: 1016337.0,
		unique_creatives: 1,
		unique_publishers: 6,
		first_seen: '2025-08-12T16:18:54.231Z',
		last_seen: '2025-08-14T07:43:52.433Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 7425860.5,
		mmp_domains: '{appmetrica.yandex.com}',
		top_md5_hashes:
			'{693bd8e732640d2cde7b52f338006863,693bd8e732640d2cde7b52f338006863,693bd8e732640d2cde7b52f338006863,693bd8e732640d2cde7b52f338006863,693bd8e732640d2cde7b52f338006863}'
	},
	{
		advertiser_name: 'Little Minds: Kids Game Bundle',
		advertiser_store_id: 'com.tutotoons.app.littleminds.free',
		advertiser_icon_url_100: '912e113e55fdcb42.png',
		advertiser_category: 'game_educational',
		advertiser_installs: 60923.0,
		unique_creatives: 3,
		unique_publishers: 6,
		first_seen: '2025-08-06T10:34:54.467Z',
		last_seen: '2025-08-24T21:15:32.093Z',
		ad_network_domains: '{tutoads.tv}',
		avg_publisher_installs: 4.074463e7,
		mmp_domains: null,
		top_md5_hashes:
			'{e49a53b8cba86ad8572603ec6bdbdc08,194f6bd98b2cd9a92db3b9c4542b4a2c,194f6bd98b2cd9a92db3b9c4542b4a2c,b9c24794a945e4414a6f7a1c924455ac,194f6bd98b2cd9a92db3b9c4542b4a2c}'
	},
	{
		advertiser_name: 'BET+',
		advertiser_store_id: 'com.viacom.betplus',
		advertiser_icon_url_100: 'a93fc6c893c46695.jpeg',
		advertiser_category: 'entertainment',
		advertiser_installs: 8398141.0,
		unique_creatives: 12,
		unique_publishers: 6,
		first_seen: '2025-08-03T17:02:28.030Z',
		last_seen: '2025-08-24T16:21:24.031Z',
		ad_network_domains: '{amazonaws.com,appodeal.com,mobvista.com,smadex.com}',
		avg_publisher_installs: 1299123.4666666666,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{0f0aa969a49c538ef2b08a1c72b3722f,e51b6fc266ce29d1f6060ac3a16395bd,9a00eeb0de5fd8c04b14191426089954,929cc941fad90912c023322abf8bfbbe,d9305c876d8396853f8692ece6b0cced}'
	},
	{
		advertiser_name: 'Gate: Trade BTC & ETH',
		advertiser_store_id: 'com.gateio.gateio',
		advertiser_icon_url_100: 'bc92c369ce243c9b.png',
		advertiser_category: 'finance',
		advertiser_installs: 8618458.0,
		unique_creatives: 4,
		unique_publishers: 6,
		first_seen: '2025-08-05T17:04:52.696Z',
		last_seen: '2025-08-26T02:35:26.357Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 4.4501343833333336e7,
		mmp_domains: '{adjust.com,appsflyer.com}',
		top_md5_hashes:
			'{992800af9bd312c2bccc7138bcea0e99,cb3f9d1e6863913657be98df14d1363d,36d04ce471d33ca946d9eb68df914a07,59a68b4d28b28700ac7423ededd73f9c,da057163d2745d172de926a1cc415f77}'
	},
	{
		advertiser_name: 'Merge Gangster Heist vs Police',
		advertiser_store_id: 'gta.merge.game.gangster',
		advertiser_icon_url_100: 'ad52a5b4ce52c29d.png',
		advertiser_category: 'game_arcade',
		advertiser_installs: 2096760.0,
		unique_creatives: 5,
		unique_publishers: 5,
		first_seen: '2025-08-04T03:28:09.056Z',
		last_seen: '2025-08-14T14:47:04.193Z',
		ad_network_domains: '{amazonaws.com,liftoff.io,mobvista.com,unity.com}',
		avg_publisher_installs: 917004.8,
		mmp_domains: '{adjust.com,appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{a8b64161120ed93145bea869acc75223,1638b882d1038edcdbf3e2934f7228ed,b40673044ed13b1b34005cce86f34b3d,7d5970dbd46de2220b00b416ecc2e747,1dd53e67d3017176ba49cf17f33071c0}'
	},
	{
		advertiser_name: 'Paramount+',
		advertiser_store_id: 'com.cbs.app',
		advertiser_icon_url_100: '91ce6e39e46691c5.png',
		advertiser_category: 'entertainment',
		advertiser_installs: 4.1253555e7,
		unique_creatives: 5,
		unique_publishers: 5,
		first_seen: '2025-08-12T02:14:58.247Z',
		last_seen: '2025-08-18T10:19:50.312Z',
		ad_network_domains: '{adikteev.com,appodeal.com,google.com,liftoff.io,youappi.com}',
		avg_publisher_installs: 2.663369785714286e7,
		mmp_domains: '{branch.io,kochava.com}',
		top_md5_hashes:
			'{cdcdfc892c729df26ae188e76bc5ce41,cdcdfc892c729df26ae188e76bc5ce41,9c3976aee3e71db48ae4ada297009056,220a2de2b2b32879a7d1d906777435d0,c5ae3bbd6926ee4910e7017ce471d956}'
	},
	{
		advertiser_name: 'Lanetalk',
		advertiser_store_id: 'com.lanetalk',
		advertiser_icon_url_100: '93312e9b61e5666c.png',
		advertiser_category: 'sports',
		advertiser_installs: 363501.0,
		unique_creatives: 3,
		unique_publishers: 5,
		first_seen: '2025-08-25T04:27:08.802Z',
		last_seen: '2025-08-26T00:18:42.438Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 6330198.125,
		mmp_domains: '{branch.io}',
		top_md5_hashes:
			'{1c314d0446680f65961432042cc792ba,7985ea139451a96a6781f917ae6676dd,1c314d0446680f65961432042cc792ba,c7dec976347528badc51f40c6ab7b7a5,661f55595438588a61c187342b883a5c}'
	},
	{
		advertiser_name: 'Mystic Glow Live Wallpaper',
		advertiser_store_id: 'mg.mystic.glow.livewallpaper',
		advertiser_icon_url_100: null,
		advertiser_category: 'personalization',
		advertiser_installs: 5295.0,
		unique_creatives: 6,
		unique_publishers: 5,
		first_seen: '2025-08-02T08:47:15.716Z',
		last_seen: '2025-08-03T23:02:47.080Z',
		ad_network_domains: '{appodeal.com,google.com,liftoff.io,mobvista.com,unity.com}',
		avg_publisher_installs: 1993906.5,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{d3fbf092e6d004412a0cd4d3f0e63457,d61545201557c8226ec1a067623a0f46,d7f9ca7875dd1f5da80e32ef17a93268,e51b6fc266ce29d1f6060ac3a16395bd,43d12f40f02c3681455c4db9972c7676}'
	},
	{
		advertiser_name: 'Klondike Solitaire: Classic',
		advertiser_store_id: 'com.andreyrebrik.klondike',
		advertiser_icon_url_100: 'c11e6ce0329f39f1.png',
		advertiser_category: 'game_card',
		advertiser_installs: 1834790.0,
		unique_creatives: 2,
		unique_publishers: 5,
		first_seen: '2025-08-02T18:01:49.913Z',
		last_seen: '2025-08-22T05:06:17.698Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 1.5046564666666666e7,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{b6c113ab428cffca6a875443e2d5e680,5eca3b9278a7d6513e48754c9321266c,c261676d003c5dd770ea9199baadec40,8649899f9ba24184a630185b03f624d5,8649899f9ba24184a630185b03f624d5}'
	},
	{
		advertiser_name: 'Spider Solitaire: Classic',
		advertiser_store_id: 'com.andreyrebrik.spider',
		advertiser_icon_url_100: 'c11e6ce0369b39f1.png',
		advertiser_category: 'game_card',
		advertiser_installs: 1455949.0,
		unique_creatives: 8,
		unique_publishers: 5,
		first_seen: '2025-08-02T18:01:49.913Z',
		last_seen: '2025-08-27T08:54:13.001Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 3038008.2,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{2982debc6bacfcae5e12631d686f19a3,2982debc6bacfcae5e12631d686f19a3,a3a68d69c2ce318072a3492086389e2e,289bed95d715b14a282f8b391deb28ff,5fdd03fd4671e65af177fd1e02c5c06e}'
	},
	{
		advertiser_name: 'Gemstone Surprise block',
		advertiser_store_id: 'com.gems.block.surprise',
		advertiser_icon_url_100: '8d4966f2396233dc.png',
		advertiser_category: 'game_casual',
		advertiser_installs: 3131634.0,
		unique_creatives: 3,
		unique_publishers: 5,
		first_seen: '2025-07-31T22:38:43.486Z',
		last_seen: '2025-08-28T01:52:02.467Z',
		ad_network_domains: '{unity.com}',
		avg_publisher_installs: 1715753.6,
		mmp_domains: null,
		top_md5_hashes:
			'{e7e8c522495454109540ac6da848cb7e,e7e8c522495454109540ac6da848cb7e,913075cf2d7b4951e9e5f6d659e4d113,913075cf2d7b4951e9e5f6d659e4d113,5e884e7491d51465a1557f7eac0bb46c}'
	},
	{
		advertiser_name: 'Cute & Tiny World',
		advertiser_store_id: 'com.cuteandtinybabygames.cutetinyworld',
		advertiser_icon_url_100: 'd59c61f91177440f.png',
		advertiser_category: 'game_educational',
		advertiser_installs: 364863.0,
		unique_creatives: 8,
		unique_publishers: 5,
		first_seen: '2025-08-06T15:03:57.892Z',
		last_seen: '2025-08-23T02:27:50.883Z',
		ad_network_domains: '{tutoads.tv}',
		avg_publisher_installs: 3.294206375e7,
		mmp_domains: null,
		top_md5_hashes:
			'{00305e984eb5a24e3be8d57f0a052ce1,62cde4c8745707a246291bc74653cf43,00305e984eb5a24e3be8d57f0a052ce1,62cde4c8745707a246291bc74653cf43,81216d7663e668250f8b73c73fa6e9e3}'
	},
	{
		advertiser_name: 'Coinbase: Buy BTC, ETH, SOL',
		advertiser_store_id: 'com.coinbase.android',
		advertiser_icon_url_100: 'c3493c93636696da.jpeg',
		advertiser_category: 'finance',
		advertiser_installs: 5.2113455e7,
		unique_creatives: 3,
		unique_publishers: 4,
		first_seen: '2025-08-24T03:12:07.167Z',
		last_seen: '2025-08-24T21:40:57.178Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4830876.2,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{70a5fc1daf4e289bed707cbb07915385,70a5fc1daf4e289bed707cbb07915385,b98b9b5231dbebfb0ceb968ff157ee31,bdb432a024acc300059be974a9e894cf,bdb432a024acc300059be974a9e894cf}'
	},
	{
		advertiser_name: 'Pointee Play',
		advertiser_store_id: 'com.playnovel.pointeeplay',
		advertiser_icon_url_100: '80d57d6b3c4d70a5.png',
		advertiser_category: 'entertainment',
		advertiser_installs: 256363.0,
		unique_creatives: 1,
		unique_publishers: 4,
		first_seen: '2025-08-01T15:48:11.892Z',
		last_seen: '2025-08-08T02:20:44.985Z',
		ad_network_domains: '{google.com,mobvista.com,unity.com}',
		avg_publisher_installs: 4.38237765e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{cd6c193564f8caa70c5d56af00db0446,cd6c193564f8caa70c5d56af00db0446,cd6c193564f8caa70c5d56af00db0446,51080260aee259db1c3e76a33db6be09}'
	},
	{
		advertiser_name: 'Microsoft 365 Copilot',
		advertiser_store_id: 'com.microsoft.office.officehubrow',
		advertiser_icon_url_100: 'e89496639d4b71b4.png',
		advertiser_category: 'productivity',
		advertiser_installs: 1.339219938e9,
		unique_creatives: 2,
		unique_publishers: 4,
		first_seen: '2025-08-15T01:26:23.310Z',
		last_seen: '2025-08-26T04:55:38.983Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4325328.0,
		mmp_domains: null,
		top_md5_hashes:
			'{a998fb9b954df65fc50b779fcaface22,a998fb9b954df65fc50b779fcaface22,9e31d5a9d82c57757f9778217d179a9f,a998fb9b954df65fc50b779fcaface22}'
	},
	{
		advertiser_name: 'TutoFlips - Pet Doll House',
		advertiser_store_id: 'com.tutotoons.app.tutoflips',
		advertiser_icon_url_100: 'e59481db414dd637.png',
		advertiser_category: 'game_educational',
		advertiser_installs: 636545.0,
		unique_creatives: 5,
		unique_publishers: 4,
		first_seen: '2025-08-06T21:06:50.983Z',
		last_seen: '2025-08-24T21:15:32.093Z',
		ad_network_domains: '{tutoads.tv}',
		avg_publisher_installs: 2.1196377e7,
		mmp_domains: '{singular.net}',
		top_md5_hashes:
			'{b019c801453770929c8b9ee0b1604822,ff03dfe02068b5d07594bf36d60ba9d0,62eb58017dd08c148406bdef94d7791b,7cc2c465c33330468368ae18819f0ba0,228bd1cf2cde1fdcbd80d91dc5bc985d}'
	},
	{
		advertiser_name: 'Watcher of Realms',
		advertiser_store_id: 'com.td.watcherofrealms',
		advertiser_icon_url_100: 'dde0230e64da333b.png',
		advertiser_category: 'game_role_playing',
		advertiser_installs: 5707538.0,
		unique_creatives: 5,
		unique_publishers: 4,
		first_seen: '2025-08-25T18:42:59.892Z',
		last_seen: '2025-08-30T00:29:17.614Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 4169704.3333333335,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{390e3b73a1ebb8492bb638a64c3ca67f,b4cbbc0c51bc193647b1944a3ca3ede5,52d9425f2a542dd3334ab71b2812482e,d005b7d6a417f5244f9ae75a899701b8,b4cbbc0c51bc193647b1944a3ca3ede5}'
	},
	{
		advertiser_name: 'Flood-It!',
		advertiser_store_id: 'com.labpixies.flood',
		advertiser_icon_url_100: 'c578856e303e6b27.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 4798858.0,
		unique_creatives: 2,
		unique_publishers: 4,
		first_seen: '2025-08-13T04:47:41.786Z',
		last_seen: '2025-08-27T09:23:29.027Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 3850204.75,
		mmp_domains: null,
		top_md5_hashes:
			'{ded513fe20b0b3d15fc375fefd59e79a,ded513fe20b0b3d15fc375fefd59e79a,6708fd9abe3e1c4d4eb55ef34de0c3dc,ded513fe20b0b3d15fc375fefd59e79a}'
	},
	{
		advertiser_name: 'Duolingo: Language Lessons',
		advertiser_store_id: 'com.duolingo',
		advertiser_icon_url_100: 'b44316b84b96eb3c.png',
		advertiser_category: 'education',
		advertiser_installs: 7.82009224e8,
		unique_creatives: 3,
		unique_publishers: 4,
		first_seen: '2025-08-01T23:12:46.323Z',
		last_seen: '2025-08-25T21:57:47.405Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 7873483.0,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{6b4cdee0ec3b63444d81ad6728e6d635,6b4cdee0ec3b63444d81ad6728e6d635,04dee09fb03ae633c2ae159a3d8d94f3,e9b997b9004c52740049ecbbdab70b7c}'
	},
	{
		advertiser_name: 'Fortune Coins',
		advertiser_store_id: 'com.sgllc.fortunecoins',
		advertiser_icon_url_100: 'c49913674ccf783a.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 64195.0,
		unique_creatives: 3,
		unique_publishers: 4,
		first_seen: '2025-08-01T15:40:46.951Z',
		last_seen: '2025-08-25T10:50:15.945Z',
		ad_network_domains: '{unity.com}',
		avg_publisher_installs: 2.34480895e7,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{1eb11fb1df61522545b672e40cbd7a70,53ec0f5d1ddcbcec89d1cfa961fcf908,1eb11fb1df61522545b672e40cbd7a70,dc7406634471eb6462df1e56c34c551c,dc7406634471eb6462df1e56c34c551c}'
	},
	{
		advertiser_name: 'FreeCell Solitaire: Classic',
		advertiser_store_id: 'com.andreyrebrik.freecell',
		advertiser_icon_url_100: 'c11e6ce0369b39f1.png',
		advertiser_category: 'game_card',
		advertiser_installs: 760107.0,
		unique_creatives: 2,
		unique_publishers: 4,
		first_seen: '2025-08-02T18:01:49.913Z',
		last_seen: '2025-08-24T00:10:28.631Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 1.55887905e7,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{20151c3e934e75632d96932d263c833b,7c1421959c29ea700f961bfbbb28eab7,7c1421959c29ea700f961bfbbb28eab7,7490f776f920de5a2cf571ce98a75b63}'
	},
	{
		advertiser_name: 'Crypto.com: Buy BTC, ETH & CRO',
		advertiser_store_id: 'co.mona.android',
		advertiser_icon_url_100: 'dcf96ae26869a492.jpeg',
		advertiser_category: 'finance',
		advertiser_installs: 4.5649412e7,
		unique_creatives: 3,
		unique_publishers: 3,
		first_seen: '2025-08-29T23:15:34.294Z',
		last_seen: '2025-08-30T01:17:53.458Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 2995175.75,
		mmp_domains: '{appsflyer.com,branch.io}',
		top_md5_hashes:
			'{4f7dfb1c30a59f49b42299a949c95253,5f41c38cc67e97ad224eaea9be72b32a,fd957f0e127049ff7c41d0b74f36bc04,fd957f0e127049ff7c41d0b74f36bc04}'
	},
	{
		advertiser_name: 'Pokémon TCG Pocket - Card Game',
		advertiser_store_id: 'jp.pokemon.pokemontcgp',
		advertiser_icon_url_100: 'fca5808693e69ccd.png',
		advertiser_category: 'game_card',
		advertiser_installs: 4.9668244e7,
		unique_creatives: 2,
		unique_publishers: 3,
		first_seen: '2025-08-29T19:54:31.920Z',
		last_seen: '2025-08-30T03:56:32.926Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 2434009.3333333335,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{e1ba64460d73e6230b338cc64255ea61,8040c02f24e5f12631989aaf1f0cf6d4,b9f571891f19a0b62e181ca518003639}'
	},
	{
		advertiser_name: 'Lobstermania Slots Casino App',
		advertiser_store_id: 'com.ksgmobileinc.lobstermaniaslots',
		advertiser_icon_url_100: 'ca4469433f25b33b.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 327833.0,
		unique_creatives: 3,
		unique_publishers: 3,
		first_seen: '2025-08-01T20:11:49.408Z',
		last_seen: '2025-08-02T14:52:29.438Z',
		ad_network_domains: '{google.com,remerge.io}',
		avg_publisher_installs: 1.0594703e7,
		mmp_domains: '{appsflyer.com,onelink.me}',
		top_md5_hashes:
			'{fb0b13802a6bfe1a9acdffbd9e8d93b3,310f2a4782c54cade9ac01f55b779101,44654e96211665ef2e763e706ed77bb2}'
	}
];

interface ProcessedApp {
	app_name: string;
	store_id: string;
	best_week: string;
	icon_url_100: string;
	weekly_installs: number;
	weekly_percent_increase: number;
	creative_count: number;
	pub_count: number;
	ad_networks: Array<{
		domain: string;
		logo_url: string;
	}>;
	mmp_domains: Set<string>;
	mmps: Array<{
		domain: string;
		logo_url: string;
	}>;
	creatives: Array<{
		md5_hash: string;
		phash: string;
		file_extension: string;
		host_ad_domain: string;
		host_company_logo_url: string;
		initial_ad_domain: string | null;
		initial_company_logo_url: string | null;
	}>;
}

// Map domains to their correct logo URLs
function getLogoUrlForDomain(domain: string): string {
	const domainLowercase = domain.trim().toLowerCase();

	// Special case mappings
	const specialMappings: Record<string, string> = {
		'abr.ge': 'company-logos/airbridge.io/logo_200x200.jpeg'
	};

	if (domainLowercase in specialMappings) {
		return specialMappings[domainLowercase];
	}

	// Default template
	return `company-logos/${domain.trim()}/logo_200x200.jpeg`;
}

function processData(data: AppAdData[]) {
	const appsMap = new Map<string, ProcessedApp>();

	data.forEach((row) => {
		if (!appsMap.has(row.store_id)) {
			appsMap.set(row.store_id, {
				app_name: row.app_name,
				store_id: row.store_id,
				best_week: row.best_week,
				icon_url_100: row.icon_url_100,
				weekly_installs: row.weekly_installs,
				weekly_percent_increase: row.weekly_percent_increase,
				creative_count: 0,
				pub_count: 0,
				ad_networks: [],
				mmp_domains: new Set(),
				mmps: [],
				creatives: []
			});
		}

		const app = appsMap.get(row.store_id)!;
		app.creative_count++;
		app.pub_count += row.pub_count;

		// Add host ad network with logo
		if (row.host_ad_domain && row.host_company_logo_url) {
			const exists = app.ad_networks.some((net) => net.domain === row.host_ad_domain);
			if (!exists) {
				app.ad_networks.push({
					domain: row.host_ad_domain,
					logo_url: row.host_company_logo_url
				});
			}
		}

		// Add initial ad network with logo (if different from host)
		if (
			row.initial_ad_domain &&
			row.initial_company_logo_url &&
			row.initial_ad_domain !== row.host_ad_domain
		) {
			const exists = app.ad_networks.some((net) => net.domain === row.initial_ad_domain);
			if (!exists) {
				app.ad_networks.push({
					domain: row.initial_ad_domain,
					logo_url: row.initial_company_logo_url
				});
			}
		}

		// Parse mmp_domains (PostgreSQL array format: "{domain1,domain2}" or null)
		if (row.mmp_domains) {
			const mmpDomainsArray = row.mmp_domains
				.replace(/^\{|\}$/g, '') // Remove { and }
				.split(',')
				.map((d) => d.trim())
				.filter((d) => d && d.toLowerCase() !== 'null');
			mmpDomainsArray.forEach((domain) => app.mmp_domains.add(domain));
		}

		app.creatives.push({
			md5_hash: row.md5_hash,
			phash: row.phash,
			file_extension: row.file_extension,
			host_ad_domain: row.host_ad_domain,
			host_company_logo_url: row.host_company_logo_url,
			initial_ad_domain: row.initial_ad_domain,
			initial_company_logo_url: row.initial_company_logo_url
		});
	});

	const sortedApps = Array.from(appsMap.values()).sort(
		(a, b) => b.weekly_percent_increase - a.weekly_percent_increase
	);

	// Convert mmp_domains Set to mmps array with logos
	sortedApps.forEach((app) => {
		app.mmps = Array.from(app.mmp_domains).map((domain) => ({
			domain,
			logo_url: getLogoUrlForDomain(domain)
		}));
	});

	return sortedApps;
}

export const load: PageServerLoad = async () => {
	const apps = processData(rawData);

	// Calculate summary statistics
	const totalInstalls = apps.reduce((sum, app) => sum + app.weekly_installs, 0);
	const avgGrowth = apps.reduce((sum, app) => sum + app.weekly_percent_increase, 0) / apps.length;
	const totalCreatives = apps.reduce((sum, app) => sum + app.creative_count, 0);

	const allNetworks = new Set<string>();
	apps.forEach((app) => app.ad_networks.forEach((net) => allNetworks.add(net.domain)));

	const topApps = apps.slice(0, 5);

	// Sort ad networks by publisher count and parse domains
	const adNetworks = [...rawAdNetworkData]
		.sort((a, b) => b.publisher_count - a.publisher_count)
		.map((network) => {
			// Parse PostgreSQL array format for all_domains if it's a string
			let domainsArray: string[] = [];
			if (typeof network.all_domains === 'string') {
				domainsArray = network.all_domains
					.replace(/^\{|\}$/g, '') // Remove { and }
					.split(',')
					.map((d) => d.trim())
					.filter((d) => d && d.toLowerCase() !== 'null');
			} else if (Array.isArray(network.all_domains)) {
				domainsArray = network.all_domains;
			}
			return { ...network, domains: domainsArray };
		});

	// Calculate ad network statistics
	const totalPublishers = adNetworks.reduce((sum, net) => sum + net.publisher_count, 0);
	const totalNetworkCreatives = adNetworks.reduce((sum, net) => sum + net.creatives_count, 0);

	const reachTiers = {
		elite: apps.filter((app) => app.pub_count >= 3),
		wide: apps.filter((app) => app.pub_count >= 2 && app.pub_count < 3),
		targeted: apps.filter((app) => app.pub_count >= 1 && app.pub_count < 2),
		emerging: apps.filter((app) => app.pub_count < 1)
	};

	const reachStats = {
		elite: {
			count: reachTiers.elite.length,
			avgPubCount:
				reachTiers.elite.length > 0
					? Math.round(
							(reachTiers.elite.reduce((sum, app) => sum + app.pub_count, 0) /
								reachTiers.elite.length) *
								10
						) / 10
					: 0,
			totalInstalls: reachTiers.elite.reduce((sum, app) => sum + app.weekly_installs, 0)
		},
		wide: {
			count: reachTiers.wide.length,
			avgPubCount:
				reachTiers.wide.length > 0
					? Math.round(
							(reachTiers.wide.reduce((sum, app) => sum + app.pub_count, 0) /
								reachTiers.wide.length) *
								10
						) / 10
					: 0,
			totalInstalls: reachTiers.wide.reduce((sum, app) => sum + app.weekly_installs, 0)
		},
		targeted: {
			count: reachTiers.targeted.length,
			avgPubCount:
				reachTiers.targeted.length > 0
					? Math.round(
							(reachTiers.targeted.reduce((sum, app) => sum + app.pub_count, 0) /
								reachTiers.targeted.length) *
								10
						) / 10
					: 0,
			totalInstalls: reachTiers.targeted.reduce((sum, app) => sum + app.weekly_installs, 0)
		},
		emerging: {
			count: reachTiers.emerging.length,
			avgPubCount: 0,
			totalInstalls: reachTiers.emerging.reduce((sum, app) => sum + app.weekly_installs, 0)
		}
	};

	// Sort AppReachData by unique_publishers for reach analysis
	// Process to include ad network objects with logo URLs
	const topReachApps = [...AppReachData]
		.sort((a, b) => b.unique_publishers - a.unique_publishers)
		.map((app) => {
			// Parse the PostgreSQL array format string to get domain names
			const domains = app.ad_network_domains
				.replace(/[{}]/g, '')
				.split(',')
				.filter((d) => d && d !== 'NULL');

			// Create network objects with logo URLs
			const networks = domains.map((domain) => ({
				domain: domain.trim(),
				logo_url: `company-logos/${domain.trim()}/logo_200x200.jpeg`
			}));

			// Parse MMP domains if they exist
			let mmps: Array<{ domain: string; logo_url: string }> = [];
			if (app.mmp_domains) {
				const mmpDomains = app.mmp_domains
					.replace(/[{}]/g, '')
					.split(',')
					.filter((d) => d && d !== 'NULL');

				mmps = mmpDomains.map((domain) => ({
					domain: domain.trim(),
					logo_url:
						domain.trim() == 'abr.ge'
							? `company-logos/airbridge.io/logo_200x200.jpeg`
							: `company-logos/${domain.trim()}/logo_200x200.jpeg`
				}));
			}

			return {
				...app,
				ad_networks: networks,
				mmps: mmps
			};
		});

	const exec = rawSummaryData?.[0] ?? null;

	return {
		apps,
		adNetworks,
		popularCreatives: rawMostPopularCreatives,
		reachTiers,
		reachStats,
		appReachData: topReachApps,
		networkStats: {
			totalPublishers,
			totalNetworkCreatives,
			totalNetworks: adNetworks.length
		},
		summary: {
			// Prefer ExecutiveSummaryData when present, with computed fallbacks
			totalApps: exec?.apps_analyzed ?? apps.length,
			totalInstalls,
			avgGrowth: Math.round(avgGrowth * 10) / 10,
			totalCreatives: exec?.creative_count ?? totalCreatives,
			advertisers: exec?.advertisers ?? null,
			adtechCompanies: exec?.adtech_companies ?? null,
			httpsTracked: exec?.https_tracked ?? null,
			apiDomains: exec?.api_domains ?? null,
			uniqueNetworks: allNetworks.size,
			reportPeriod: 'September 2025',
			generatedDate: 'October 2025'
		},
		topApps,
		// Meta Tags
		title: 'User Acquisition Report - September 2025 | AppGoblin',
		description:
			'Discover the fastest-growing apps and their ad strategies. Analyze user acquisition trends, creative performance, and advertising networks.',
		keywords:
			'user acquisition, app marketing, mobile advertising, ad creatives, app growth, install growth'
	};
};
