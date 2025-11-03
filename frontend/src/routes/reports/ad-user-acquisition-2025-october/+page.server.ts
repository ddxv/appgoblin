import type { PageServerLoad } from './$types';

interface AppAdImpactGrowthData {
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
		apps_analyzed: 18779,
		https_tracked: 655103,
		api_domains: 8003,
		adtech_companies: 210,
		advertisers: 255,
		creative_count: 14059
	}
];

const rawMostPopularCreatives = [
	{
		phash: '64b37fed9bde',
		md5_hash: '13b1f9e3b88c857ccd915ce11586e42b',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 32,
		first_seen: '2025-10-01T03:36:07.246Z',
		last_seen: '2025-10-17T19:43:32.966Z',
		advertiser_store_id: 'com.run.squid.challenges.survival.clash',
		advertiser_icon_url_100: 'b358b666139c94a7.jpeg'
	},
	{
		phash: 'f63fe69ee384',
		md5_hash: 'beb6e3b68169dd0bb98a948dd776d446',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 30,
		first_seen: '2025-09-30T16:43:27.877Z',
		last_seen: '2025-10-27T08:08:03.796Z',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png'
	},
	{
		phash: '3a7f2f799778',
		md5_hash: '409b5a87d153d17e7550c2073f7d06c5',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 28,
		first_seen: '2025-10-01T06:11:23.821Z',
		last_seen: '2025-10-21T11:02:27.667Z',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png'
	},
	{
		phash: '696c61773f7e',
		md5_hash: '9b430f0d5a631f726eae018abad966d8',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 19,
		first_seen: '2025-10-06T13:58:01.289Z',
		last_seen: '2025-10-29T13:44:47.156Z',
		advertiser_store_id: 'com.ballytechnologies.f88',
		advertiser_icon_url_100: 'c15f2b3538617d94.png'
	},
	{
		phash: '56a12dde7771',
		md5_hash: 'bd62458cae6f8fd61aaa14dfd15a9fc0',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 15,
		first_seen: '2025-10-06T13:37:20.540Z',
		last_seen: '2025-10-28T19:43:19.138Z',
		advertiser_store_id: 'com.ballytechnologies.f88',
		advertiser_icon_url_100: 'c15f2b3538617d94.png'
	},
	{
		phash: 'a523df2a23d4',
		md5_hash: '24984cf5e51f2652cabe62336bd57456',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 13,
		first_seen: '2025-10-11T11:01:15.735Z',
		last_seen: '2025-10-22T02:48:00.193Z',
		advertiser_store_id: 'com.univision.prendetv',
		advertiser_icon_url_100: 'd4ac6bc394fc2983.png'
	},
	{
		phash: 'e6efcfe77db3',
		md5_hash: '9b44f986fdaf21611d34129a54ac1190',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 11,
		first_seen: '2025-10-28T22:24:55.371Z',
		last_seen: '2025-10-30T22:09:03.736Z',
		advertiser_store_id: 'com.GentleManiac.HorizonWalkerGoogle',
		advertiser_icon_url_100: '9e1e21499c746d37.png'
	},
	{
		phash: '357aeed3e2ed',
		md5_hash: '50240bfec57c4e52bf64779de4784efa',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 11,
		first_seen: '2025-10-06T19:07:13.544Z',
		last_seen: '2025-10-16T11:41:20.315Z',
		advertiser_store_id: 'net.mbc.shahid',
		advertiser_icon_url_100: 'd4a96b964b6994c3.png'
	},
	{
		phash: '3ff77d7a737f',
		md5_hash: 'c82dc54d2fb1e05b8ac9d987abc75897',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 9,
		first_seen: '2025-10-06T16:34:10.985Z',
		last_seen: '2025-10-27T15:28:16.214Z',
		advertiser_store_id: 'com.productmadness.fafafagold',
		advertiser_icon_url_100: 'd11e69b262bd16c3.png'
	},
	{
		phash: '5fbe6dd4fe6d',
		md5_hash: '66d37bb6cb4dad5369fe6d63b5a8ae07',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 8,
		first_seen: '2025-10-03T22:25:43.498Z',
		last_seen: '2025-10-18T08:36:42.059Z',
		advertiser_store_id: 'easy.launcher',
		advertiser_icon_url_100: '879368b7386e91a5.png'
	}
];

const rawAdNetworkData: AdNetworkData[] = [
	{
		ad_network_name: 'Google',
		ad_network_domain: 'google.com',
		company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		all_domains: '{google.com}',
		publisher_count: 1783,
		advertiser_count: 171,
		creatives_count: 1647
	},
	{
		ad_network_name: 'Bigabid',
		ad_network_domain: 'bigabid.com',
		company_logo_url: 'company-logos\/bigabid.com\/logo_200x200.jpeg',
		all_domains: '{bigabid.com}',
		publisher_count: 217,
		advertiser_count: 5,
		creatives_count: 53
	},
	{
		ad_network_name: 'YouAppi',
		ad_network_domain: 'youappi.com',
		company_logo_url: 'company-logos\/youappi.com\/logo_64x64.ico',
		all_domains: '{youappi.com}',
		publisher_count: 197,
		advertiser_count: 3,
		creatives_count: 46
	},
	{
		ad_network_name: 'AppLovin',
		ad_network_domain: 'applovin.com',
		company_logo_url: 'company-logos\/applovin.com\/logo_200x200.jpeg',
		all_domains: '{applovin.com}',
		publisher_count: 139,
		advertiser_count: 0,
		creatives_count: 232
	},
	{
		ad_network_name: 'Digital Turbine',
		ad_network_domain: 'digitalturbine.com',
		company_logo_url: 'company-logos\/digitalturbine.com\/logo_200x200.jpeg',
		all_domains: '{adcolony.com,appreciate.mobi,fyber.com}',
		publisher_count: 133,
		advertiser_count: 12,
		creatives_count: 98
	},
	{
		ad_network_name: 'Unity',
		ad_network_domain: 'unity.com',
		company_logo_url: 'company-logos\/unity.com\/logo_200x200.jpeg',
		all_domains: '{unity.com,unity3d.com}',
		publisher_count: 129,
		advertiser_count: 40,
		creatives_count: 175
	},
	{
		ad_network_name: 'Remerge',
		ad_network_domain: 'remerge.io',
		company_logo_url: 'company-logos\/remerge.io\/logo_200x200.jpeg',
		all_domains: '{remerge.io}',
		publisher_count: 113,
		advertiser_count: 1,
		creatives_count: 9
	},
	{
		ad_network_name: 'InMobi',
		ad_network_domain: 'inmobi.com',
		company_logo_url: 'company-logos\/inmobi.com\/logo_200x200.jpeg',
		all_domains: '{inmobi.com}',
		publisher_count: 98,
		advertiser_count: 3,
		creatives_count: 21
	},
	{
		ad_network_name: 'Smadex',
		ad_network_domain: 'smadex.com',
		company_logo_url: 'company-logos\/smadex.com\/logo_200x200.jpeg',
		all_domains: '{smadex.com}',
		publisher_count: 89,
		advertiser_count: 3,
		creatives_count: 21
	},
	{
		ad_network_name: 'Appier',
		ad_network_domain: 'appier.com',
		company_logo_url: 'company-logos\/appier.com\/logo_200x200.jpeg',
		all_domains: '{appier.com}',
		publisher_count: 88,
		advertiser_count: 1,
		creatives_count: 21
	}
];

