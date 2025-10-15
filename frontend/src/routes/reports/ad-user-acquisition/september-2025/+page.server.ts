import type { PageServerLoad } from './$types';

interface AppAdData {
	app_name: string;
	store_app: number;
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
	mmp_domain: string | null;
	md5_hash: string;
	pub_count: number;
}

interface AdNetworkData {
	ad_network_name: string;
	ad_network_domain: string;
	company_logo_url: string;
	all_domains: string[] | string;
	domains?: string[]; // Parsed array of domains
	publisher_count: number;
	advertiser_count: number;
	creatives_count: number;
}

const rawMostPopularCreatives = [
	{
		"phash" : "25799add637d",
		"md5_hash" : "db65a4fe0fa935e8a0af9e6e9d944b4a",
		"file_extension" : "mp4",
		"advertiser_count" : 1,
		"publisher_count" : 106,
		"first_seen" : "2025-09-12T22:29:28.685Z",
		"last_seen" : "2025-09-30T15:57:00.715Z",
		"advertiser_store_id" : "com.zhiliaoapp.musically",
		"advertiser_icon_url_100" : "d93b2ee16686303e.png"
	},
	{
		"phash" : "7d073f2bfe38",
		"md5_hash" : "24783926a4d0a8e73ac23d40ed447541",
		"file_extension" : "webm",
		"advertiser_count" : 1,
		"publisher_count" : 63,
		"first_seen" : "2025-09-12T19:58:16.415Z",
		"last_seen" : "2025-09-30T10:51:17.302Z",
		"advertiser_store_id" : "com.zhiliaoapp.musically",
		"advertiser_icon_url_100" : "d93b2ee16686303e.png"
	},
	{
		"phash" : "66f7fd7eb0b8",
		"md5_hash" : "2586ad4d72d121d87da31bfb78e37f3d",
		"file_extension" : "webm",
		"advertiser_count" : 1,
		"publisher_count" : 15,
		"first_seen" : "2025-09-01T14:29:03.380Z",
		"last_seen" : "2025-09-28T11:23:27.409Z",
		"advertiser_store_id" : "com.microsoft.copilot",
		"advertiser_icon_url_100" : "ec3496cbc9393626.png"
	},
	{
		"phash" : "7b75d406849f",
		"md5_hash" : "de5a3a61bd3fad55508595520606bd25",
		"file_extension" : "mp4",
		"advertiser_count" : 1,
		"publisher_count" : 13,
		"first_seen" : "2025-09-03T02:35:14.804Z",
		"last_seen" : "2025-09-30T09:46:43.651Z",
		"advertiser_store_id" : "com.niuaigo.solitaire.klondike",
		"advertiser_icon_url_100" : "d041663f1d3b0be6.png"
	},
	{
		"phash" : "6bf16f58bdad",
		"md5_hash" : "dfbd592144f10681d45935fda973a215",
		"file_extension" : "mp4",
		"advertiser_count" : 1,
		"publisher_count" : 10,
		"first_seen" : "2025-09-28T19:42:41.737Z",
		"last_seen" : "2025-09-28T23:57:49.687Z",
		"advertiser_store_id" : "com.find.hint.pnone.smartdevices",
		"advertiser_icon_url_100" : "87c9bc94c743cd38.png"
	},
	{
		"phash" : "e67a37c3dba6",
		"md5_hash" : "91953a6647b6fa5998e75bfb74063c53",
		"file_extension" : "mp4",
		"advertiser_count" : 1,
		"publisher_count" : 7,
		"first_seen" : "2025-09-29T00:54:18.249Z",
		"last_seen" : "2025-09-29T09:20:07.534Z",
		"advertiser_store_id" : "com.energy.flashe.neow",
		"advertiser_icon_url_100" : "ce9871e71c31c798.png"
	},
	{
		"phash" : "9f5d71fd2ee7",
		"md5_hash" : "41cfebce96cd143e02916e3e64c11ce7",
		"file_extension" : "mp4",
		"advertiser_count" : 1,
		"publisher_count" : 6,
		"first_seen" : "2025-09-05T09:24:37.424Z",
		"last_seen" : "2025-09-28T22:22:08.048Z",
		"advertiser_store_id" : "com.aofl.abcmouse",
		"advertiser_icon_url_100" : "b98e716586c99a9c.png"
	},
	{
		"phash" : "ecd7b9b774b7",
		"md5_hash" : "71bd3125f6455f5501b88f1958a187b8",
		"file_extension" : "mp4",
		"advertiser_count" : 1,
		"publisher_count" : 6,
		"first_seen" : "2025-09-28T16:33:13.477Z",
		"last_seen" : "2025-09-29T17:05:00.035Z",
		"advertiser_store_id" : "com.clap.track.sadif",
		"advertiser_icon_url_100" : "9d4ee6396830cc9e.jpeg"
	},
	{
		"phash" : "66ba3be21fad",
		"md5_hash" : "2280989f1f08c4d279e4b76678fae17f",
		"file_extension" : "webm",
		"advertiser_count" : 1,
		"publisher_count" : 5,
		"first_seen" : "2025-09-28T19:52:57.538Z",
		"last_seen" : "2025-09-28T20:00:37.106Z",
		"advertiser_store_id" : "glowingeye.mexican_train_dominoes_classic",
		"advertiser_icon_url_100" : "95506e6f6ae19598.png"
	},
	{
		"phash" : "095cfbb7b363",
		"md5_hash" : "d73782df24183fcb04e670b1616224ea",
		"file_extension" : "webm",
		"advertiser_count" : 1,
		"publisher_count" : 5,
		"first_seen" : "2025-09-04T16:06:48.579Z",
		"last_seen" : "2025-09-30T02:16:11.651Z",
		"advertiser_store_id" : "com.nintendo.zasa",
		"advertiser_icon_url_100" : "978f2fc9446478d8.png"
	}
];

const rawAdNetworkData: AdNetworkData[] = [
	{
		"ad_network_name" : "Google",
		"ad_network_domain" : "google.com",
		"all_domains" : "{google.com}",
		"company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"publisher_count" : 1323,
		"advertiser_count" : 1052,
		"creatives_count" : 1247
	},
	{
		"ad_network_name" : "Mobvista",
		"ad_network_domain" : "mobvista.com",
		"all_domains" : "{mintegral.com}",
		"company_logo_url" : "company-logos\/mobvista.com\/logo_200x200.jpeg",
		"publisher_count" : 171,
		"advertiser_count" : 69,
		"creatives_count" : 171
	},
	{
		"ad_network_name" : "AppLovin",
		"ad_network_domain" : "applovin.com",
		"all_domains" : "{applovin.com}",
		"company_logo_url" : "company-logos\/applovin.com\/logo_200x200.jpeg",
		"publisher_count" : 141,
		"advertiser_count" : 0,
		"creatives_count" : 209
	},
	{
		"ad_network_name" : "Unity",
		"ad_network_domain" : "unity.com",
		"all_domains" : "{unity.com,unity3d.com}",
		"company_logo_url" : "company-logos\/unity.com\/logo_200x200.jpeg",
		"publisher_count" : 106,
		"advertiser_count" : 76,
		"creatives_count" : 154
	},
	{
		"ad_network_name" : "RTB House",
		"ad_network_domain" : "rtbhouse.com",
		"all_domains" : "{rtbhouse.com}",
		"company_logo_url" : "company-logos\/rtbhouse.com\/logo_200x200.jpeg",
		"publisher_count" : 94,
		"advertiser_count" : 0,
		"creatives_count" : 6
	},
	{
		"ad_network_name" : "Yandex",
		"ad_network_domain" : "yandex.com",
		"all_domains" : "{yandex.com}",
		"company_logo_url" : "company-logos\/yandex.com\/logo_200x200.jpeg",
		"publisher_count" : 87,
		"advertiser_count" : 52,
		"creatives_count" : 190
	},
	{
		"ad_network_name" : "Adikteev",
		"ad_network_domain" : "adikteev.com",
		"all_domains" : "{adikteev.com}",
		"company_logo_url" : "company-logos\/adikteev.com\/logo_200x200.jpeg",
		"publisher_count" : 44,
		"advertiser_count" : 1,
		"creatives_count" : 15
	},
	{
		"ad_network_name" : "Criteo",
		"ad_network_domain" : "criteo.com",
		"all_domains" : "{criteo.com}",
		"company_logo_url" : "company-logos\/criteo.com\/logo_200x200.jpeg",
		"publisher_count" : 41,
		"advertiser_count" : 33,
		"creatives_count" : 39
	},
	{
		"ad_network_name" : "Appodeal",
		"ad_network_domain" : "appodeal.com",
		"all_domains" : "{appodeal.com,bidmachine.io}",
		"company_logo_url" : "company-logos\/appodeal.com\/logo_200x200.jpeg",
		"publisher_count" : 37,
		"advertiser_count" : 34,
		"creatives_count" : 38
	},
	{
		"ad_network_name" : "Digital Turbine",
		"ad_network_domain" : "digitalturbine.com",
		"all_domains" : "{adcolony.com,appreciate.mobi,fyber.com}",
		"company_logo_url" : "company-logos\/digitalturbine.com\/logo_200x200.jpeg",
		"publisher_count" : 35,
		"advertiser_count" : 41,
		"creatives_count" : 37
	}
];