const adImpactGrowthData: AppAdImpactGrowthData[] = [
	{
		best_week: '2025-10-06',
		app_name: 'Slots 777 —Casino Slot Machine',
		store_id: 'tinysoft.casino.slot.machines.slots',
		icon_url_100: 'a4ce55b5d3928369.png',
		weekly_installs: 33231,
		weekly_percent_increase: 283.419868466597,
		phash: '9d4eda9d667a37c6',
		file_extension: 'mp4',
		host_ad_domain: 'mintegral.com',
		host_company_logo_url: 'company-logos\/mintegral.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: 'a1d28313d2f916e4bb092b170c68bf0a',
		pub_count: 1
	},
	{
		best_week: '2025-10-06',
		app_name: 'Build and Protect',
		store_id: 'com.mmfgrp.bp',
		icon_url_100: 'e65bbd41f60245b8.png',
		weekly_installs: 797,
		weekly_percent_increase: 187.725631768953,
		phash: 'e65bbd41f60245b8',
		file_extension: 'png',
		host_ad_domain: 'yandex.com',
		host_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		initial_ad_domain: 'yandex.com',
		initial_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: '7e7f8d9d920e7d0af364490e324e2fa6',
		pub_count: 1
	},
	{
		best_week: '2025-10-20',
		app_name: 'Number Merge',
		store_id: 'com.epicpandagames.number.merge',
		icon_url_100: 'c6c06f1f3968063f.png',
		weekly_installs: 156,
		weekly_percent_increase: 157.142857142857,
		phash: 'ffcae796a9403f6c',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: 'f8f717cdfd5ab1fe232c1b781c2e08eb',
		pub_count: 1
	},
	{
		best_week: '2025-10-13',
		app_name: 'Magic Fantasy Paint by Numbers',
		store_id: 'com.color.by.numbers.focus.color',
		icon_url_100: 'eeb590f0c1c3c4ce.png',
		weekly_installs: 6370,
		weekly_percent_increase: 142.51269035533,
		phash: 'acf793969bddee21',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{singular.net}',
		md5_hash: '87af5b7e8f6479c0c699458c80862c52',
		pub_count: 1
	},
	{
		best_week: '2025-10-06',
		app_name: 'Line Up: Draw the Criminal',
		store_id: 'com.jhulse.lineup',
		icon_url_100: 'c67de08e1b393d30.png',
		weekly_installs: 70826,
		weekly_percent_increase: 119.874580901527,
		phash: '85271f9f5fa728bd',
		file_extension: 'mp4',
		host_ad_domain: 'mintegral.com',
		host_company_logo_url: 'company-logos\/mintegral.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: 'ad70640b82f152e9321593465513923c',
		pub_count: 1
	},
	{
		best_week: '2025-10-06',
		app_name: 'ABCmouse 2: Kids Learning Game',
		store_id: 'com.aofl.abcmouse',
		icon_url_100: 'b98e716586c99a9c.png',
		weekly_installs: 89053,
		weekly_percent_increase: 96.1750279034248,
		phash: 'ef9a58a6bfdb99de',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: 'dfa5580a71d4d78a57bbafff5c39e7f0',
		pub_count: 1
	},
	{
		best_week: '2025-10-13',
		app_name: 'LEGO® Play',
		store_id: 'com.lego.common.legoplay',
		icon_url_100: 'd42737cd68301fb2.jpeg',
		weekly_installs: 172321,
		weekly_percent_increase: 77.2545859763415,
		phash: '94652f3b7f66dace',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: '38b6d9ac8ebfa48ffa3e618d9cb564b0',
		pub_count: 1
	},
	{
		best_week: '2025-10-13',
		app_name: 'Simple Bible Daily Verse Alarm',
		store_id: 'com.holy.bible.study',
		icon_url_100: '82173dd86670c3cf.png',
		weekly_installs: 27011,
		weekly_percent_increase: 59.0472825766943,
		phash: 'bbaacd66af593c78',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: '8b13cf1f0cf52e55e67cda89775a9e27',
		pub_count: 2
	},
	{
		best_week: '2025-10-06',
		app_name: 'Blocky Cars online games',
		store_id: 'com.blockycars.online',
		icon_url_100: 'efc090bf4876658a.png',
		weekly_installs: 101210,
		weekly_percent_increase: 51.184560383202,
		phash: 'dbbb6c6aee9cd793',
		file_extension: 'mp4',
		host_ad_domain: 'mintegral.com',
		host_company_logo_url: 'company-logos\/mintegral.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '15306c172ea3be1a216e635fbf28c4ae',
		pub_count: 1
	},
	{
		best_week: '2025-10-13',
		app_name: 'Crylic Nail Tips',
		store_id: 'com.playunlimited.casual.crylicnailtips',
		icon_url_100: 'a42f78ce1970b49e.jpeg',
		weekly_installs: 159740,
		weekly_percent_increase: 50.3340966841296,
		phash: 'ef30b2dfcfaa154d',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: 'ef7de67a781a2b088e221a3b0a4dbdc8',
		pub_count: 1
	},
	{
		best_week: '2025-10-13',
		app_name: 'My Talking Tom 2',
		store_id: 'com.outfit7.mytalkingtom2',
		icon_url_100: 'fc8bd196c9b488a3.png',
		weekly_installs: 2827187,
		weekly_percent_increase: 50.2606400562949,
		phash: 'f4f9cbbef11bf7f3',
		file_extension: 'mp4',
		host_ad_domain: 'mintegral.com',
		host_company_logo_url: 'company-logos\/mintegral.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '5c367d84dc2de8a345356ccb9623acd2',
		pub_count: 1
	},
	{
		best_week: '2025-10-20',
		app_name: 'Sudoku Jigsaw',
		store_id: 'com.puzzling.suji',
		icon_url_100: '949e6b636fb4e048.png',
		weekly_installs: 674,
		weekly_percent_increase: 50.1113585746102,
		phash: 'c9123f7c74317d90',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: 'd907870eed137e5c79e3b534cef8f808',
		pub_count: 3
	}
];