const rawData: AppAdData[] = [
	{
		"app_name" : "Crypto.com: Buy BTC, ETH & CRO",
		"store_app" : 631294,
		"store_id" : "co.mona.android",
		"icon_url_100" : "dcf96ae26869a492.jpeg",
		"weekly_installs" : 176688,
		"weekly_percent_increase" : 127.230988849878,
		"phash" : "877867ce38679895",
		"file_extension" : "mp4",
		"host_ad_domain" : "google.com",
		"host_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "google.com",
		"initial_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "fd957f0e127049ff7c41d0b74f36bc04",
		"pub_count" : 2
	},
	{
		"app_name" : "Crypto.com: Buy BTC, ETH & CRO",
		"store_app" : 631294,
		"store_id" : "co.mona.android",
		"icon_url_100" : "dcf96ae26869a492.jpeg",
		"weekly_installs" : 176688,
		"weekly_percent_increase" : 127.230988849878,
		"phash" : "96b3db74cfef7d97",
		"file_extension" : "mp4",
		"host_ad_domain" : "google.com",
		"host_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "google.com",
		"initial_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "fd957f0e127049ff7c41d0b74f36bc04",
		"pub_count" : 1
	},
	{
		"app_name" : "Crypto.com: Buy BTC, ETH & CRO",
		"store_app" : 631294,
		"store_id" : "co.mona.android",
		"icon_url_100" : "dcf96ae26869a492.jpeg",
		"weekly_installs" : 176688,
		"weekly_percent_increase" : 127.230988849878,
		"phash" : "b890c72fcdee8819",
		"file_extension" : "jpeg",
		"host_ad_domain" : "google.com",
		"host_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "google.com",
		"initial_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "fd957f0e127049ff7c41d0b74f36bc04",
		"pub_count" : 1
	},
	{
		"app_name" : "CallApp: Caller ID & Block",
		"store_app" : 624183,
		"store_id" : "com.callapp.contacts",
		"icon_url_100" : "eb32b44cc3989e33.png",
		"weekly_installs" : 2175912,
		"weekly_percent_increase" : 103.659085612345,
		"phash" : "98536d1c1eed9649",
		"file_extension" : "png",
		"host_ad_domain" : "bidease.com",
		"host_company_logo_url" : "company-logos\/bidease.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "bidmachine.io",
		"initial_company_logo_url" : "company-logos\/bidmachine.io\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "77399e61d8cd23c012d04bacf935a590",
		"pub_count" : 1
	},
	{
		"app_name" : "Fetch: America’s Rewards App",
		"store_app" : 578834,
		"store_id" : "com.fetchrewards.fetchrewards.hop",
		"icon_url_100" : "bf3d6868873d60c1.png",
		"weekly_installs" : 114124,
		"weekly_percent_increase" : 100.922535211268,
		"phash" : "e7da3de5502d5212",
		"file_extension" : "jpeg",
		"host_ad_domain" : "appier.com",
		"host_company_logo_url" : "company-logos\/appier.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "google.com",
		"initial_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "3652dc0266c56bfb49afd02f59776651",
		"pub_count" : 1
	},
	{
		"app_name" : "Solitaire - Classic Card Games",
		"store_app" : 725403,
		"store_id" : "beetles.puzzle.solitaire",
		"icon_url_100" : "85e4641f4b3b194f.png",
		"weekly_installs" : 120744,
		"weekly_percent_increase" : 31.056153432865,
		"phash" : "85e4741f433b194f",
		"file_extension" : "png",
		"host_ad_domain" : "moloco.com",
		"host_company_logo_url" : "company-logos\/moloco.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "google.com",
		"initial_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "63f90efce09e010086ac27da69008034",
		"pub_count" : 1
	},
	{
		"app_name" : "Solitaire - Classic Card Games",
		"store_app" : 725403,
		"store_id" : "beetles.puzzle.solitaire",
		"icon_url_100" : "85e4641f4b3b194f.png",
		"weekly_installs" : 120744,
		"weekly_percent_increase" : 31.056153432865,
		"phash" : "9ec76c3019cf3299",
		"file_extension" : "jpeg",
		"host_ad_domain" : "moloco.com",
		"host_company_logo_url" : "company-logos\/moloco.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "google.com",
		"initial_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "63f90efce09e010086ac27da69008034",
		"pub_count" : 1
	},
	{
		"app_name" : "Starbucks",
		"store_app" : 644243,
		"store_id" : "com.starbucks.mobilecard",
		"icon_url_100" : "ce3e1146ec7133c6.png",
		"weekly_installs" : 74483,
		"weekly_percent_increase" : 16.5536073359466,
		"phash" : "ddc7cb58c31438c3",
		"file_extension" : "jpeg",
		"host_ad_domain" : "appreciate.mobi",
		"host_company_logo_url" : "company-logos\/appreciate.mobi\/logo_200x200.jpeg",
		"initial_ad_domain" : "fyber.com",
		"initial_company_logo_url" : "company-logos\/fyber.com\/logo_200x200.jpeg",
		"mmp_domain" : "branch.io",
		"md5_hash" : "a0a94dc6221db759a47a89eebc1130f5",
		"pub_count" : 1
	},
	{
		"app_name" : "Yelp: Food, Delivery & Reviews",
		"store_app" : 704177,
		"store_id" : "com.yelp.android",
		"icon_url_100" : "8ecd6c937394384d.png",
		"weekly_installs" : 69028,
		"weekly_percent_increase" : 5.28419013628009,
		"phash" : "e09dc6e3ad32698c",
		"file_extension" : "jpeg",
		"host_ad_domain" : "google.com",
		"host_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"initial_ad_domain" : "google.com",
		"initial_company_logo_url" : "company-logos\/google.com\/logo_200x200.jpeg",
		"mmp_domain" : null,
		"md5_hash" : "77d2edf1c5ff577c0b9e9e1c57819cb7",
		"pub_count" : 1
	}
	
];

const AppReachData = [
	{
		"advertiser_name" : "TikTok - Videos, Shop & LIVE",
		"advertiser_store_id" : "com.zhiliaoapp.musically",
		"advertiser_icon_url_100" : "d93b2ee16686303e.png",
		"advertiser_category" : "social networking",
		"advertiser_installs" : 3.937680122E9,
		"unique_creatives" : 149,
		"unique_publishers" : 519,
		"first_seen" : "2025-09-12T19:58:16.415Z",
		"last_seen" : "2025-09-30T15:57:00.715Z",
		"ad_network_domains" : "{google.com,unity.com}",
		"avg_publisher_installs" : 3.082030921920668E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{b5da6ddb8fad23ac2c438c802b475ad9,db65a4fe0fa935e8a0af9e6e9d944b4a,762b82fbfab4167d87ea5225add87fd9,92f313e2026499e72ac84d5ee3b9eb08,624b8688df9e74aadc2bc758409bcf48}"
	},
	{
		"advertiser_name" : "Ibotta: Save & Earn Cash Back",
		"advertiser_store_id" : "com.ibotta.android",
		"advertiser_icon_url_100" : "c14d7ab7349a986c.png",
		"advertiser_category" : "shopping",
		"advertiser_installs" : 2.2867417E7,
		"unique_creatives" : 10,
		"unique_publishers" : 23,
		"first_seen" : "2025-09-15T00:27:25.200Z",
		"last_seen" : "2025-09-30T12:07:23.235Z",
		"ad_network_domains" : "{adikteev.com,appodeal.com,digitalturbine.com,google.com}",
		"avg_publisher_installs" : 1.6983070566666666E7,
		"mmp_domains" : "{appsflyer.com}",
		"top_md5_hashes" : "{372b8bfcb0b5cebdddd95c840dbed532,6d77ec6215ab159fa347ea22f90ddebf,6d77ec6215ab159fa347ea22f90ddebf,4c92b81450fb3283f35d290b8e40d1c5,4c92b81450fb3283f35d290b8e40d1c5}"
	},
	{
		"advertiser_name" : "​​Microsoft Copilot",
		"advertiser_store_id" : "com.microsoft.copilot",
		"advertiser_icon_url_100" : "ec3496cbc9393626.png",
		"advertiser_category" : "productivity",
		"advertiser_installs" : 4.5134163E7,
		"unique_creatives" : 3,
		"unique_publishers" : 18,
		"first_seen" : "2025-09-01T14:29:03.380Z",
		"last_seen" : "2025-09-28T11:23:27.409Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 2.1128520208333332E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{3cde0691732b94fc87593cc60a2356cc,3cde0691732b94fc87593cc60a2356cc,3cde0691732b94fc87593cc60a2356cc,3cde0691732b94fc87593cc60a2356cc,3cde0691732b94fc87593cc60a2356cc}"
	},
	{
		"advertiser_name" : "Solitaire Classic: Card Game",
		"advertiser_store_id" : "com.niuaigo.solitaire.klondike",
		"advertiser_icon_url_100" : "d041663f1d3b0be6.png",
		"advertiser_category" : "game_puzzle",
		"advertiser_installs" : 1662957.0,
		"unique_creatives" : 3,
		"unique_publishers" : 17,
		"first_seen" : "2025-09-03T02:35:14.804Z",
		"last_seen" : "2025-09-30T09:46:43.651Z",
		"ad_network_domains" : "{unity.com}",
		"avg_publisher_installs" : 4381028.05882353,
		"mmp_domains" : null,
		"top_md5_hashes" : "{de5a3a61bd3fad55508595520606bd25,de5a3a61bd3fad55508595520606bd25,de5a3a61bd3fad55508595520606bd25,de5a3a61bd3fad55508595520606bd25,de5a3a61bd3fad55508595520606bd25}"
	},
	{
		"advertiser_name" : "NeoFlash",
		"advertiser_store_id" : "com.energy.flashe.neow",
		"advertiser_icon_url_100" : "ce9871e71c31c798.png",
		"advertiser_category" : "tools",
		"advertiser_installs" : 29334.0,
		"unique_creatives" : 7,
		"unique_publishers" : 16,
		"first_seen" : "2025-09-29T00:54:18.249Z",
		"last_seen" : "2025-09-29T15:29:50.951Z",
		"ad_network_domains" : "{appodeal.com,google.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 1.4809190695652174E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{43882e061c3a1269759a2ea7e1cf2ea4,227fdf9cd1c7bf71131979b41936bd7c,91953a6647b6fa5998e75bfb74063c53,91953a6647b6fa5998e75bfb74063c53,91953a6647b6fa5998e75bfb74063c53}"
	},
	{
		"advertiser_name" : "Hand Clap Track",
		"advertiser_store_id" : "com.clap.track.sadif",
		"advertiser_icon_url_100" : "9d4ee6396830cc9e.jpeg",
		"advertiser_category" : "tools",
		"advertiser_installs" : 108562.0,
		"unique_creatives" : 6,
		"unique_publishers" : 14,
		"first_seen" : "2025-09-28T16:33:13.477Z",
		"last_seen" : "2025-09-29T17:05:00.035Z",
		"ad_network_domains" : "{google.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 1.638234992857143E7,
		"mmp_domains" : "{adjust.com}",
		"top_md5_hashes" : "{033d6be7d15da54530c5ccf16c1d6d2a,14c73da15358e3efad2395f7c2745c5f,d6a9511a8edb6c1d2145f1b4103b926d,d6a9511a8edb6c1d2145f1b4103b926d,033d6be7d15da54530c5ccf16c1d6d2a}"
	},
	{
		"advertiser_name" : "Phone Whisperer",
		"advertiser_store_id" : "com.find.hint.pnone.smartdevices",
		"advertiser_icon_url_100" : "87c9bc94c743cd38.png",
		"advertiser_category" : "tools",
		"advertiser_installs" : 137622.0,
		"unique_creatives" : 3,
		"unique_publishers" : 11,
		"first_seen" : "2025-09-28T19:42:41.737Z",
		"last_seen" : "2025-09-28T23:57:49.687Z",
		"ad_network_domains" : "{amazonaws.com,appodeal.com,google.com,mobvista.com}",
		"avg_publisher_installs" : 3.0356916133333333E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{994216a75a3e6c60bf3f7bf1a18be0ea,994216a75a3e6c60bf3f7bf1a18be0ea,994216a75a3e6c60bf3f7bf1a18be0ea,994216a75a3e6c60bf3f7bf1a18be0ea,994216a75a3e6c60bf3f7bf1a18be0ea}"
	},
	{
		"advertiser_name" : "Gocrypto: Crypto Trading",
		"advertiser_store_id" : "academy.gocrypto.trading",
		"advertiser_icon_url_100" : "c5996f6690994f62.png",
		"advertiser_category" : "business",
		"advertiser_installs" : 1.6087108E7,
		"unique_creatives" : 1,
		"unique_publishers" : 10,
		"first_seen" : "2025-09-18T14:24:50.534Z",
		"last_seen" : "2025-09-29T16:56:38.066Z",
		"ad_network_domains" : "{amazonaws.com,mobvista.com}",
		"avg_publisher_installs" : 1.24361365E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{4138f5669cab3cb1e4e2b69dee2df089,4138f5669cab3cb1e4e2b69dee2df089,4138f5669cab3cb1e4e2b69dee2df089,4138f5669cab3cb1e4e2b69dee2df089,4138f5669cab3cb1e4e2b69dee2df089}"
	},
	{
		"advertiser_name" : "ABCmouse 2: Kids Learning Game",
		"advertiser_store_id" : "com.aofl.abcmouse",
		"advertiser_icon_url_100" : "b98e716586c99a9c.png",
		"advertiser_category" : "education",
		"advertiser_installs" : 1525983.0,
		"unique_creatives" : 4,
		"unique_publishers" : 10,
		"first_seen" : "2025-09-05T09:24:37.424Z",
		"last_seen" : "2025-09-29T16:23:49.251Z",
		"ad_network_domains" : "{google.com,unity.com}",
		"avg_publisher_installs" : 1.5700621E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{133c8ff7b33778f5e4f6dc3d12c66697,5903da4f93bd41607577ada5053f5c5e,5903da4f93bd41607577ada5053f5c5e,5903da4f93bd41607577ada5053f5c5e,df9400f4bc9215768a0c4f08c2c698ce}"
	},
	{
		"advertiser_name" : "BandLab – Music Making Studio",
		"advertiser_store_id" : "com.bandlab.bandlab",
		"advertiser_icon_url_100" : "c42c2ee7319b666c.png",
		"advertiser_category" : "music_and_audio",
		"advertiser_installs" : 1.1380289E8,
		"unique_creatives" : 7,
		"unique_publishers" : 9,
		"first_seen" : "2025-09-17T18:55:24.482Z",
		"last_seen" : "2025-09-30T05:25:54.170Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 1.9736447266666666E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{0e660bb57d173523f152ed53740069c8,3cc504a5c064979c78061df7c7233e0b,3cc504a5c064979c78061df7c7233e0b,0e660bb57d173523f152ed53740069c8,5e01b35bd3bd711e0346ebb864a27e8d}"
	},
	{
		"advertiser_name" : "Fluvsies x Miraculous Ladybug",
		"advertiser_store_id" : "com.tutotoons.app.fluvsies.free",
		"advertiser_icon_url_100" : "ca1847fb24bec12d.png",
		"advertiser_category" : "game_educational",
		"advertiser_installs" : 1.16724368E8,
		"unique_creatives" : 7,
		"unique_publishers" : 8,
		"first_seen" : "2025-09-12T19:55:51.299Z",
		"last_seen" : "2025-09-30T01:55:12.133Z",
		"ad_network_domains" : "{tutoads.tv}",
		"avg_publisher_installs" : 2.3668637083333332E7,
		"mmp_domains" : "{sng.link}",
		"top_md5_hashes" : "{941f3c40a05705e5ebcc477c0a3b5daa,1a36b72f03c2b905113667ba8736ec0c,cb6e9fde1082c6162f3c92dc3c2007a7,8f6c0ad76d98e8989fc612e29e1aeed8,941f3c40a05705e5ebcc477c0a3b5daa}"
	},
	{
		"advertiser_name" : "Sliding Puzzle: Classic Wood",
		"advertiser_store_id" : "com.andreyrebrik.fifteen",
		"advertiser_icon_url_100" : "a0daad7a5a2d5a25.png",
		"advertiser_category" : "game_puzzle",
		"advertiser_installs" : 1438898.0,
		"unique_creatives" : 7,
		"unique_publishers" : 8,
		"first_seen" : "2025-09-28T14:23:46.540Z",
		"last_seen" : "2025-09-29T00:54:18.249Z",
		"ad_network_domains" : "{yandex.com}",
		"avg_publisher_installs" : 3.88045200952381E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{6dd54845c40c36f834bf2c463539eef0,5cefdc6f7860bbffd6f2047a013806e0,c84ca245b1c844c92afa77840fadc265,6dd54845c40c36f834bf2c463539eef0,6dd54845c40c36f834bf2c463539eef0}"
	},
	{
		"advertiser_name" : "BTR Voice Changer",
		"advertiser_store_id" : "com.btrchanger.voice",
		"advertiser_icon_url_100" : "f6e5918996666b28.png",
		"advertiser_category" : "tools",
		"advertiser_installs" : 21984.0,
		"unique_creatives" : 9,
		"unique_publishers" : 8,
		"first_seen" : "2025-09-16T09:16:45.466Z",
		"last_seen" : "2025-09-29T19:20:10.522Z",
		"ad_network_domains" : "{appodeal.com,digitalturbine.com,google.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 1.864172964285714E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{0dfa969d9ccb3d6a84d4cb5443d0e4ee,03dc77723ba9b0f6c5dd344fd8e65579,e51b6fc266ce29d1f6060ac3a16395bd,dd9f96b577080d8ee4e1defa784ecf27,03dc77723ba9b0f6c5dd344fd8e65579}"
	},
	{
		"advertiser_name" : "FlashSnap",
		"advertiser_store_id" : "com.names.snapsfalsh",
		"advertiser_icon_url_100" : "919b6e6639393133.png",
		"advertiser_category" : "tools",
		"advertiser_installs" : 16075.0,
		"unique_creatives" : 5,
		"unique_publishers" : 7,
		"first_seen" : "2025-09-28T21:57:53.791Z",
		"last_seen" : "2025-09-29T09:09:17.895Z",
		"ad_network_domains" : "{appodeal.com,google.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 2.442710809090909E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{9c6ac048b28d719f204e3690725545a4,e731f0d0d429e5baa278fd11517c0bc2,ee7e92dd3ad40924984c943ec239695e,9c6ac048b28d719f204e3690725545a4,e51b6fc266ce29d1f6060ac3a16395bd}"
	},
	{
		"advertiser_name" : "Рассвет Магии: Истоки Силы",
		"advertiser_store_id" : "com.mdsj.gamegpvk",
		"advertiser_icon_url_100" : "9d9466ab5a6449ea.png",
		"advertiser_category" : "game_role_playing",
		"advertiser_installs" : 82604.0,
		"unique_creatives" : 10,
		"unique_publishers" : 7,
		"first_seen" : "2025-09-12T22:14:01.843Z",
		"last_seen" : "2025-09-21T14:31:37.143Z",
		"ad_network_domains" : "{yandex.com}",
		"avg_publisher_installs" : 7421794.9,
		"mmp_domains" : null,
		"top_md5_hashes" : "{7d43a59d5eb35fa3d9ac0d3b583494bd,2dcc38e1462fd8042d55ea97c4b36b3c,2dcc38e1462fd8042d55ea97c4b36b3c,1f3b022f989ac0bdcac65b0ff53bc1bc,2dcc38e1462fd8042d55ea97c4b36b3c}"
	},
	{
		"advertiser_name" : "Easy Homescreen",
		"advertiser_store_id" : "easy.launcher",
		"advertiser_icon_url_100" : "879368b7386e91a5.png",
		"advertiser_category" : "personalization",
		"advertiser_installs" : 1.2801662E7,
		"unique_creatives" : 6,
		"unique_publishers" : 7,
		"first_seen" : "2025-09-01T05:38:20.917Z",
		"last_seen" : "2025-09-29T00:07:39.324Z",
		"ad_network_domains" : "{appodeal.com,google.com,smadex.com}",
		"avg_publisher_installs" : 4062163.1818181816,
		"mmp_domains" : "{adjust.com}",
		"top_md5_hashes" : "{ad0718d8d79b4672d53d13018929d712,9be9dab37860067727b363c0eebd8d4c,66d37bb6cb4dad5369fe6d63b5a8ae07,66d37bb6cb4dad5369fe6d63b5a8ae07,1c8db5d5680c539c919289123037e613}"
	},
	{
		"advertiser_name" : "Nomad Life",
		"advertiser_store_id" : "com.nomad.aw",
		"advertiser_icon_url_100" : "8f34d0cde427331b.jpeg",
		"advertiser_category" : "travel_and_local",
		"advertiser_installs" : 7481.0,
		"unique_creatives" : 8,
		"unique_publishers" : 7,
		"first_seen" : "2025-09-26T04:00:05.854Z",
		"last_seen" : "2025-09-29T19:57:54.834Z",
		"ad_network_domains" : "{yandex.com}",
		"avg_publisher_installs" : 2.01511995E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{064b03a9055a0fa4ba724d75057eaedc,973c9b155b202c97fc0348a59102c60e,761183a97d6c28012fbb25b2f4f1e869,973c9b155b202c97fc0348a59102c60e,84170a5e032c87280a84444f50e00a92}"
	},
	{
		"advertiser_name" : "Swagbucks Play Games + Surveys",
		"advertiser_store_id" : "com.prodege.swagbucksmobile",
		"advertiser_icon_url_100" : "c44d6f92b064676d.jpeg",
		"advertiser_category" : "lifestyle",
		"advertiser_installs" : 1.4082865E7,
		"unique_creatives" : 2,
		"unique_publishers" : 6,
		"first_seen" : "2025-09-01T11:00:02.712Z",
		"last_seen" : "2025-09-20T00:55:37.030Z",
		"ad_network_domains" : "{digitalturbine.com,mobvista.com,smadex.com}",
		"avg_publisher_installs" : 852582.1666666666,
		"mmp_domains" : null,
		"top_md5_hashes" : "{3f264d4a0ed78e928b61c01c992484a2,44f36095e6c4506a66cba39ccc5825b6,3f264d4a0ed78e928b61c01c992484a2,3f264d4a0ed78e928b61c01c992484a2,3f264d4a0ed78e928b61c01c992484a2}"
	},
	{
		"advertiser_name" : "Amy Care - My Leopard Baby",
		"advertiser_store_id" : "com.tutotoons.app.amycare",
		"advertiser_icon_url_100" : "e93cc3d2954bd289.png",
		"advertiser_category" : "game_educational",
		"advertiser_installs" : 1.001299E7,
		"unique_creatives" : 6,
		"unique_publishers" : 6,
		"first_seen" : "2025-09-27T13:50:10.458Z",
		"last_seen" : "2025-09-29T10:43:49.539Z",
		"ad_network_domains" : "{tutoads.tv}",
		"avg_publisher_installs" : 2.03170685E7,
		"mmp_domains" : "{sng.link}",
		"top_md5_hashes" : "{234f5a85ca599ef636e7a15f579b6a5d,e6aaf3fdba84a7d358553c0536a380cb,dec2a78c09c092ab778728cab292a84b,6f1454197aa3ac3fc15751fc24a8074f,e6aaf3fdba84a7d358553c0536a380cb}"
	},
	{
		"advertiser_name" : "Pool Tour - Pocket Billiards",
		"advertiser_store_id" : "com.qs.pool",
		"advertiser_icon_url_100" : "f0b596631c4f4d62.png",
		"advertiser_category" : "game_sports",
		"advertiser_installs" : 7873311.0,
		"unique_creatives" : 4,
		"unique_publishers" : 6,
		"first_seen" : "2025-09-04T14:55:34.970Z",
		"last_seen" : "2025-09-21T16:12:40.502Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 2498531.1818181816,
		"mmp_domains" : null,
		"top_md5_hashes" : "{9da050d494702ce73564468d881856bf,2d4c0738ccca1709a7fbb3f0475c9133,2d4c0738ccca1709a7fbb3f0475c9133,ab9d20b6cb74006912fe3ff515892e26,ab9d20b6cb74006912fe3ff515892e26}"
	},
	{
		"advertiser_name" : "My Baby Unicorn - Pony Care",
		"advertiser_store_id" : "com.tutotoons.app.mybabyunicorn.free",
		"advertiser_icon_url_100" : "c73c457a031f722e.png",
		"advertiser_category" : "game_educational",
		"advertiser_installs" : 4.4415818E7,
		"unique_creatives" : 7,
		"unique_publishers" : 6,
		"first_seen" : "2025-09-12T19:55:51.299Z",
		"last_seen" : "2025-09-30T02:16:11.651Z",
		"ad_network_domains" : "{tutoads.tv}",
		"avg_publisher_installs" : 5.05193896E7,
		"mmp_domains" : "{sng.link}",
		"top_md5_hashes" : "{f93d633e659a40635721eb339b424d7c,b6dc4a17761417b3674c95bd2c0134b0,bf73232456714648d48934f7f7e83144,c30cac0d462edbbbb8a6ffab8974d498,662a7c6cf8d76b9cd0c87af7f2b106f0}"
	},
	{
		"advertiser_name" : "Bigo Live - Live Streaming App",
		"advertiser_store_id" : "sg.bigo.live",
		"advertiser_icon_url_100" : "840f072f05ee5cf9.png",
		"advertiser_category" : "social networking",
		"advertiser_installs" : 7.55582637E8,
		"unique_creatives" : 5,
		"unique_publishers" : 6,
		"first_seen" : "2025-09-01T11:39:56.242Z",
		"last_seen" : "2025-09-05T04:34:55.254Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 3548986.3,
		"mmp_domains" : null,
		"top_md5_hashes" : "{dfbd18b0fa0d392652e30ef81863360e,cf97012f1db44ee86574a32ae1a9df22,a3005aa57ec43c72d409d097cbe7248b,dfbd18b0fa0d392652e30ef81863360e,cf97012f1db44ee86574a32ae1a9df22}"
	},
	{
		"advertiser_name" : "Kiki & Fifi Pet Friends",
		"advertiser_store_id" : "com.tutotoons.app.kikififipetfriends.free",
		"advertiser_icon_url_100" : "d2984bd66336698d.png",
		"advertiser_category" : "game_educational",
		"advertiser_installs" : 3.6014273E7,
		"unique_creatives" : 5,
		"unique_publishers" : 6,
		"first_seen" : "2025-09-27T17:01:36.656Z",
		"last_seen" : "2025-09-30T05:14:32.655Z",
		"ad_network_domains" : "{tutoads.tv}",
		"avg_publisher_installs" : 2.6039304E7,
		"mmp_domains" : "{sng.link}",
		"top_md5_hashes" : "{2a64af855c1e0555caa864cca38bb9cd,f91a62f86c9d72c70d0855575f232369,f91a62f86c9d72c70d0855575f232369,2a64af855c1e0555caa864cca38bb9cd,8a42545e20cb2ed7222f143f42c87171}"
	},
	{
		"advertiser_name" : "Woodoku - Wood Block Puzzle",
		"advertiser_store_id" : "com.tripledot.woodoku",
		"advertiser_icon_url_100" : "f17394b551dd0471.png",
		"advertiser_category" : "game_puzzle",
		"advertiser_installs" : 1.16960831E8,
		"unique_creatives" : 5,
		"unique_publishers" : 6,
		"first_seen" : "2025-09-19T01:49:05.480Z",
		"last_seen" : "2025-09-30T04:07:58.868Z",
		"ad_network_domains" : "{digitalturbine.com,google.com,mobvista.com}",
		"avg_publisher_installs" : 8480984.142857144,
		"mmp_domains" : "{adjust.com}",
		"top_md5_hashes" : "{0b0b241eb1bab3370534cb67fefb5927,f7cbdf2038aa9f6cb93103e8c7e10da3,45838bd23e970374ea10469b0d6e9193,725cd2ccc965b0a9f0d7a21b8372dda1,725cd2ccc965b0a9f0d7a21b8372dda1}"
	},
	{
		"advertiser_name" : "Bunnsies - Happy Pet World",
		"advertiser_store_id" : "com.tutotoons.app.bunnsies",
		"advertiser_icon_url_100" : "895447695997d51b.png",
		"advertiser_category" : "game_educational",
		"advertiser_installs" : 1.0308832E7,
		"unique_creatives" : 5,
		"unique_publishers" : 5,
		"first_seen" : "2025-09-27T13:50:10.458Z",
		"last_seen" : "2025-09-29T10:43:49.539Z",
		"ad_network_domains" : "{tutoads.tv}",
		"avg_publisher_installs" : 1.0831602E7,
		"mmp_domains" : "{sng.link}",
		"top_md5_hashes" : "{48e53c86f33179bfa939db53b0511db2,9ed26dc91e7c38e0d35d60a84af266b7,3e11f6e12b796cd83d823e7fd693fce6,ce4f0e51f4f6aadb50502d203b80b5de,3e11f6e12b796cd83d823e7fd693fce6}"
	},
	{
		"advertiser_name" : "KJV Daily Bible - Verse+Audio",
		"advertiser_store_id" : "kjvbible.verse.daily.bible.prayer",
		"advertiser_icon_url_100" : "c142953956bd7678.jpeg",
		"advertiser_category" : "books_and_reference",
		"advertiser_installs" : 6201085.0,
		"unique_creatives" : 7,
		"unique_publishers" : 5,
		"first_seen" : "2025-09-27T16:54:08.954Z",
		"last_seen" : "2025-09-29T09:05:42.050Z",
		"ad_network_domains" : "{digitalturbine.com,google.com,liftoff.io,mobvista.com}",
		"avg_publisher_installs" : 2.437842075E7,
		"mmp_domains" : "{appsflyer.com}",
		"top_md5_hashes" : "{fe8d2c12ecd221e745a3c07ce6cc0e29,5de27b8e0c16b3c1c590153b065f9a77,57ad9a8c427e2680df9045f6ce23f251,4e888f50110920b2afeedd46af8ea2bc,4e214af6da3e520ffb4e0e61f9c5369a}"
	},
	{
		"advertiser_name" : "Animal Crossing: Pocket Camp C",
		"advertiser_store_id" : "com.nintendo.zasa",
		"advertiser_icon_url_100" : "978f2fc9446478d8.png",
		"advertiser_category" : "game_simulation",
		"advertiser_installs" : 381750.0,
		"unique_creatives" : 1,
		"unique_publishers" : 5,
		"first_seen" : "2025-09-04T16:06:48.579Z",
		"last_seen" : "2025-09-30T02:16:11.651Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 3.38752328E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{29b2cba1126862be274110567130df16,d73782df24183fcb04e670b1616224ea,d73782df24183fcb04e670b1616224ea,d73782df24183fcb04e670b1616224ea,29b2cba1126862be274110567130df16}"
	},
	{
		"advertiser_name" : "456 Run Challenge: Clash 3D",
		"advertiser_store_id" : "com.run.squid.challenges.survival.clash",
		"advertiser_icon_url_100" : "b358b666139c94a7.jpeg",
		"advertiser_category" : "game_simulation",
		"advertiser_installs" : 8.9488173E7,
		"unique_creatives" : 3,
		"unique_publishers" : 5,
		"first_seen" : "2025-09-29T16:56:38.066Z",
		"last_seen" : "2025-09-29T19:49:27.617Z",
		"ad_network_domains" : "{appier.com,digitalturbine.com,google.com,inmobi.com}",
		"avg_publisher_installs" : 2543917.8333333335,
		"mmp_domains" : "{appsflyer.com}",
		"top_md5_hashes" : "{13b1f9e3b88c857ccd915ce11586e42b,13b1f9e3b88c857ccd915ce11586e42b,bdedc35eb3a3d12c7796a7aff04161b9,13b1f9e3b88c857ccd915ce11586e42b,bdedc35eb3a3d12c7796a7aff04161b9}"
	},
	{
		"advertiser_name" : "Mexican Train Dominoes Classic",
		"advertiser_store_id" : "glowingeye.mexican_train_dominoes_classic",
		"advertiser_icon_url_100" : "95506e6f6ae19598.png",
		"advertiser_category" : "game_board",
		"advertiser_installs" : 132631.0,
		"unique_creatives" : 2,
		"unique_publishers" : 5,
		"first_seen" : "2025-09-28T19:52:57.538Z",
		"last_seen" : "2025-09-28T20:00:37.106Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 3.5853414375E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{7bec35f68e829ca1406607a9cf6b968e,7bec35f68e829ca1406607a9cf6b968e,7bec35f68e829ca1406607a9cf6b968e,7bec35f68e829ca1406607a9cf6b968e,8a3da4f41d7a068bfff7cf453eb4c20e}"
	},
	{
		"advertiser_name" : "TikTok Lite - Save Data & Fast",
		"advertiser_store_id" : "com.zhiliaoapp.musically.go",
		"advertiser_icon_url_100" : "c3332ccd268eb173.png",
		"advertiser_category" : "social networking",
		"advertiser_installs" : 1.564047671E9,
		"unique_creatives" : 4,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-28T06:29:57.171Z",
		"last_seen" : "2025-09-30T09:40:53.767Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 1.9570185333333332E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{10c246170a6656831a8026ce1ee8d1d6,03cb21a3ef858f62d3fdc60a44ea5bd5,8e43c237c24528608438c9d2f8ebc8e7,8e43c237c24528608438c9d2f8ebc8e7,b3d4efb85d1534e303fa0663aa52a9c2}"
	},
	{
		"advertiser_name" : "Merge Gangster Heist vs Police",
		"advertiser_store_id" : "gta.merge.game.gangster",
		"advertiser_icon_url_100" : "ad52a5b4ce52c29d.png",
		"advertiser_category" : "game_arcade",
		"advertiser_installs" : 2095792.0,
		"unique_creatives" : 5,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-05T16:03:37.634Z",
		"last_seen" : "2025-09-21T16:07:51.548Z",
		"ad_network_domains" : "{amazonaws.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 9769825.4,
		"mmp_domains" : null,
		"top_md5_hashes" : "{ed7a99cf9480831802eb49b8909db603,cc2c436cf8430edf3f40e7a279783bfd,7d5970dbd46de2220b00b416ecc2e747,37d0d1092544c89e6a72a2fb6326535f,468c13597c744033a5f7846dcdd43d72}"
	},
	{
		"advertiser_name" : "BESTPLAY Play to earn & donate",
		"advertiser_store_id" : "com.bestplay.app",
		"advertiser_icon_url_100" : "c716ce7934c17d11.png",
		"advertiser_category" : "entertainment",
		"advertiser_installs" : 1.0777154E7,
		"unique_creatives" : 2,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-18T14:57:15.774Z",
		"last_seen" : "2025-09-26T05:21:59.465Z",
		"ad_network_domains" : "{google.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 999004.0,
		"mmp_domains" : "{appsflyer.com}",
		"top_md5_hashes" : "{3e3b41ce805c1d45f2d1c6e8803eb8e5,1f2094afad03dc4c66d81d2905cef3db,3e3b41ce805c1d45f2d1c6e8803eb8e5,3e3b41ce805c1d45f2d1c6e8803eb8e5,3e3b41ce805c1d45f2d1c6e8803eb8e5}"
	},
	{
		"advertiser_name" : "VYBS: Play & Earn Rewards",
		"advertiser_store_id" : "co.vybs.app",
		"advertiser_icon_url_100" : "d46f0bb4b0da6c94.jpeg",
		"advertiser_category" : "lifestyle",
		"advertiser_installs" : 460709.0,
		"unique_creatives" : 7,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-03T18:15:50.860Z",
		"last_seen" : "2025-09-30T12:04:35.362Z",
		"ad_network_domains" : "{unity.com}",
		"avg_publisher_installs" : 8398954.5,
		"mmp_domains" : null,
		"top_md5_hashes" : "{07aa9cb372358131044b13999fde8eda,99c9b89968fa004bdc00d270be75a5b5,6bcfeefc7d962daf6051087128772f8f,d5169dadaeec2174f490fa5fb5bfafd6,78964a1abed192acbbc4c2aba3ed92c9}"
	},
	{
		"advertiser_name" : "Save the Pet - Brain Puzzle",
		"advertiser_store_id" : "com.SuponoHoldings.SaveThePetBrainPuzzleGame",
		"advertiser_icon_url_100" : "e6ae8c0987d0d2f3.png",
		"advertiser_category" : "game_puzzle",
		"advertiser_installs" : 2331822.0,
		"unique_creatives" : 2,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-16T14:58:27.566Z",
		"last_seen" : "2025-09-28T14:13:43.958Z",
		"ad_network_domains" : "{amazonaws.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 4.39170385E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{1dfbab0b3296dba0151ff8ceb16bbac1,1dfbab0b3296dba0151ff8ceb16bbac1,1dfbab0b3296dba0151ff8ceb16bbac1,6f88eb62cda72e5b4ae16d481855c4ca}"
	},
	{
		"advertiser_name" : "Happy Mall 3D",
		"advertiser_store_id" : "hm.happy.mall",
		"advertiser_icon_url_100" : "9fc6b4295e45e252.png",
		"advertiser_category" : "game_casual",
		"advertiser_installs" : 120151.0,
		"unique_creatives" : 5,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-28T04:41:32.378Z",
		"last_seen" : "2025-09-29T19:20:10.522Z",
		"ad_network_domains" : "{google.com,liftoff.io,mobvista.com,unity.com}",
		"avg_publisher_installs" : 2.4933177833333332E7,
		"mmp_domains" : "{adjust.com}",
		"top_md5_hashes" : "{953ec18568c0c10cac0436c85191739c,f05cf307ea1386d5c237ba9aa3e7f8d4,aac7ed63a2f074a2303bb7bcfc06955e,aac7ed63a2f074a2303bb7bcfc06955e,723fe9a0de38871dff2c81d5eb861a00}"
	},
	{
		"advertiser_name" : "Fortune Coins",
		"advertiser_store_id" : "com.sgllc.fortunecoins",
		"advertiser_icon_url_100" : "c49913674ccf783a.png",
		"advertiser_category" : "game_casino",
		"advertiser_installs" : 63734.0,
		"unique_creatives" : 3,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-15T23:51:14.107Z",
		"last_seen" : "2025-09-25T11:35:05.088Z",
		"ad_network_domains" : "{unity.com}",
		"avg_publisher_installs" : 594965.0,
		"mmp_domains" : null,
		"top_md5_hashes" : "{1eb11fb1df61522545b672e40cbd7a70,53ec0f5d1ddcbcec89d1cfa961fcf908,dc7406634471eb6462df1e56c34c551c,1eb11fb1df61522545b672e40cbd7a70,1eb11fb1df61522545b672e40cbd7a70}"
	},
	{
		"advertiser_name" : "Война судьбы (Fate War)",
		"advertiser_store_id" : "com.igg.android.fatewarru",
		"advertiser_icon_url_100" : "a6e1ce1ac8dc989b.png",
		"advertiser_category" : "game_strategy",
		"advertiser_installs" : 161614.0,
		"unique_creatives" : 3,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-02T17:56:07.415Z",
		"last_seen" : "2025-09-12T22:39:03.630Z",
		"ad_network_domains" : "{NULL}",
		"avg_publisher_installs" : 1935626.3333333333,
		"mmp_domains" : null,
		"top_md5_hashes" : "{0ee36daba2bb59495cc2c0e2944bea15,0ee36daba2bb59495cc2c0e2944bea15,caa13358d3fe141344b4e8b6402fc719,0ee36daba2bb59495cc2c0e2944bea15,0ee36daba2bb59495cc2c0e2944bea15}"
	},
	{
		"advertiser_name" : "Offline Music Player-pro",
		"advertiser_store_id" : "com.offlinepower.music",
		"advertiser_icon_url_100" : "8b993bb3a1c5e4c4.png",
		"advertiser_category" : "music_and_audio",
		"advertiser_installs" : 4224.0,
		"unique_creatives" : 3,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-25T07:16:33.657Z",
		"last_seen" : "2025-09-28T04:41:32.378Z",
		"ad_network_domains" : "{mobvista.com,unity.com}",
		"avg_publisher_installs" : 1.758687535E8,
		"mmp_domains" : null,
		"top_md5_hashes" : "{1672fc21d050cf72218af47bb1a5d050,3fe1c9cb58ffb5bf63a4020fd20fe730,23738033693ec07088593d90664b65a3,8a6d036c3b0623133a6094aee47836f5}"
	},
	{
		"advertiser_name" : "LEGO® Play",
		"advertiser_store_id" : "com.lego.common.legoplay",
		"advertiser_icon_url_100" : "d42737cd68301fb2.jpeg",
		"advertiser_category" : "entertainment",
		"advertiser_installs" : 7925315.0,
		"unique_creatives" : 5,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-12T20:40:10.270Z",
		"last_seen" : "2025-09-29T00:20:56.368Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 1.36789905E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{4b1b5e943897ffffaedd6439d6f8ffcd,4b1b5e943897ffffaedd6439d6f8ffcd,5b944d7d4f27a4393fd204213f9a6600,ecab20579ce175dc39578336d245d2c8,39aa1e5f39ac8a691217703c922afbb8}"
	},
	{
		"advertiser_name" : "NewsBreak: Local News & Alerts",
		"advertiser_store_id" : "com.particlenews.newsbreak",
		"advertiser_icon_url_100" : "b4d9c52e309347d9.png",
		"advertiser_category" : "news",
		"advertiser_installs" : 8.5900651E7,
		"unique_creatives" : 2,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-01T06:57:50.056Z",
		"last_seen" : "2025-09-28T23:33:47.416Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 8308233.75,
		"mmp_domains" : null,
		"top_md5_hashes" : "{c01414658ec9743155e0718fba283fc9,3505f1e3ebe8d15e377d94b43d2e18fd,3505f1e3ebe8d15e377d94b43d2e18fd,dca3c26360ca1103b1621b0846358d4b}"
	},
	{
		"advertiser_name" : "Duolingo: Language Lessons",
		"advertiser_store_id" : "com.duolingo",
		"advertiser_icon_url_100" : "b44316b84b96eb3c.png",
		"advertiser_category" : "education",
		"advertiser_installs" : 7.81178561E8,
		"unique_creatives" : 3,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-04T11:14:00.929Z",
		"last_seen" : "2025-09-29T13:24:03.849Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 7347640.2,
		"mmp_domains" : null,
		"top_md5_hashes" : "{6b4cdee0ec3b63444d81ad6728e6d635,04dee09fb03ae633c2ae159a3d8d94f3,5735be9e097f1ca7d74f7cff929d50da,5735be9e097f1ca7d74f7cff929d50da,5735be9e097f1ca7d74f7cff929d50da}"
	},
	{
		"advertiser_name" : "CashQuest: Play to Earn Cash",
		"advertiser_store_id" : "com.mistplay.mistplay.cashquest",
		"advertiser_icon_url_100" : "c1533b6c6ad10d3e.png",
		"advertiser_category" : "lifestyle",
		"advertiser_installs" : 105974.0,
		"unique_creatives" : 3,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-28T00:18:30.563Z",
		"last_seen" : "2025-09-30T08:39:34.495Z",
		"ad_network_domains" : "{amazonaws.com,appodeal.com,digitalturbine.com,liftoff.io,smadex.com}",
		"avg_publisher_installs" : 5.9041650375E7,
		"mmp_domains" : "{appsflyer.com}",
		"top_md5_hashes" : "{f327b7bc0f0aed21cb6b1be8e21d6423,faf89b285eba3df7e7308f3334c3923a,f327b7bc0f0aed21cb6b1be8e21d6423,faf89b285eba3df7e7308f3334c3923a,faf89b285eba3df7e7308f3334c3923a}"
	},
	{
		"advertiser_name" : "DeskFur Buddy",
		"advertiser_store_id" : "com.pet.deskfur.buddy",
		"advertiser_icon_url_100" : "ad6390cdc236cb3c.png",
		"advertiser_category" : "tools",
		"advertiser_installs" : 44198.0,
		"unique_creatives" : 4,
		"unique_publishers" : 4,
		"first_seen" : "2025-09-28T23:46:37.618Z",
		"last_seen" : "2025-09-29T01:36:10.063Z",
		"ad_network_domains" : "{appodeal.com,google.com,mobvista.com}",
		"avg_publisher_installs" : 2.2420788833333332E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{57efbc0124af4f030d27c3bb49279e5c,628c0357f57f7640487d7344675143b9,dce1791690117562e2ad30c4fb9a3bed,117dc6a1f5e643b07f624bd771e618f2,57efbc0124af4f030d27c3bb49279e5c}"
	},
	{
		"advertiser_name" : "Cars.com: Buy and sell cars",
		"advertiser_store_id" : "com.cars.android",
		"advertiser_icon_url_100" : "814b3e3ec1cb3636.png",
		"advertiser_category" : "auto_and_vehicles",
		"advertiser_installs" : 1.3724092E7,
		"unique_creatives" : 5,
		"unique_publishers" : 3,
		"first_seen" : "2025-09-04T09:09:57.573Z",
		"last_seen" : "2025-09-05T10:52:36.654Z",
		"ad_network_domains" : "{NULL}",
		"avg_publisher_installs" : 459620.0,
		"mmp_domains" : null,
		"top_md5_hashes" : "{1012b947a5e1a8a096fb997f08ed8539,0c0439bd5e1dd3c35cbe36921abee1a2,a15ad86edd5cbacbbe1a097a8d4adc18,3889d082227468ddf52dd30aa52b31b3,a960ca2c6e783778c0c8a59eb8e6e2e7}"
	},
	{
		"advertiser_name" : "Receipt Hog: Cash for Receipts",
		"advertiser_store_id" : "com.infoscout.receipthog",
		"advertiser_icon_url_100" : "9a6c6c3393989e66.png",
		"advertiser_category" : "shopping",
		"advertiser_installs" : 7206272.0,
		"unique_creatives" : 2,
		"unique_publishers" : 3,
		"first_seen" : "2025-09-13T10:59:32.255Z",
		"last_seen" : "2025-09-29T16:17:36.519Z",
		"ad_network_domains" : "{bidease.com,google.com}",
		"avg_publisher_installs" : 4813782.142857143,
		"mmp_domains" : null,
		"top_md5_hashes" : "{693f82f217fd4fb33949115309bda6f1,0ce42f82d264035ef10561a3d850f196,693f82f217fd4fb33949115309bda6f1,0ce42f82d264035ef10561a3d850f196,693f82f217fd4fb33949115309bda6f1}"
	},
	{
		"advertiser_name" : "Priceline: Hotel, Flight & Car",
		"advertiser_store_id" : "com.priceline.android.negotiator",
		"advertiser_icon_url_100" : "d0922f6ca4d2d13f.png",
		"advertiser_category" : "travel_and_local",
		"advertiser_installs" : 1.6222822E7,
		"unique_creatives" : 1,
		"unique_publishers" : 3,
		"first_seen" : "2025-09-01T11:00:02.712Z",
		"last_seen" : "2025-09-28T07:07:40.015Z",
		"ad_network_domains" : "{digitalturbine.com}",
		"avg_publisher_installs" : 1.066321876E8,
		"mmp_domains" : "{kochava.com}",
		"top_md5_hashes" : "{bf017b930f83e9359bb8a7ef037b75b9,bf017b930f83e9359bb8a7ef037b75b9,bf017b930f83e9359bb8a7ef037b75b9,bf017b930f83e9359bb8a7ef037b75b9,bf017b930f83e9359bb8a7ef037b75b9}"
	},
	{
		"advertiser_name" : "Solitaire.com - Classic Cards",
		"advertiser_store_id" : "com.tripledot.solitaire",
		"advertiser_icon_url_100" : "d1c86e9fd3ca2035.png",
		"advertiser_category" : "game_card",
		"advertiser_installs" : 4.2379394E7,
		"unique_creatives" : 4,
		"unique_publishers" : 3,
		"first_seen" : "2025-09-17T18:49:18.532Z",
		"last_seen" : "2025-09-30T00:14:46.149Z",
		"ad_network_domains" : "{amazonaws.com,appodeal.com,digitalturbine.com}",
		"avg_publisher_installs" : 1.8049945285714287E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{b257b1ef12f5ff0272a82f2381e58cf4,ffcd882b777d5b74fd72de06d2bd26cd,b257b1ef12f5ff0272a82f2381e58cf4,b257b1ef12f5ff0272a82f2381e58cf4,72f308aea856de016a27e364ac9d8f5c}"
	},
	{
		"advertiser_name" : "Owl Image Converter",
		"advertiser_store_id" : "com.owlimagecg.conn",
		"advertiser_icon_url_100" : "e9699494a6c79b0b.png",
		"advertiser_category" : "tools",
		"advertiser_installs" : 40065.0,
		"unique_creatives" : 4,
		"unique_publishers" : 3,
		"first_seen" : "2025-09-28T06:27:29.552Z",
		"last_seen" : "2025-09-29T15:29:50.951Z",
		"ad_network_domains" : "{appodeal.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 1.41002068E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{3e005b0dd72b76ed2cc59879a4218aac,3ce7ef97ae984506b8b5a43730421345,3ce7ef97ae984506b8b5a43730421345,5636b38361211545ecb3b148cc00a782,3cc08ff0c6fa230cb8fe518539ec7e26}"
	},
	{
		"advertiser_name" : "Future Self Face Aging Changer",
		"advertiser_store_id" : "com.facechanger.agingapp.futureself",
		"advertiser_icon_url_100" : "98c661e966b1669e.png",
		"advertiser_category" : "art_and_design",
		"advertiser_installs" : 2.5085644E7,
		"unique_creatives" : 3,
		"unique_publishers" : 3,
		"first_seen" : "2025-09-29T09:39:21.823Z",
		"last_seen" : "2025-09-29T10:19:49.380Z",
		"ad_network_domains" : "{digitalturbine.com,google.com,mobvista.com,unity.com}",
		"avg_publisher_installs" : 1.349306925E7,
		"mmp_domains" : "{appsflyer.com}",
		"top_md5_hashes" : "{4b001c74cd974ac138542c629dde7372,20b62c4aa48680879a3d36af36c0eb08,20b62c4aa48680879a3d36af36c0eb08,8d5a85b9f1ec7b536a70f0f61571436c}"
	},
	{
		"advertiser_name" : "Block Blast!",
		"advertiser_store_id" : "com.block.juggle",
		"advertiser_icon_url_100" : "d414496f667369cc.jpeg",
		"advertiser_category" : "game_puzzle",
		"advertiser_installs" : 6.44688728E8,
		"unique_creatives" : 3,
		"unique_publishers" : 3,
		"first_seen" : "2025-09-27T17:44:32.182Z",
		"last_seen" : "2025-09-30T14:35:44.236Z",
		"ad_network_domains" : "{google.com}",
		"avg_publisher_installs" : 1.52601672E7,
		"mmp_domains" : null,
		"top_md5_hashes" : "{c5ffe309a8085bdc715c4bda426e3353,f0da24caebcaeb3582f9a421c85fd7e6,b0c769d593df9f6a1a2fe2d80a0f3f74,b0c769d593df9f6a1a2fe2d80a0f3f74,b0c769d593df9f6a1a2fe2d80a0f3f74}"
	}
];