const AppReachData = [
	{
		advertiser_name: 'TikTok - Videos, Shop & LIVE',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png',
		advertiser_category: 'social networking',
		advertiser_installs: 3963972720,
		unique_creatives: 125,
		unique_publishers: 324,
		first_seen: '2025-09-30T16:22:38.928Z',
		last_seen: '2025-10-30T13:11:33.867Z',
		ad_network_domains: '{google.com,joyy.com,unity.com}',
		avg_publisher_installs: 8401297.516129032258,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{2261413e914ea8f5961844a9652d6e78,a9ae3ffab3f3f2c94836ed62ae815899,4aabcfe4bc3cedff4d73472230abe6e3,ec9d42f774b46434e9ec0af46a43b3a2,f701863c88f462555ed1d81484f18f6c}'
	},
	{
		advertiser_name: 'Cashman Casino Slots Games',
		advertiser_store_id: 'com.productmadness.cashmancasino',
		advertiser_icon_url_100: 'bb30c40f1bc6c5cd.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 19910335,
		unique_creatives: 25,
		unique_publishers: 72,
		first_seen: '2025-10-01T08:14:48.739Z',
		last_seen: '2025-10-30T22:09:03.736Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 5589463.625,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{f106b694cb313332485421ec7011b5d2,75a8328cfd51477adf329680eaf50e02,f106b694cb313332485421ec7011b5d2,75a8328cfd51477adf329680eaf50e02,3b8319aff5dc1f420fa4ae2ca191f27c}'
	},
	{
		advertiser_name: '88 Fortunes Casino Slot Games',
		advertiser_store_id: 'com.ballytechnologies.f88',
		advertiser_icon_url_100: 'c15f2b3538617d94.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 8782992,
		unique_creatives: 25,
		unique_publishers: 60,
		first_seen: '2025-10-06T07:46:06.148Z',
		last_seen: '2025-10-30T17:00:52.258Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 3885671.170454545455,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{d037a331a9137a35610cbb0326588ca1,d037a331a9137a35610cbb0326588ca1,d037a331a9137a35610cbb0326588ca1,e56fbc6ada3d8026617c2ffe9cc1fe5a,e15111f9f3ede38643f6ebe5d3017fe2}'
	},
	{
		advertiser_name: 'Easy Homescreen',
		advertiser_store_id: 'easy.launcher',
		advertiser_icon_url_100: '879368b7386e91a5.png',
		advertiser_category: 'personalization',
		advertiser_installs: 13286088,
		unique_creatives: 18,
		unique_publishers: 39,
		first_seen: '2025-10-02T01:21:57.433Z',
		last_seen: '2025-10-22T21:55:09.225Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 14062722.735849056604,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{30196fdeeba9e787ae75fbb626f3f742,e30457b3cdcdfc29fb95353629fb5c55,44784f07d919099dacc67217e4aace2f,66d37bb6cb4dad5369fe6d63b5a8ae07,26b0e3a297736d86254c40c728c8df7e}'
	},
	{
		advertiser_name: '456 Run Challenge: Clash 3D',
		advertiser_store_id: 'com.run.squid.challenges.survival.clash',
		advertiser_icon_url_100: 'b358b666139c94a7.jpeg',
		advertiser_category: 'game_simulation',
		advertiser_installs: 90165390,
		unique_creatives: 7,
		unique_publishers: 37,
		first_seen: '2025-10-01T03:36:07.246Z',
		last_seen: '2025-10-17T19:43:32.966Z',
		ad_network_domains: '{appier.com,digitalturbine.com,google.com,liftoff.io}',
		avg_publisher_installs: 24726286.988888888889,
		mmp_domains: '{appmetrica.yandex.com,appsflyer.com,metrica.yandex.com}',
		top_md5_hashes:
			'{13b1f9e3b88c857ccd915ce11586e42b,bdedc35eb3a3d12c7796a7aff04161b9,bdedc35eb3a3d12c7796a7aff04161b9,8c4b9cc7e0290016835ef25e66a8d30e,bdedc35eb3a3d12c7796a7aff04161b9}'
	},
	{
		advertiser_name: 'ViX: TV, Deportes y Noticias',
		advertiser_store_id: 'com.univision.prendetv',
		advertiser_icon_url_100: 'd4ac6bc394fc2983.png',
		advertiser_category: 'entertainment',
		advertiser_installs: 107356718,
		unique_creatives: 12,
		unique_publishers: 37,
		first_seen: '2025-10-03T13:00:00.752Z',
		last_seen: '2025-10-30T11:33:09.991Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4040397.666666666667,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{fcedbaadea502599199e790b206a1a74,fcedbaadea502599199e790b206a1a74,92cc06c344a083368f4821a1b1f8a3d7,92cc06c344a083368f4821a1b1f8a3d7,92cc06c344a083368f4821a1b1f8a3d7}'
	},
	{
		advertiser_name: 'Reverse: 1999',
		advertiser_store_id: 'com.bluepoch.m.en.reverse1999',
		advertiser_icon_url_100: 'c0e07013877d9b9f.png',
		advertiser_category: 'game_role_playing',
		advertiser_installs: 2528551,
		unique_creatives: 20,
		unique_publishers: 27,
		first_seen: '2025-10-22T22:41:54.273Z',
		last_seen: '2025-10-30T03:26:04.512Z',
		ad_network_domains: '{appodeal.com,liftoff.io,rtbhouse.com}',
		avg_publisher_installs: 838301.719298245614,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{695e2454669ffa008f1ad7c5e0318180,d50d5db844d31ecdf6c7bb8eb8146e6f,3aa7011ef68f8332075f283a0596de6d,ec3a61e0bee912abad55cf5acfee4d7c,c8579cc2f2574f6bfd8bbb82e8a12a49}'
	},
	{
		advertiser_name: 'شاهد  Shahid',
		advertiser_store_id: 'net.mbc.shahid',
		advertiser_icon_url_100: 'd4a96b964b6994c3.png',
		advertiser_category: 'entertainment',
		advertiser_installs: 143053659,
		unique_creatives: 8,
		unique_publishers: 25,
		first_seen: '2025-10-05T07:06:39.115Z',
		last_seen: '2025-10-16T14:02:49.118Z',
		ad_network_domains:
			'{appodeal.com,digitalturbine.com,google.com,liftoff.io,remerge.io,unity.com}',
		avg_publisher_installs: 12694634.966292134831,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{539fc86ddb89a1cc9d84c0e797042844,e51b6fc266ce29d1f6060ac3a16395bd,2436da1514f74bb528d1373b65b352f7,fba5d0dc830b3a7b987ccf50850707e4,13285aa392da67ad7e86dc561e41756f}'
	},
	{
		advertiser_name: 'Fashion Battle - Dress up game',
		advertiser_store_id: 'tr.com.apps.fashion.battle',
		advertiser_icon_url_100: 'f804837bc7394ce3.png',
		advertiser_category: 'game_role_playing',
		advertiser_installs: 84001535,
		unique_creatives: 10,
		unique_publishers: 21,
		first_seen: '2025-10-05T07:43:35.962Z',
		last_seen: '2025-10-11T22:37:26.980Z',
		ad_network_domains: '{appodeal.com,digitalturbine.com,google.com,youappi.com}',
		avg_publisher_installs: 15049692.354838709677,
		mmp_domains: '{adj.st,adjust.com,appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{762fcb231cd00d0f5277cdbb80601dd8,a502b7aaf46b0268e4c37ec3a17dac9d,3c76b6c370566b55fe992ecd3795565b,87686608fff101b0809c0d9dac640dbb,3c76b6c370566b55fe992ecd3795565b}'
	},
	{
		advertiser_name: 'Vita Mahjong',
		advertiser_store_id: 'com.vitastudio.mahjong',
		advertiser_icon_url_100: '91e14e37d14c74cd.png',
		advertiser_category: 'game_board',
		advertiser_installs: 190884519,
		unique_creatives: 18,
		unique_publishers: 21,
		first_seen: '2025-10-01T20:33:00.854Z',
		last_seen: '2025-10-15T08:06:19.614Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5021749.756756756757,
		mmp_domains: '{appmetrica.yandex.com,appsflyer.com,metrica.yandex.com}',
		top_md5_hashes:
			'{cbc94856c4b28998575fefc2f10d96e6,be11c808a8d2da1eac6d859eb6561323,6a086e2ca5693405ba6b4684b4ba39bc,7f460bb3b696af11a51ce4e868fb8f64,49680773041fa08f5627d43c31d84d07}'
	},
	{
		advertiser_name: 'Mighty Fu Casino Slots Games',
		advertiser_store_id: 'com.productmadness.fafafagold',
		advertiser_icon_url_100: 'd11e69b262bd16c3.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 6160309,
		unique_creatives: 12,
		unique_publishers: 20,
		first_seen: '2025-10-06T16:34:10.985Z',
		last_seen: '2025-10-29T17:01:11.101Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 11575028.5625,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{28282f48a28b7e34380da7e6332bd0a2,1952ad3488ae33d80506fdc4c08d9e71,c82dc54d2fb1e05b8ac9d987abc75897,4bfaf61ccfa586d76fe7e42a6a63bc67,c82dc54d2fb1e05b8ac9d987abc75897}'
	},
	{
		advertiser_name: 'Slots: Heart of Vegas Casino',
		advertiser_store_id: 'com.productmadness.hovmobile',
		advertiser_icon_url_100: 'd84f5a8f31287764.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 23877019,
		unique_creatives: 11,
		unique_publishers: 18,
		first_seen: '2025-10-06T14:41:50.556Z',
		last_seen: '2025-10-27T22:40:34.802Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 1300122.916666666667,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{ee660af011e90d435e655d923f16fd9d,ee660af011e90d435e655d923f16fd9d,6259728c0a97c7df3f83a1eaef4ca69e,1d4642b72f94ee396edeb7484f4e33b7,d1e2c1e7122df351bcf37b8762d21bf2}'
	},
	{
		advertiser_name: 'Ibotta: Save & Earn Cash Back',
		advertiser_store_id: 'com.ibotta.android',
		advertiser_icon_url_100: 'c14d7ab7349a986c.png',
		advertiser_category: 'shopping',
		advertiser_installs: 22905244,
		unique_creatives: 6,
		unique_publishers: 16,
		first_seen: '2025-10-01T06:07:46.884Z',
		last_seen: '2025-10-14T21:01:29.443Z',
		ad_network_domains: '{adikteev.com,google.com,verve.com}',
		avg_publisher_installs: 21951604.925925925926,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{0edb4204196ffc3122e3aec623c8796a,6d77ec6215ab159fa347ea22f90ddebf,4c92b81450fb3283f35d290b8e40d1c5,6d77ec6215ab159fa347ea22f90ddebf,4c92b81450fb3283f35d290b8e40d1c5}'
	},
	{
		advertiser_name: 'Horizon Walker',
		advertiser_store_id: 'com.GentleManiac.HorizonWalkerGoogle',
		advertiser_icon_url_100: '9e1e21499c746d37.png',
		advertiser_category: 'game_role_playing',
		advertiser_installs: 372562,
		unique_creatives: 10,
		unique_publishers: 15,
		first_seen: '2025-10-28T22:24:55.371Z',
		last_seen: '2025-10-30T22:09:03.736Z',
		ad_network_domains: '{appodeal.com,digitalturbine.com,google.com,mobvista.com,youappi.com}',
		avg_publisher_installs: 418493.594594594595,
		mmp_domains: '{singular.net,sng.link}',
		top_md5_hashes:
			'{d889e4246dfd7e887cb19d6171dcb441,81f52d74f0406962739d4811ceebc9ca,19e4da49085903956e0b7ebdd4a70ed5,609b3104d06fbe02421d50ae8a9a6106,9b44f986fdaf21611d34129a54ac1190}'
	},
	{
		advertiser_name: 'myVEGAS Slots: Real Rewards',
		advertiser_store_id: 'com.playstudios.myvegas',
		advertiser_icon_url_100: '919b3e6c23b36265.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 23096802,
		unique_creatives: 4,
		unique_publishers: 13,
		first_seen: '2025-10-11T21:55:30.511Z',
		last_seen: '2025-10-18T17:56:13.127Z',
		ad_network_domains: '{appodeal.com,digitalturbine.com,google.com,youappi.com}',
		avg_publisher_installs: 3281406.833333333333,
		mmp_domains: '{adjust.com,singular.net,sng.link}',
		top_md5_hashes:
			'{086430e86a698512440a9f6fd21a7c6b,9613428b7b16b11f7619ecd0b4269603,cec4daf2233cf3794011aa988f04a21a,086430e86a698512440a9f6fd21a7c6b,9613428b7b16b11f7619ecd0b4269603}'
	},
	{
		advertiser_name: 'Bible Crossword - Word Puzzle',
		advertiser_store_id: 'com.econogames.bible.crossword.gp',
		advertiser_icon_url_100: '95289f5fc34a2b1a.png',
		advertiser_category: 'game_word',
		advertiser_installs: 460529,
		unique_creatives: 5,
		unique_publishers: 12,
		first_seen: '2025-10-15T13:41:44.212Z',
		last_seen: '2025-10-19T08:37:39.892Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 2447472.923076923077,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{48c941dbea122c1e05ffb0403afe6179,fc0c88450b9c3a6cffb9db1b89e0f6d8,48c941dbea122c1e05ffb0403afe6179,9c07ed4cf9d0d655a513dc0b2bb45d29,48c941dbea122c1e05ffb0403afe6179}'
	},
	{
		advertiser_name: 'Solitaire - 2025',
		advertiser_store_id: 'com.evergreen.games.card.solitaire.free',
		advertiser_icon_url_100: 'baea40b5159e45e3.png',
		advertiser_category: 'game_card',
		advertiser_installs: 6292811,
		unique_creatives: 6,
		unique_publishers: 11,
		first_seen: '2025-10-01T08:58:29.353Z',
		last_seen: '2025-10-01T10:45:40.063Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5578717.666666666667,
		mmp_domains: '{adjust.com,appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{c3e43502405b1dd0f275dff86df77e39,8d4a60d0ca49b473fe31bc2796fbff4d,c3e43502405b1dd0f275dff86df77e39,82ae19395fa7b10326b4bea3905e158d,fab0542f590cdde39643aa631477416a}'
	},
	{
		advertiser_name: 'Inbox Homescreen',
		advertiser_store_id: 'com.eet.email.launcher',
		advertiser_icon_url_100: 'd3ac2cf234cb932c.jpeg',
		advertiser_category: 'communication',
		advertiser_installs: 2442420,
		unique_creatives: 6,
		unique_publishers: 10,
		first_seen: '2025-10-04T13:19:35.242Z',
		last_seen: '2025-10-28T15:37:31.259Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4463207.416666666667,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{5e48c72dd1702dada0366d960899dd90,112640617c807dbde2c9b5990db723e9,1da699f3c0502f27b79b22bacb910dfa,1da699f3c0502f27b79b22bacb910dfa,997b908a144e2bb41fa722835f343254}'
	},
	{
		advertiser_name: 'Play To Win: Real Money Games',
		advertiser_store_id: 'net.playtowingames.casino',
		advertiser_icon_url_100: 'da2061de695e155e.jpeg',
		advertiser_category: 'game_casino',
		advertiser_installs: 6949223,
		unique_creatives: 3,
		unique_publishers: 10,
		first_seen: '2025-10-01T04:43:44.063Z',
		last_seen: '2025-10-18T03:55:12.602Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4271070.3,
		mmp_domains: '{tenjin.com}',
		top_md5_hashes:
			'{a16e2d4ab1ee55408a578942e1512fcb,917251223759fa478486c3950a8e24e9,2e9c35ff70ed2eebcb62efc056e23f56,2e9c35ff70ed2eebcb62efc056e23f56,a16e2d4ab1ee55408a578942e1512fcb}'
	},
	{
		advertiser_name: 'Bigo Live - Live Streaming App',
		advertiser_store_id: 'sg.bigo.live',
		advertiser_icon_url_100: '840f072f05ee5cf9.png',
		advertiser_category: 'social networking',
		advertiser_installs: 758187711,
		unique_creatives: 9,
		unique_publishers: 10,
		first_seen: '2025-10-03T13:32:25.473Z',
		last_seen: '2025-10-18T00:17:14.018Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5113534.2,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{1e0d02d8a116bb588dcba85188211e7b,0cc1b2c3faf8a55ae403dd8be8708d50,03d07e85a21e972e957ff57292eb788a,43389a7ad2ddff9220058572521f88b2,03d07e85a21e972e957ff57292eb788a}'
	},
	{
		advertiser_name: 'CashQuest: Play to Earn Cash',
		advertiser_store_id: 'com.mistplay.mistplay.cashquest',
		advertiser_icon_url_100: 'c1533b6c6ad10d3e.png',
		advertiser_category: 'lifestyle',
		advertiser_installs: 113139,
		unique_creatives: 10,
		unique_publishers: 10,
		first_seen: '2025-10-01T18:25:04.963Z',
		last_seen: '2025-10-07T17:03:59.763Z',
		ad_network_domains: '{amazonaws.com,appodeal.com,smadex.com}',
		avg_publisher_installs: 70529880.371428571429,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{f327b7bc0f0aed21cb6b1be8e21d6423,70e8bbaa5dc33bc345944cd0c9ae9021,710266547537c427730a1872b0ad199a,faf89b285eba3df7e7308f3334c3923a,f327b7bc0f0aed21cb6b1be8e21d6423}'
	},
	{
		advertiser_name: 'Redfin: Buy, Sell & Rent Homes',
		advertiser_store_id: 'com.redfin.android',
		advertiser_icon_url_100: 'fb39a46cc139946c.png',
		advertiser_category: 'house_and_home',
		advertiser_installs: 9837733,
		unique_creatives: 6,
		unique_publishers: 9,
		first_seen: '2025-10-11T14:22:17.187Z',
		last_seen: '2025-10-27T08:35:58.070Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 11033133.090909090909,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{4d84118d100010280abc4cb1a1f3ba8e,c82cb762a5ba316a2f6252251a1a767d,947d8b0a6942f39b01d14a5f721898a3,4fe4308c2c3a7e39c9d339fadf4ab14a,4fe4308c2c3a7e39c9d339fadf4ab14a}'
	},
	{
		advertiser_name: 'AliExpress - Shopping App',
		advertiser_store_id: 'com.alibaba.aliexpresshd',
		advertiser_icon_url_100: 'c51b6ec9316cd392.jpeg',
		advertiser_category: 'shopping',
		advertiser_installs: 787716764,
		unique_creatives: 2,
		unique_publishers: 9,
		first_seen: '2025-10-04T03:12:43.977Z',
		last_seen: '2025-10-23T15:45:54.798Z',
		ad_network_domains: '{google.com,opera.com,unity.com}',
		avg_publisher_installs: 3586649.0,
		mmp_domains: '{appsflyer.com,developer.huawei.com}',
		top_md5_hashes:
			'{4f7de228025c800c46647f2c481e55be,4f7de228025c800c46647f2c481e55be,4f7de228025c800c46647f2c481e55be,4f7de228025c800c46647f2c481e55be,4f7de228025c800c46647f2c481e55be}'
	},
	{
		advertiser_name: 'BET+',
		advertiser_store_id: 'com.viacom.betplus',
		advertiser_icon_url_100: 'a93fc6c893c46695.jpeg',
		advertiser_category: 'entertainment',
		advertiser_installs: 8427218,
		unique_creatives: 5,
		unique_publishers: 9,
		first_seen: '2025-09-30T19:11:54.157Z',
		last_seen: '2025-10-26T11:03:57.992Z',
		ad_network_domains: '{amazonaws.com,google.com,smadex.com}',
		avg_publisher_installs: 2940416.2,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{fa689db7473af4798f1d234952047824,8400e7ff57432c24ab3fa14013828fb4,8400e7ff57432c24ab3fa14013828fb4,8400e7ff57432c24ab3fa14013828fb4,8400e7ff57432c24ab3fa14013828fb4}'
	},
	{
		advertiser_name: 'ABCmouse 2: Kids Learning Game',
		advertiser_store_id: 'com.aofl.abcmouse',
		advertiser_icon_url_100: 'b98e716586c99a9c.png',
		advertiser_category: 'education',
		advertiser_installs: 1706291,
		unique_creatives: 2,
		unique_publishers: 8,
		first_seen: '2025-10-01T05:21:19.850Z',
		last_seen: '2025-10-27T05:56:11.699Z',
		ad_network_domains: '{google.com,unity.com}',
		avg_publisher_installs: 3570849.461538461538,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{dfa5580a71d4d78a57bbafff5c39e7f0,dfa5580a71d4d78a57bbafff5c39e7f0,dfa5580a71d4d78a57bbafff5c39e7f0,dfa5580a71d4d78a57bbafff5c39e7f0,dfa5580a71d4d78a57bbafff5c39e7f0}'
	},
	{
		advertiser_name: 'Cars.com: Buy and sell cars',
		advertiser_store_id: 'com.cars.android',
		advertiser_icon_url_100: '814b3e3ec1cb3636.png',
		advertiser_category: 'auto_and_vehicles',
		advertiser_installs: 13765513,
		unique_creatives: 8,
		unique_publishers: 8,
		first_seen: '2025-10-15T16:08:15.205Z',
		last_seen: '2025-10-27T12:41:12.607Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 924711.28,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{1c626c7b87a221c1b37f76e6888e6b4e,0c0439bd5e1dd3c35cbe36921abee1a2,1012b947a5e1a8a096fb997f08ed8539,d5b341f0dd005a5339086849f10c7748,a15ad86edd5cbacbbe1a097a8d4adc18}'
	},
	{
		advertiser_name: 'Sliding Puzzle: Classic Wood',
		advertiser_store_id: 'com.andreyrebrik.fifteen',
		advertiser_icon_url_100: 'a0daad7a5a2d5a25.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 1444410,
		unique_creatives: 6,
		unique_publishers: 7,
		first_seen: '2025-10-06T00:15:26.047Z',
		last_seen: '2025-10-27T16:14:04.323Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 4990826.666666666667,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{6dd54845c40c36f834bf2c463539eef0,cabb60bf3b311f58986d68daeaac4b66,48303f519d426ceea778fc0a9c16d4d2,6dd54845c40c36f834bf2c463539eef0,6dd54845c40c36f834bf2c463539eef0}'
	},
	{
		advertiser_name: 'Google Ads',
		advertiser_store_id: 'com.google.android.apps.adwords',
		advertiser_icon_url_100: 'c64b39b448a33fe1.png',
		advertiser_category: 'business',
		advertiser_installs: 37520387,
		unique_creatives: 1,
		unique_publishers: 7,
		first_seen: '2025-10-01T07:51:48.317Z',
		last_seen: '2025-10-17T22:37:42.246Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 3384310.0,
		mmp_domains: null,
		top_md5_hashes:
			'{f30148d6c4645869a8080f02b9534868,f30148d6c4645869a8080f02b9534868,f30148d6c4645869a8080f02b9534868,ded513fe20b0b3d15fc375fefd59e79a,ded513fe20b0b3d15fc375fefd59e79a}'
	},
	{
		advertiser_name: 'Nomad Life',
		advertiser_store_id: 'com.nomad.aw',
		advertiser_icon_url_100: '8f34d0cde427331b.jpeg',
		advertiser_category: 'travel_and_local',
		advertiser_installs: 7928,
		unique_creatives: 4,
		unique_publishers: 6,
		first_seen: '2025-09-30T22:40:28.653Z',
		last_seen: '2025-10-07T17:03:59.763Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 12717800.5,
		mmp_domains: null,
		top_md5_hashes:
			'{36a0efdad82b9b0e72d0390054317e8d,973c9b155b202c97fc0348a59102c60e,92522505c844a2eb11f16880dee63e34,973c9b155b202c97fc0348a59102c60e,f7d6acd6287b7b9e91c518a87c97f306}'
	},
	{
		advertiser_name: 'Block Blast!',
		advertiser_store_id: 'com.block.juggle',
		advertiser_icon_url_100: 'd414496f667369cc.jpeg',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 664575573,
		unique_creatives: 5,
		unique_publishers: 6,
		first_seen: '2025-10-01T06:04:04.492Z',
		last_seen: '2025-10-14T22:13:05.398Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 19460334.666666666667,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{710405e41bc759e4d76ccbbc6134943e,6686420ec14bea7264f1ee0c2c9ea820,70d20fd0a3b815383fcab4db14a3006b,5b36393bdb6860f18bc9e428af10640a,e0ec89a37582a82c5adf02e2ae897058}'
	},
	{
		advertiser_name: 'Mia QR-Scan',
		advertiser_store_id: 'com.miascan.qrcode',
		advertiser_icon_url_100: 'a57067121f4b697c.png',
		advertiser_category: 'tools',
		advertiser_installs: 64568,
		unique_creatives: 3,
		unique_publishers: 6,
		first_seen: '2025-10-15T15:56:13.340Z',
		last_seen: '2025-10-19T00:16:50.386Z',
		ad_network_domains: '{unity.com}',
		avg_publisher_installs: 2083306.166666666667,
		mmp_domains: null,
		top_md5_hashes:
			'{33f56cf1f4b4cabb0e7967f79e0229ed,d1797140ac561c115f54a6837f2c8235,0a174b9b4223e8dc9a57862e060d8907,33f56cf1f4b4cabb0e7967f79e0229ed,d1797140ac561c115f54a6837f2c8235}'
	},
	{
		advertiser_name: 'MoneyTime - Play & Earn Money',
		advertiser_store_id: 'com.money.time',
		advertiser_icon_url_100: 'd1fa764441e52b4b.png',
		advertiser_category: 'entertainment',
		advertiser_installs: 1948129,
		unique_creatives: 3,
		unique_publishers: 6,
		first_seen: '2025-10-07T01:14:21.037Z',
		last_seen: '2025-10-15T21:03:19.003Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4123949.428571428571,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{d971db2681d57a54b21b5a85e27abd6d,a2db754b38379aba188631d168b7e75c,d971db2681d57a54b21b5a85e27abd6d,d971db2681d57a54b21b5a85e27abd6d,d971db2681d57a54b21b5a85e27abd6d}'
	},
	{
		advertiser_name: 'Shopify: Sell online\/in person',
		advertiser_store_id: 'com.shopify.mobile',
		advertiser_icon_url_100: 'c63e39c46693623b.png',
		advertiser_category: 'business',
		advertiser_installs: 24389806,
		unique_creatives: 9,
		unique_publishers: 6,
		first_seen: '2025-10-02T19:01:12.006Z',
		last_seen: '2025-10-07T07:25:05.652Z',
		ad_network_domains: '{amazonaws.com,appodeal.com,bidease.com,google.com,smadex.com}',
		avg_publisher_installs: 61972094.75,
		mmp_domains: '{sng.link}',
		top_md5_hashes:
			'{a3e64320592830464b0b0f5835d7f788,5b2b4aff15b6c8bf991a7fab4191a6ca,4fd9d780d804441807a1788b2528738b,d7770ab437dc6d2c7e8c53b69d2d8b37,8ea6539de038a1fbf928efac0ecf584f}'
	},
	{
		advertiser_name: 'NewsBreak: Local News & Alerts',
		advertiser_store_id: 'com.particlenews.newsbreak',
		advertiser_icon_url_100: 'b4d9c52e309347d9.png',
		advertiser_category: 'news',
		advertiser_installs: 86166369,
		unique_creatives: 8,
		unique_publishers: 6,
		first_seen: '2025-10-02T13:41:40.815Z',
		last_seen: '2025-10-29T12:01:25.584Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 10094294.8,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{1c8a7c1d4220c3f1fedc7400038d868d,e7f388e61537cff0ea9afb3c4dbc4ec7,209b8c9c0d4ee5fbd895fe60ee80e952,9599c8961fd1b79c74efad25bbb110cd,9d7fa834d11ba3f180d23b17f7893ccc}'
	},
	{
		advertiser_name: 'Duolingo: Language Lessons',
		advertiser_store_id: 'com.duolingo',
		advertiser_icon_url_100: 'b44316b84b96eb3c.png',
		advertiser_category: 'education',
		advertiser_installs: 787649785,
		unique_creatives: 5,
		unique_publishers: 6,
		first_seen: '2025-10-01T07:50:33.909Z',
		last_seen: '2025-10-02T12:33:35.318Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 3000631.428571428571,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{6e9f811ad97e30acf1963ba40b5e6fbd,6e9f811ad97e30acf1963ba40b5e6fbd,d6bb5186955cc3c0c364c3e78efb7203,07aaaf87d8539e241a83fbe234a794ac,f439ed7b5deba6cbc9caf42a54bf9f98}'
	},
	{
		advertiser_name: 'BeSoccer - Soccer Live Scores',
		advertiser_store_id: 'com.resultadosfutbol.mobile',
		advertiser_icon_url_100: 'ccca3c74d222cdcb.png',
		advertiser_category: 'sports',
		advertiser_installs: 109695878,
		unique_creatives: 4,
		unique_publishers: 6,
		first_seen: '2025-10-11T11:22:45.538Z',
		last_seen: '2025-10-25T11:21:59.679Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4304103.333333333333,
		mmp_domains: null,
		top_md5_hashes:
			'{e26dc19a316f2209ce85e85ae14f9631,e78518d45187e6ba5581e4319aa67d16,f5879fd1307e42bc42a9370bbd617395,a6767cdb4ab336a0acf2395281bda617,b13f0405bcb418f4d5b4e2112d209869}'
	},
	{
		advertiser_name: 'Spades - Card Game',
		advertiser_store_id: 'com.blackout.spades',
		advertiser_icon_url_100: '84b43b5a6d351fb0.png',
		advertiser_category: 'game_card',
		advertiser_installs: 9046314,
		unique_creatives: 2,
		unique_publishers: 6,
		first_seen: '2025-10-03T18:46:09.697Z',
		last_seen: '2025-10-14T02:49:03.649Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 16740609.428571428571,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{3e646724df6622365ccfd56c3029a98c,7242e20756110eb2278b862a81e61e29,7242e20756110eb2278b862a81e61e29,7242e20756110eb2278b862a81e61e29,7242e20756110eb2278b862a81e61e29}'
	},
	{
		advertiser_name: 'Flood-It!',
		advertiser_store_id: 'com.labpixies.flood',
		advertiser_icon_url_100: 'c578856e303e6b27.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 4802377,
		unique_creatives: 2,
		unique_publishers: 6,
		first_seen: '2025-10-01T10:07:40.791Z',
		last_seen: '2025-10-26T05:39:04.324Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1141169.666666666667,
		mmp_domains: null,
		top_md5_hashes:
			'{f30148d6c4645869a8080f02b9534868,4ba819d0e083233bc8d8af732753d5de,f30148d6c4645869a8080f02b9534868,4ba819d0e083233bc8d8af732753d5de,4ba819d0e083233bc8d8af732753d5de}'
	},
	{
		advertiser_name: 'Magic Fantasy Paint by Numbers',
		advertiser_store_id: 'com.color.by.numbers.focus.color',
		advertiser_icon_url_100: 'eeb590f0c1c3c4ce.png',
		advertiser_category: 'game_board',
		advertiser_installs: 130383,
		unique_creatives: 2,
		unique_publishers: 5,
		first_seen: '2025-10-11T11:40:18.837Z',
		last_seen: '2025-10-15T08:35:14.255Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 9044697.833333333333,
		mmp_domains: '{appsflyer.com,singular.net}',
		top_md5_hashes:
			'{87af5b7e8f6479c0c699458c80862c52,87af5b7e8f6479c0c699458c80862c52,87af5b7e8f6479c0c699458c80862c52,87af5b7e8f6479c0c699458c80862c52,67ae5a266c82cd75c5bc799db1dfffc5}'
	},
	{
		advertiser_name: 'PlayMore',
		advertiser_store_id: 'com.selkirk.playmoreapp',
		advertiser_icon_url_100: 'b963c69c68613b66.png',
		advertiser_category: 'sports',
		advertiser_installs: 643,
		unique_creatives: 4,
		unique_publishers: 5,
		first_seen: '2025-10-14T23:05:47.611Z',
		last_seen: '2025-10-20T06:54:48.832Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 2565484.166666666667,
		mmp_domains: null,
		top_md5_hashes:
			'{defba650be2a71a748f5897d87157fbc,248d406793cb2bcc37d2df0404382610,2de3a5633fdfa10d099391a7731b4c9d,03a414945fc0f9a30b8c91c61449c95c,defba650be2a71a748f5897d87157fbc}'
	},
	{
		advertiser_name: 'Mercari: Buy and Sell App',
		advertiser_store_id: 'com.mercariapp.mercari',
		advertiser_icon_url_100: 'c4ec3b13c4ec3b13.png',
		advertiser_category: 'shopping',
		advertiser_installs: 29384919,
		unique_creatives: 6,
		unique_publishers: 5,
		first_seen: '2025-10-11T16:25:11.636Z',
		last_seen: '2025-10-18T01:19:53.381Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5669078.625,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{00de89ce7849fa1e1869136971d7e4c0,3f2bc0912980a3d414ecc69601f890f5,fe4542e0c82196d565cfe129c2cc1ed6,5b6d1c881157c65a59ceaa71a78f99bf,4d9710bb40843944743bf8e9daa523b7}'
	},
	{
		advertiser_name: 'Solitaire Classic: Card Game',
		advertiser_store_id: 'com.niuaigo.solitaire.klondike',
		advertiser_icon_url_100: 'd041663f1d3b0be6.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 1703456,
		unique_creatives: 2,
		unique_publishers: 5,
		first_seen: '2025-10-01T10:03:46.292Z',
		last_seen: '2025-10-19T20:32:34.252Z',
		ad_network_domains: '{unity.com}',
		avg_publisher_installs: 2328855.2,
		mmp_domains: null,
		top_md5_hashes:
			'{a05aa3deee82e415db39161086356a8e,a05aa3deee82e415db39161086356a8e,de5a3a61bd3fad55508595520606bd25,de5a3a61bd3fad55508595520606bd25,de5a3a61bd3fad55508595520606bd25}'
	},
	{
		advertiser_name: 'YouTube Kids',
		advertiser_store_id: 'com.google.android.apps.youtube.kids',
		advertiser_icon_url_100: 'f86785984e987963.png',
		advertiser_category: 'entertainment',
		advertiser_installs: 808687487,
		unique_creatives: 1,
		unique_publishers: 5,
		first_seen: '2025-10-04T02:19:19.961Z',
		last_seen: '2025-10-17T22:37:42.246Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1571517.6,
		mmp_domains: null,
		top_md5_hashes:
			'{f30148d6c4645869a8080f02b9534868,f30148d6c4645869a8080f02b9534868,f30148d6c4645869a8080f02b9534868,f30148d6c4645869a8080f02b9534868,f30148d6c4645869a8080f02b9534868}'
	},
	{
		advertiser_name: 'Dominoes - classic domino game',
		advertiser_store_id: 'org.sabgames.domino',
		advertiser_icon_url_100: '97903e06396f61d9.png',
		advertiser_category: 'game_board',
		advertiser_installs: 1807381,
		unique_creatives: 4,
		unique_publishers: 5,
		first_seen: '2025-10-01T08:16:01.972Z',
		last_seen: '2025-10-26T15:59:45.411Z',
		ad_network_domains: '{bidease.com,google.com}',
		avg_publisher_installs: 3492231.0,
		mmp_domains: '{appmetrica.yandex.com,appsflyer.com,devtodev.com,metrica.yandex.com}',
		top_md5_hashes:
			'{3f44780f6d09aefd12e7d0013c9f6653,70608d6b35ccc3fb36ea662ca2d3fc7f,3f44780f6d09aefd12e7d0013c9f6653,aa4d3722237e7971685593c3351a1321,54f8910985007fd199bfbdd424860454}'
	},
	{
		advertiser_name: 'Crypto.com: Buy BTC, ETH & CRO',
		advertiser_store_id: 'co.mona.android',
		advertiser_icon_url_100: 'dcf96ae26869a492.jpeg',
		advertiser_category: 'finance',
		advertiser_installs: 45851305,
		unique_creatives: 3,
		unique_publishers: 5,
		first_seen: '2025-10-14T02:49:03.649Z',
		last_seen: '2025-10-23T07:10:37.889Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4988843.8,
		mmp_domains: '{appsflyer.com,branch.io}',
		top_md5_hashes:
			'{451db2948f422844cd77fe3ed36ced15,a8a60ccc1d567457ec4dae27676999e8,155a34aa1435b6a2962ce30009305404,155a34aa1435b6a2962ce30009305404,155a34aa1435b6a2962ce30009305404}'
	},
	{
		advertiser_name: 'Yukon Russian - Solitaire Game',
		advertiser_store_id: 'com.mobilityware.YukonRussian',
		advertiser_icon_url_100: 'c15868e6358e4b9f.png',
		advertiser_category: 'game_card',
		advertiser_installs: 316626,
		unique_creatives: 3,
		unique_publishers: 5,
		first_seen: '2025-10-14T15:14:57.691Z',
		last_seen: '2025-10-20T23:48:59.691Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 3308366.285714285714,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{ed5f20af138903056bd817f23699784f,d9a14dd3a21c693ecb2f16091d8a6bd1,d9a14dd3a21c693ecb2f16091d8a6bd1,d9a14dd3a21c693ecb2f16091d8a6bd1,05ea4fff3b261505bbe473b0f15fe178}'
	},
	{
		advertiser_name: 'Pocket FM: Audio Series',
		advertiser_store_id: 'com.radio.pocketfm',
		advertiser_icon_url_100: 'c39e3c693622cb9a.png',
		advertiser_category: 'music_and_audio',
		advertiser_installs: 199408468,
		unique_creatives: 4,
		unique_publishers: 4,
		first_seen: '2025-10-01T19:14:28.846Z',
		last_seen: '2025-10-14T22:13:05.398Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5435682.25,
		mmp_domains: '{appsflyer.com,branch.io}',
		top_md5_hashes:
			'{0d8616d06a032ea8628cfaf8111c79b5,e7f49935192436fc631c78e35eb62724,a2f8f4d38c20b9af6b9940626f21711b,de0c80c08efe2f1ef129c048d470468c}'
	},
	{
		advertiser_name: 'LEGO® Play',
		advertiser_store_id: 'com.lego.common.legoplay',
		advertiser_icon_url_100: 'd42737cd68301fb2.jpeg',
		advertiser_category: 'entertainment',
		advertiser_installs: 8505527,
		unique_creatives: 3,
		unique_publishers: 4,
		first_seen: '2025-10-01T23:46:32.094Z',
		last_seen: '2025-10-25T10:07:53.206Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 2704422.0,
		mmp_domains: null,
		top_md5_hashes:
			'{9a162953d2cea2909f137f80ae6ed52c,8732d4ac2f0cbb1e614dd39c16d33dc9,9a162953d2cea2909f137f80ae6ed52c,9186b39ce72ca21b59ecda99ca018ce2}'
	},
	{
		advertiser_name: 'TutoFlips - Pet Doll House',
		advertiser_store_id: 'com.tutotoons.app.tutoflips',
		advertiser_icon_url_100: 'e59481db414dd637.png',
		advertiser_category: 'game_educational',
		advertiser_installs: 673816,
		unique_creatives: 4,
		unique_publishers: 4,
		first_seen: '2025-10-03T01:17:29.707Z',
		last_seen: '2025-10-17T04:33:05.958Z',
		ad_network_domains: '{tutoads.tv}',
		avg_publisher_installs: 26299253.428571428571,
		mmp_domains: '{singular.net}',
		top_md5_hashes:
			'{62eb58017dd08c148406bdef94d7791b,0f83f610fee7ccc6028d8b68388046f7,c52c700a136d52cdf56a10799767573c,0f83f610fee7ccc6028d8b68388046f7,c52c700a136d52cdf56a10799767573c}'
	},
	{
		advertiser_name: 'Sudoku Jigsaw',
		advertiser_store_id: 'com.puzzling.suji',
		advertiser_icon_url_100: '949e6b636fb4e048.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 7014,
		unique_creatives: 2,
		unique_publishers: 4,
		first_seen: '2025-10-14T17:55:02.354Z',
		last_seen: '2025-10-14T22:46:15.413Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5214209.6,
		mmp_domains: null,
		top_md5_hashes:
			'{6164e59844ec3178c435f531a6dafeb3,d907870eed137e5c79e3b534cef8f808,d907870eed137e5c79e3b534cef8f808,6164e59844ec3178c435f531a6dafeb3,d907870eed137e5c79e3b534cef8f808}'
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

function processData(data: AppAdImpactGrowthData[]) {
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
	const apps = processData(adImpactGrowthData);

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
			reportPeriod: 'October 2025',
			generatedDate: 'Novembr 2025'
		},
		topApps,
		// Meta Tags
		title: 'User Acquisition Report - October 2025 | AppGoblin',
		description:
			'See October 2025 largest mobile ad campaigns, ad networks and the creatives that powered them.',
		keywords:
			'user acquisition, mobile ad campaigns, app marketing, mobile advertising, ad creatives, app growth, install growth'
	};
};