interface ProcessedApp {
	app_name: string;
	store_app: number;
	store_id: string;
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

function processData(data: AppAdData[]) {
	const appsMap = new Map<number, ProcessedApp>();

	data.forEach((row) => {
		if (!appsMap.has(row.store_app)) {
			appsMap.set(row.store_app, {
				app_name: row.app_name,
				store_app: row.store_app,
				store_id: row.store_id,
				icon_url_100: row.icon_url_100,
				weekly_installs: row.weekly_installs,
				weekly_percent_increase: row.weekly_percent_increase,
				creative_count: 0,
				pub_count: 0,
				ad_networks: [],
				mmp_domains: new Set(),
				creatives: []
			});
		}

		const app = appsMap.get(row.store_app)!;
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

		if (row.mmp_domain) app.mmp_domains.add(row.mmp_domain);

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

	return Array.from(appsMap.values()).sort(
		(a, b) => b.weekly_percent_increase - a.weekly_percent_increase
	);
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
	const totalAdvertisers = adNetworks.reduce((sum, net) => sum + net.advertiser_count, 0);
	const totalNetworkCreatives = adNetworks.reduce((sum, net) => sum + net.creatives_count, 0);

	// Calculate Ad Reach Tiers based on pub_count
	const calculateReachTier = (pubCount: number) => {
		if (pubCount >= 3) return 'elite';
		if (pubCount >= 2) return 'wide';
		if (pubCount >= 1) return 'targeted';
		return 'emerging';
	};

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
					logo_url: `company-logos/${domain.trim()}/logo_200x200.jpeg`
				}));
			}

			return {
				...app,
				ad_networks: networks,
				mmps: mmps
			};
		});

	return {
		apps,
		adNetworks,
		popularCreatives: rawMostPopularCreatives,
		reachTiers,
		reachStats,
		appReachData: topReachApps,
		networkStats: {
			totalPublishers,
			totalAdvertisers,
			totalNetworkCreatives,
			totalNetworks: adNetworks.length
		},
		summary: {
			totalApps: apps.length,
			totalInstalls,
			avgGrowth: Math.round(avgGrowth * 10) / 10,
			totalCreatives,
			uniqueNetworks: allNetworks.size,
			reportPeriod: 'September 2025',
			generatedDate: new Date().toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
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
