import type { PageServerLoad } from '../../$types';

interface AppAdImpactGrowthData {
	best_week: string;
	app_name: string;
	store_id: string;
	icon_url_100: string;
	in_app_purchases: boolean;
	ad_supported: boolean;
	weekly_installs: number;
	weekly_percent_increase: number;
	baseline_installs: number;
	baseline_installs_pct: number;
	installs_z_score_2w: number;
	installs_z_score_4w: number;
	installs_acceleration: number;
	wow_growth_pct: number;
	momentum_pct: number | null;
	composite_score: number;
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
		apps_analyzed: 11956,
		https_tracked: 223035,
		api_domains: 3340,
		adtech_companies: 181,
		advertisers: 86,
		creative_count: 4867
	}
];

const rawMostPopularCreatives = [
	{
		phash: '6b842f953e61',
		md5_hash: 'b7729426d524a3400f695d743c576974',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 11,
		first_seen: '2026-01-15T08:58:56.770Z',
		last_seen: '2026-01-31T15:13:47.809Z',
		advertiser_store_id: 'com.logoquiz.triviagame',
		advertiser_icon_url_100: '98ca66846df36336.png'
	},
	{
		phash: '3ffd7a336b4f',
		md5_hash: 'f8a316855af8ab878cb05c6c462f8864',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 10,
		first_seen: '2025-12-31T20:26:18.210Z',
		last_seen: '2026-01-28T21:15:15.649Z',
		advertiser_store_id: 'com.productmadness.fafafagold',
		advertiser_icon_url_100: 'd11e69b262bd16c3.png'
	},
	{
		phash: 'b6dac73d77f9',
		md5_hash: '0919fae85dbbb775d9bda36e642f49ba',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 8,
		first_seen: '2026-01-15T03:30:05.284Z',
		last_seen: '2026-01-30T23:31:02.570Z',
		advertiser_store_id: 'com.shopkick.app',
		advertiser_icon_url_100: '9e8865b361cd6633.png'
	},
	{
		phash: 'd3c341f3f685',
		md5_hash: 'e9bb7b77622ee95f82ce5d3a51b4ee22',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 7,
		first_seen: '2026-01-19T16:41:48.955Z',
		last_seen: '2026-01-30T23:31:02.570Z',
		advertiser_store_id: 'com.shopkick.app',
		advertiser_icon_url_100: '9e8865b361cd6633.png'
	},
	{
		phash: '0f6b5fb93d7f',
		md5_hash: 'ed70cc2a196dbe552d8ebb9616153c2e',
		file_extension: 'webm',
		advertiser_count: 1,
		publisher_count: 4,
		first_seen: '2026-01-03T10:30:54.720Z',
		last_seen: '2026-01-04T00:05:41.755Z',
		advertiser_store_id: 'com.kolmogames.logoquiz',
		advertiser_icon_url_100: '8cc54af0338974fe.png'
	},
	{
		phash: '69b77eda7520',
		md5_hash: 'd732b64891b6462da5d0ebcb213b4ec2',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 4,
		first_seen: '2026-01-15T00:57:19.534Z',
		last_seen: '2026-01-28T19:35:36.350Z',
		advertiser_store_id: 'com.productmadness.fafafagold',
		advertiser_icon_url_100: 'd11e69b262bd16c3.png'
	},
	{
		phash: '9fdad42ea6fd',
		md5_hash: '597a049dc55a2aed803903eb347a9a8f',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 4,
		first_seen: '2026-01-03T04:16:34.513Z',
		last_seen: '2026-01-31T06:55:28.116Z',
		advertiser_store_id: 'com.xt.retouchoversea',
		advertiser_icon_url_100: '92d3693d246592f3.jpeg'
	},
	{
		phash: '37b6c19cb39f',
		md5_hash: '4f7de228025c800c46647f2c481e55be',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 3,
		first_seen: '2026-01-04T13:34:55.085Z',
		last_seen: '2026-01-28T19:20:10.049Z',
		advertiser_store_id: 'com.alibaba.aliexpresshd',
		advertiser_icon_url_100: 'c51b6ec9316cd392.jpeg'
	},
	{
		phash: 'a75ca5d2b553',
		md5_hash: '6a8035b73da0385a10a3879f3a4dca9a',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 2,
		first_seen: '2026-01-15T13:13:39.657Z',
		last_seen: '2026-01-15T18:55:31.223Z',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png'
	},
	{
		phash: 'b6c17b85c73b',
		md5_hash: '1868be0cbe34dab92be6aac9fc80b74f',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 2,
		first_seen: '2026-01-21T14:33:00.758Z',
		last_seen: '2026-01-28T02:43:18.409Z',
		advertiser_store_id: 'com.logoquiz.triviagame',
		advertiser_icon_url_100: '98ca66846df36336.png'
	}
];
const rawAdNetworkData: AdNetworkData[] = [
	{
		ad_network_name: 'Google',
		ad_network_domain: 'google.com',
		company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		all_domains: '{google.com}',
		publisher_count: 548,
		advertiser_count: 63,
		creatives_count: 578
	},
	{
		ad_network_name: 'AppLovin',
		ad_network_domain: 'applovin.com',
		company_logo_url: 'company-logos\/applovin.com\/logo_200x200.jpeg',
		all_domains: '{applovin.com}',
		publisher_count: 96,
		advertiser_count: 0,
		creatives_count: 177
	},
	{
		ad_network_name: 'Adikteev',
		ad_network_domain: 'adikteev.com',
		company_logo_url: 'company-logos\/adikteev.com\/logo_200x200.jpeg',
		all_domains: '{adikteev.com}',
		publisher_count: 80,
		advertiser_count: 3,
		creatives_count: 41
	},
	{
		ad_network_name: 'Remerge',
		ad_network_domain: 'remerge.io',
		company_logo_url: 'company-logos\/remerge.io\/logo_200x200.jpeg',
		all_domains: '{remerge.io}',
		publisher_count: 63,
		advertiser_count: 1,
		creatives_count: 36
	},
	{
		ad_network_name: 'Criteo',
		ad_network_domain: 'criteo.com',
		company_logo_url: 'company-logos\/criteo.com\/logo_200x200.jpeg',
		all_domains: '{criteo.com}',
		publisher_count: 59,
		advertiser_count: 0,
		creatives_count: 49
	},
	{
		ad_network_name: 'Mobvista',
		ad_network_domain: 'mobvista.com',
		company_logo_url: 'company-logos\/mobvista.com\/logo_200x200.jpeg',
		all_domains: '{mintegral.com}',
		publisher_count: 46,
		advertiser_count: 7,
		creatives_count: 47
	},
	{
		ad_network_name: 'Bigabid',
		ad_network_domain: 'bigabid.com',
		company_logo_url: 'company-logos\/bigabid.com\/logo_200x200.jpeg',
		all_domains: '{bigabid.com}',
		publisher_count: 46,
		advertiser_count: 3,
		creatives_count: 18
	},
	{
		ad_network_name: 'Affle',
		ad_network_domain: 'affle.com',
		company_logo_url: 'company-logos\/affle.com\/logo_200x200.jpeg',
		all_domains: '{youappi.com}',
		publisher_count: 31,
		advertiser_count: 2,
		creatives_count: 19
	},
	{
		ad_network_name: 'Unity',
		ad_network_domain: 'unity.com',
		company_logo_url: 'company-logos\/unity.com\/logo_200x200.jpeg',
		all_domains: '{unity.com,unity3d.com}',
		publisher_count: 30,
		advertiser_count: 7,
		creatives_count: 34
	},
	{
		ad_network_name: 'Digital Turbine',
		ad_network_domain: 'digitalturbine.com',
		company_logo_url: 'company-logos\/digitalturbine.com\/logo_200x200.jpeg',
		all_domains: '{fyber.com}',
		publisher_count: 29,
		advertiser_count: 7,
		creatives_count: 54
	}
];
const adImpactGrowthData: AppAdImpactGrowthData[] = [
	{
		best_week: '2026-01-26',
		app_name: 'SEGA FOOTBALL CLUB CHAMPIONS',
		store_id: 'com.sega.FootballClubChampions',
		icon_url_100: 'c84f155d9a5e01f5.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 779737,
		weekly_percent_increase: 76464.90573448547,
		baseline_installs: 1018.4,
		baseline_installs_pct: 87165.61272584446,
		installs_z_score_2w: 390.2954618493217,
		installs_z_score_4w: 194.92384936767758,
		installs_acceleration: 1.0,
		wow_growth_pct: -21.845685378910662,
		momentum_pct: null,
		composite_score: 195.10403955390305,
		phash: 'c84f155d9a5e01f5',
		file_extension: 'webp',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '79d8d4d129e3886d9d72a3c7a361b8c8',
		pub_count: 2
	},
	{
		best_week: '2026-01-26',
		app_name: 'Logo Quest: Brand Trivia',
		store_id: 'com.wolfking.logo.quiz',
		icon_url_100: '81cff4a43d7823a6.png',
		in_app_purchases: false,
		ad_supported: true,
		weekly_installs: 715,
		weekly_percent_increase: 3150.0,
		baseline_installs: 22.0,
		baseline_installs_pct: 3150.0,
		installs_z_score_2w: 73.25237616982223,
		installs_z_score_4w: 36.38835569474936,
		installs_acceleration: 0.9522184300341296,
		wow_growth_pct: 0.0,
		momentum_pct: 3985.714285714286,
		composite_score: 48.58333094205397,
		phash: '972c66866db61fc3',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		md5_hash: '1a861f963ad34f3ac2553c60e4615334',
		pub_count: 1
	},
	{
		best_week: '2026-01-19',
		app_name: 'jcb game - happy truck repair',
		store_id: 'com.blackatomgames.toontruckwashandrepair',
		icon_url_100: 'bebcb3409de2c489.png',
		in_app_purchases: false,
		ad_supported: true,
		weekly_installs: 360,
		weekly_percent_increase: 1891.4893617021276,
		baseline_installs: 18.076923076923077,
		baseline_installs_pct: 1086.595744680851,
		installs_z_score_2w: 13.063645689258419,
		installs_z_score_4w: 6.678907165587181,
		installs_acceleration: 0.810126582278481,
		wow_growth_pct: 421.7391304347826,
		momentum_pct: 853.3333333333334,
		composite_score: 9.935301105498775,
		phash: 'ccf7433a3fe935f9',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: 'c3097329c1d2276c1db2c9fc55431c60',
		pub_count: 1
	},
	{
		best_week: '2026-01-26',
		app_name: 'DoubleU Casino™ - Vegas Slots',
		store_id: 'com.doubleugames.DoubleUCasino',
		icon_url_100: '80835ffb29303ee5.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 42955,
		weekly_percent_increase: 201.376775614179,
		baseline_installs: 14252.923076923076,
		baseline_installs_pct: 133.8432602219248,
		installs_z_score_2w: 2.4021815570028813,
		installs_z_score_4w: 0.7836605706619408,
		installs_acceleration: 0.6277150357121055,
		wow_growth_pct: 81.21414107323659,
		momentum_pct: 337.222878131969,
		composite_score: 2.3751876950438207,
		phash: '85e213423d5fc2bd',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: 'abf0a7077f5ee3f3e8237468d2edb3ca',
		pub_count: 0
	},
	{
		best_week: '2026-01-19',
		app_name: 'Rope Escape Master',
		store_id: 'com.sp.rope.escape.master',
		icon_url_100: '98970ea4f3c92d4e.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 810064,
		weekly_percent_increase: 1179.2198468701677,
		baseline_installs: 63324.846153846156,
		baseline_installs_pct: 712.6454800218166,
		installs_z_score_2w: 3.47386093966255,
		installs_z_score_4w: 3.4970658577294893,
		installs_acceleration: -0.005823759082417445,
		wow_growth_pct: 269.6407467065786,
		momentum_pct: -1.1580078577046706,
		composite_score: 2.2727379396713183,
		phash: 'aafaf485b132c30c',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appmetrica.yandex.com,appsflyer.com,metrica.yandex.com}',
		md5_hash: 'd35654bd8d4381c4b9a5d65282f4fa32',
		pub_count: 1
	},
	{
		best_week: '2026-01-05',
		app_name: 'Cross Stitch:Collection',
		store_id: 'com.cross.stitch.color.by.number',
		icon_url_100: '91e11a9e2fb46e31.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 1670,
		weekly_percent_increase: 211.1206649469762,
		baseline_installs: 536.7692307692307,
		baseline_installs_pct: 239.99713384924047,
		installs_z_score_2w: 1.983897514377979,
		installs_z_score_4w: 0.9132005710850448,
		installs_acceleration: 0.6154016375304271,
		wow_growth_pct: -15.656565656565656,
		momentum_pct: 320.0230149597238,
		composite_score: 1.9207046707550295,
		phash: 'a7f377983372266c',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '5fd1e50dfb903b37f48844c656a6cf11',
		pub_count: 1
	},
	{
		best_week: '2026-01-26',
		app_name: 'Classical KING',
		store_id: 'com.jacobsmedia.kingfm',
		icon_url_100: 'ebc8923762cc1b63.png',
		in_app_purchases: false,
		ad_supported: true,
		weekly_installs: 5876,
		weekly_percent_increase: 155.63215313566695,
		baseline_installs: 2298.6153846153848,
		baseline_installs_pct: 125.50532092898735,
		installs_z_score_2w: 2.5545827913916024,
		installs_z_score_4w: 1.5408997363222894,
		installs_acceleration: 0.2834416589291241,
		wow_growth_pct: 30.8394566911601,
		momentum_pct: 79.11195577055977,
		composite_score: 1.5763061763898005,
		phash: 'e9f6e6b87de19b4f',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: null,
		md5_hash: '15ce7816fc13a352ddecb69cd2f46920',
		pub_count: 1
	},
	{
		best_week: '2026-01-05',
		app_name: 'Escape from Tower: Survival',
		store_id: 'com.escape.from.tower2025',
		icon_url_100: 'd7d53e0e615b4c48.jpeg',
		in_app_purchases: false,
		ad_supported: true,
		weekly_installs: 66477,
		weekly_percent_increase: 454.01051349445476,
		baseline_installs: 11999.23076923077,
		baseline_installs_pct: 449.3727161997564,
		installs_z_score_2w: 3.226650404734317,
		installs_z_score_4w: 4.780336961146384,
		installs_acceleration: -0.2825721422002623,
		wow_growth_pct: 1.7027721681659629,
		momentum_pct: -44.06335252463968,
		composite_score: 1.4845406891295714,
		phash: '9e7569f76b5c7f7a',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '43ad16f12287c0b8095d1591ec1f1042',
		pub_count: 1
	},
	{
		best_week: '2026-01-19',
		app_name: 'ViX:TV, Deportes y Noticias',
		store_id: 'com.univision.prendetv',
		icon_url_100: 'd4ac6bc394fc2983.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 685052,
		weekly_percent_increase: 154.5198057393932,
		baseline_installs: 269154.6923076923,
		baseline_installs_pct: 59.48728083449866,
		installs_z_score_2w: 1.202310200841348,
		installs_z_score_4w: 0.618890977572328,
		installs_acceleration: 0.22099108862170871,
		wow_growth_pct: 294.88134284050886,
		momentum_pct: 56.736472559912514,
		composite_score: 1.3611272037814293,
		phash: '80195d1ff1e11ea7',
		file_extension: 'jpeg',
		host_ad_domain: 'adikteev.com',
		host_company_logo_url: 'company-logos\/adikteev.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '24984cf5e51f2652cabe62336bd57456',
		pub_count: 0
	},
	{
		best_week: '2026-01-05',
		app_name: 'DramaWave - Dramas & Reels',
		store_id: 'com.dramawave.app',
		icon_url_100: '8f5b386536329993.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 2403091,
		weekly_percent_increase: 173.61065239555495,
		baseline_installs: 878288.5384615385,
		baseline_installs_pct: 146.32844506768453,
		installs_z_score_2w: 2.7107087915697337,
		installs_z_score_4w: 4.201833214120126,
		installs_acceleration: -0.24629115835283674,
		wow_growth_pct: 24.909998554986906,
		momentum_pct: -39.52385551356201,
		composite_score: 1.2866028263541545,
		phash: '80633fb3f1b88666',
		file_extension: 'jpeg',
		host_ad_domain: 'opera.com',
		host_company_logo_url: 'company-logos\/opera.com\/logo_200x200.jpeg',
		initial_ad_domain: 'fyber.com',
		initial_company_logo_url: 'company-logos\/fyber.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '01b3a7393f029195b18a572a2c08f56c',
		pub_count: 0
	},
	{
		best_week: '2026-01-26',
		app_name: 'Project Makeover',
		store_id: 'com.bgg.jump',
		icon_url_100: 'c161e31eb53f4d0a.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 253605,
		weekly_percent_increase: 43.90079211965773,
		baseline_installs: 176236.0,
		baseline_installs_pct: 136.30756485621552,
		installs_z_score_2w: 2.2209596583342837,
		installs_z_score_4w: 1.4322084725962063,
		installs_acceleration: 0.2576286157551233,
		wow_growth_pct: -56.22314707248068,
		momentum_pct: 69.40693599529763,
		composite_score: 1.2062543430080734,
		phash: 'bebef9592f1679cf',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: 'fd20313e3c767ddc3fc4cd95c5ac01b4',
		pub_count: 2
	},
	{
		best_week: '2026-01-19',
		app_name: 'Mighty Fu Casino Slots Games',
		store_id: 'com.productmadness.fafafagold',
		icon_url_100: 'd11e69b262bd16c3.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 23895,
		weekly_percent_increase: 130.36278421310234,
		baseline_installs: 10372.76923076923,
		baseline_installs_pct: 58.660620263114964,
		installs_z_score_2w: 1.091507272278479,
		installs_z_score_4w: 0.8079898399937593,
		installs_acceleration: 0.10623781676413255,
		wow_growth_pct: 164.91130820399113,
		momentum_pct: 23.773173391494,
		composite_score: 0.9468957727217038,
		phash: '815d7fa272e2275f',
		file_extension: 'mp4',
		host_ad_domain: 'bigabid.com',
		host_company_logo_url: 'company-logos\/bigabid.com\/logo_200x200.jpeg',
		initial_ad_domain: 'unity3d.com',
		initial_company_logo_url: 'company-logos\/unity3d.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: 'f8a316855af8ab878cb05c6c462f8864',
		pub_count: 0
	},
	{
		best_week: '2026-01-19',
		app_name: 'The Home Depot',
		store_id: 'com.thehomedepot',
		icon_url_100: '813778662cfb50cd.png',
		in_app_purchases: false,
		ad_supported: false,
		weekly_installs: 115529,
		weekly_percent_increase: 85.19787707871431,
		baseline_installs: 62381.38461538462,
		baseline_installs_pct: 21.37274680069745,
		installs_z_score_2w: 0.4189424312060681,
		installs_z_score_4w: -0.1038001878892328,
		installs_acceleration: 0.28159382511256303,
		wow_growth_pct: 221.81676369815315,
		momentum_pct: 78.39404363602092,
		composite_score: 0.8882868739074032,
		phash: 'e9f428f9c634d419',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '4cfdc8877e0d011fd69ed620dce9733c',
		pub_count: 1
	},
	{
		best_week: '2026-01-05',
		app_name: 'CatDog World: After Humans',
		store_id: 'com.allstarunion.cdw',
		icon_url_100: 'd33c22ce1d79c0d6.jpeg',
		in_app_purchases: true,
		ad_supported: false,
		weekly_installs: 79234,
		weekly_percent_increase: 48.405854732440915,
		baseline_installs: 53390.07692307692,
		baseline_installs_pct: 22.538688405076716,
		installs_z_score_2w: 0.22440327532170348,
		installs_z_score_4w: -0.009880388658493253,
		installs_acceleration: 0.23766913701694561,
		wow_growth_pct: 53.51558715827408,
		momentum_pct: 62.353276918877334,
		composite_score: 0.40629264273403193,
		phash: '8be214976b962ed1',
		file_extension: 'jpeg',
		host_ad_domain: 'yandex.com',
		host_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		initial_ad_domain: 'yandex.com',
		initial_company_logo_url: 'company-logos\/yandex.com\/logo_200x200.jpeg',
		mmp_domains: '{appsflyer.com}',
		md5_hash: '6a1e2de0d9338eab23abacde069c889b',
		pub_count: 1
	},
	{
		best_week: '2026-01-05',
		app_name: 'Lotsa Slots - Casino Games',
		store_id: 'com.diamondlife.slots.vegas.free',
		icon_url_100: 'd1b8685b23c10f7e.png',
		in_app_purchases: true,
		ad_supported: true,
		weekly_installs: 71625,
		weekly_percent_increase: -11.756009215567904,
		baseline_installs: 81167.0,
		baseline_installs_pct: -26.744859364027253,
		installs_z_score_2w: -0.37302917861793017,
		installs_z_score_4w: -0.11227133492262054,
		installs_acceleration: -0.20332022483201243,
		wow_growth_pct: 51.44947455225932,
		momentum_pct: -33.7932032781044,
		composite_score: -0.18499525003875966,
		phash: '97f3b5edf93fcf83',
		file_extension: 'webm',
		host_ad_domain: 'google.com',
		host_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		initial_ad_domain: 'google.com',
		initial_company_logo_url: 'company-logos\/google.com\/logo_200x200.jpeg',
		mmp_domains: '{adjust.com}',
		md5_hash: '374dc98d5816a2eba9c5bdee79ca7a51',
		pub_count: 0
	}
];

const AppReachData = [
	{
		advertiser_name: 'Shopkick: Rewards Sidekick',
		advertiser_store_id: 'com.shopkick.app',
		advertiser_icon_url_100: '9e8865b361cd6633.png',
		advertiser_category: 'shopping',
		advertiser_installs: 15578819,
		unique_creatives: 28,
		unique_publishers: 36,
		first_seen: '2025-12-31T23:51:31.436Z',
		last_seen: '2026-01-30T23:31:02.570Z',
		ad_network_domains:
			'{appodeal.com,digitalturbine.com,google.com,joyy.com,liftoff.io,mobvista.com,remerge.io,toponad.com,unity.com}',
		avg_publisher_installs: 15276373.647058823529,
		mmp_domains: '{appsflyer.com,branch.io}',
		top_md5_hashes:
			'{58847fd3aea28afa51e5b7cb74518aee,81920b5ae44d7efa6fba562b8a358981,fb103ae4464cd1ef563943092fd42e01,9055b653e9bd57006cce2e50f6fc0051,3225119a759baa52e27963db3051c95f}'
	},
	{
		advertiser_name: 'DoubleU Casino™ - Vegas Slots',
		advertiser_store_id: 'com.doubleugames.DoubleUCasino',
		advertiser_icon_url_100: '80835ffb29303ee5.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 26380953,
		unique_creatives: 18,
		unique_publishers: 33,
		first_seen: '2025-12-31T18:09:18.292Z',
		last_seen: '2026-01-19T20:49:19.904Z',
		ad_network_domains:
			'{adikteev.com,appodeal.com,digitalturbine.com,google.com,inmobi.com,liftoff.io,mobvista.com}',
		avg_publisher_installs: 2494559.851063829787,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{15dedb8f6824e050c20a438d46392829,1b1cf00642d838fd4e988ce2bf42a47d,15dedb8f6824e050c20a438d46392829,07c26cf8bd62fec91e06b89beaa64874,464cd6e0d601c65ab4bbf95657532e55}'
	},
	{
		advertiser_name: 'Ibotta: Save & Earn Cash Back',
		advertiser_store_id: 'com.ibotta.android',
		advertiser_icon_url_100: 'c14d7ab7349a986c.png',
		advertiser_category: 'shopping',
		advertiser_installs: 23148832,
		unique_creatives: 5,
		unique_publishers: 26,
		first_seen: '2026-01-16T14:26:08.365Z',
		last_seen: '2026-01-28T14:18:29.738Z',
		ad_network_domains: '{adikteev.com,google.com}',
		avg_publisher_installs: 14615288.965517241379,
		mmp_domains: '{appsflyer.com,onelink.me}',
		top_md5_hashes:
			'{d8789d559256fe85b4deeacf3f7c26bd,671882a8db7913723b81be019694b4f6,671882a8db7913723b81be019694b4f6,ea42c91918f8a10444fa507a90aed997,ea42c91918f8a10444fa507a90aed997}'
	},
	{
		advertiser_name: 'DoubleDown Casino Vegas Slots',
		advertiser_store_id: 'com.ddi',
		advertiser_icon_url_100: '8306bff5753c406a.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 33233515,
		unique_creatives: 11,
		unique_publishers: 21,
		first_seen: '2025-12-31T16:55:58.895Z',
		last_seen: '2026-01-04T03:58:06.236Z',
		ad_network_domains: '{affle.com,appodeal.com,digitalturbine.com,google.com,joyy.com}',
		avg_publisher_installs: 9382806.85,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{a78c03e230f8fce7e5c1b6d236dc39f7,42bfb6e090ae822725a0e6fb79545351,ab930b1b5f124f2d00a449831d1843e8,ab930b1b5f124f2d00a449831d1843e8,42bfb6e090ae822725a0e6fb79545351}'
	},
	{
		advertiser_name: 'Solitaire: Classic Klondike',
		advertiser_store_id: 'com.andreyrebrik.klondike',
		advertiser_icon_url_100: 'c11e6ce0329f39f1.png',
		advertiser_category: 'game_card',
		advertiser_installs: 1985060,
		unique_creatives: 9,
		unique_publishers: 16,
		first_seen: '2026-01-01T01:07:32.414Z',
		last_seen: '2026-01-28T20:12:29.089Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 15596859.980392156863,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{f8b750f4117d02cc8335b5f076a899fe,aaaea43c42ec908df604f11062b09ff8,b6c113ab428cffca6a875443e2d5e680,0c6eea7a28b461044855e3a2fc51d6d2,ff7d13a11d4a0c2fe4428bd1f7f4ae57}'
	},
	{
		advertiser_name: 'Logo Quiz - World Trivia Game',
		advertiser_store_id: 'com.logoquiz.triviagame',
		advertiser_icon_url_100: '98ca66846df36336.png',
		advertiser_category: 'game_trivia',
		advertiser_installs: 13219036,
		unique_creatives: 4,
		unique_publishers: 15,
		first_seen: '2026-01-04T03:29:47.404Z',
		last_seen: '2026-01-31T15:13:47.809Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 8194290.5,
		mmp_domains: null,
		top_md5_hashes:
			'{deb7492162db33f4f4e945ee2a187f36,deb7492162db33f4f4e945ee2a187f36,6a7da08f4bfe731add08368a00fc6902,6a7da08f4bfe731add08368a00fc6902,1868be0cbe34dab92be6aac9fc80b74f}'
	},
	{
		advertiser_name: 'Mighty Fu Casino Slots Games',
		advertiser_store_id: 'com.productmadness.fafafagold',
		advertiser_icon_url_100: 'd11e69b262bd16c3.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 6365527,
		unique_creatives: 16,
		unique_publishers: 13,
		first_seen: '2025-12-31T20:26:18.210Z',
		last_seen: '2026-01-28T21:15:15.649Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,liftoff.io,unity.com}',
		avg_publisher_installs: 8894799.655172413793,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{f8a316855af8ab878cb05c6c462f8864,28282f48a28b7e34380da7e6332bd0a2,6d4161c8ffbe29dbccf49c187f3141ea,f197c46cf096bbbca31a70dfa6f15098,7a445521033e816b674c6d6760e49673}'
	},
	{
		advertiser_name: 'ParlayPlay Fantasy Sports Game',
		advertiser_store_id: 'com.parlayplay.app',
		advertiser_icon_url_100: 'be2ee1d1c03a9ec8.png',
		advertiser_category: 'sports',
		advertiser_installs: 207581,
		unique_creatives: 5,
		unique_publishers: 12,
		first_seen: '2025-12-31T20:22:16.816Z',
		last_seen: '2026-01-04T21:17:56.648Z',
		ad_network_domains: '{adikteev.com,google.com}',
		avg_publisher_installs: 3718589.0,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{880581affff4e7472fdcb0e6e848ebc9,1dc1a035d4ef281f5cd09ca27912f915,42d40123fd07490b52fc91347257451c,08b5964ee3c7300d0323689980ed1af6,880581affff4e7472fdcb0e6e848ebc9}'
	},
	{
		advertiser_name: 'TikTok - Videos, Shop & LIVE',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png',
		advertiser_category: 'social networking',
		advertiser_installs: 4168231987,
		unique_creatives: 11,
		unique_publishers: 11,
		first_seen: '2026-01-15T12:03:42.901Z',
		last_seen: '2026-01-31T14:24:26.273Z',
		ad_network_domains: '{digitalturbine.com,google.com,mobvista.com}',
		avg_publisher_installs: 9716149.642857142857,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{83b8689b46a50d958215584bc22aac28,609f9087c0b41e66abfc16d7732842a8,46ccc355c2b7e0b7a16d0d73925772c2,4eacd259f5bf3e49681c77a79f175f81,4be662b1d747e579b50adbf5ef953e48}'
	},
	{
		advertiser_name: 'Happy Color®: Color by Number',
		advertiser_store_id: 'com.pixel.art.coloring.color.number',
		advertiser_icon_url_100: 'f094cd1c8cfc31cb.png',
		advertiser_category: 'game_board',
		advertiser_installs: 306019506,
		unique_creatives: 5,
		unique_publishers: 6,
		first_seen: '2026-01-01T02:00:52.479Z',
		last_seen: '2026-01-17T02:57:00.455Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1996465.714285714286,
		mmp_domains: '{adjust.com,appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{468f3cf11b6c61b727d7461669621d19,425fd3d292704c46a42d4049d07ce984,025a40fc040baceb1c8e8d818ed1ce50,025a40fc040baceb1c8e8d818ed1ce50,b458c7aae4612b2e88bd56c4442b4562}'
	},
	{
		advertiser_name: 'Sudoku: Train your brain',
		advertiser_store_id: 'com.andreyrebrik.sudoku',
		advertiser_icon_url_100: '81b117173e2eece8.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 1874147,
		unique_creatives: 8,
		unique_publishers: 5,
		first_seen: '2026-01-01T01:07:32.414Z',
		last_seen: '2026-01-28T16:47:21.100Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 8607546.363636363636,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{97418599081a3854a06c72ca450163ec,fe32c02f1f85d29f1b59fd72a35ddea4,79f002bbe4470bc93d4f19c682bb0688,3952c141cb45dfac78dee7a78524c59a,4f0ee1283b71ca419e20d319a98571d7}'
	},
	{
		advertiser_name: 'Pokémon TCG Pocket - Card Game',
		advertiser_store_id: 'jp.pokemon.pokemontcgp',
		advertiser_icon_url_100: 'fca5808693e69ccd.png',
		advertiser_category: 'game_card',
		advertiser_installs: 56626268,
		unique_creatives: 4,
		unique_publishers: 4,
		first_seen: '2026-01-15T16:00:25.285Z',
		last_seen: '2026-01-28T06:13:09.892Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5983083.0,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{3b171107274c6dfe205f21958f8a2766,7898018f7b4efbc75b76dd370a74709d,e385caff709e991133922303ee7d3e8b,7898018f7b4efbc75b76dd370a74709d,0bb82a130a04a9b9e4bbb3ad7c691268}'
	},
	{
		advertiser_name: 'Hypic - Photo Editor & AI Art',
		advertiser_store_id: 'com.xt.retouchoversea',
		advertiser_icon_url_100: '92d3693d246592f3.jpeg',
		advertiser_category: 'photo_and_video',
		advertiser_installs: 86223025,
		unique_creatives: 1,
		unique_publishers: 4,
		first_seen: '2026-01-03T04:16:34.513Z',
		last_seen: '2026-01-31T06:55:28.116Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 11173942.75,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{597a049dc55a2aed803903eb347a9a8f,ce4ac4410b43b9e76693fd2da3451a5e,597a049dc55a2aed803903eb347a9a8f,278d56c74b6d95c36d3e9fca761e5543}'
	},
	{
		advertiser_name: 'Shopee Bazar Hebat Raya',
		advertiser_store_id: 'com.shopee.my',
		advertiser_icon_url_100: 'd63968c6319364db.png',
		advertiser_category: 'shopping',
		advertiser_installs: 53852027,
		unique_creatives: 5,
		unique_publishers: 4,
		first_seen: '2026-01-25T18:09:57.415Z',
		last_seen: '2026-01-28T19:33:54.632Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 20186174.6,
		mmp_domains: '{appsflyer.com,developer.huawei.com}',
		top_md5_hashes:
			'{61987dd4cb570a3e7198dfc9b4518b63,a91e15ff8f582bce0f7baef35a75d01f,86f559245d8f27501edf44a58bb615b5,9dc976a8ff3b7007f52a125b9431d6ea,0390f6a55dd64e43af5416ebb878ee34}'
	},
	{
		advertiser_name: 'TikTok Lite - Save Data & Fast',
		advertiser_store_id: 'com.zhiliaoapp.musically.go',
		advertiser_icon_url_100: 'c3332ccd268eb173.png',
		advertiser_category: 'social networking',
		advertiser_installs: 1730967958,
		unique_creatives: 2,
		unique_publishers: 4,
		first_seen: '2026-01-28T21:51:33.677Z',
		last_seen: '2026-01-31T06:08:05.344Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 8651161.75,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{6d723852da556afc64b51db8161786be,dba776830025ecb3e200cd616570df8c,dba776830025ecb3e200cd616570df8c,dba776830025ecb3e200cd616570df8c}'
	},
	{
		advertiser_name: 'Logo Quiz: Guess the Brand!',
		advertiser_store_id: 'com.kolmogames.logoquiz',
		advertiser_icon_url_100: '8cc54af0338974fe.png',
		advertiser_category: 'game_trivia',
		advertiser_installs: 2470682,
		unique_creatives: 1,
		unique_publishers: 4,
		first_seen: '2026-01-03T10:30:54.720Z',
		last_seen: '2026-01-04T00:05:41.755Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 731095.5,
		mmp_domains: null,
		top_md5_hashes:
			'{4c4a9fd26169153cad58199c1b5af8b5,ed70cc2a196dbe552d8ebb9616153c2e,4c4a9fd26169153cad58199c1b5af8b5,ed70cc2a196dbe552d8ebb9616153c2e}'
	},
	{
		advertiser_name: 'Fetch: America’s Rewards App',
		advertiser_store_id: 'com.fetchrewards.fetchrewards.hop',
		advertiser_icon_url_100: 'bf3d6868873d60c1.png',
		advertiser_category: 'shopping',
		advertiser_installs: 26458296,
		unique_creatives: 3,
		unique_publishers: 4,
		first_seen: '2026-01-01T02:00:52.479Z',
		last_seen: '2026-01-31T00:12:36.665Z',
		ad_network_domains: '{appier.com,google.com}',
		avg_publisher_installs: 12390909.5,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{aa11c91cbf9e8c674a6aa033490f80fd,168b8514f25ab7fadcb9bdbbbff816ab,168b8514f25ab7fadcb9bdbbbff816ab,c4a9722133811a54edd1729e17c6d276}'
	},
	{
		advertiser_name: 'Sliding Puzzle: Classic Wood',
		advertiser_store_id: 'com.andreyrebrik.fifteen',
		advertiser_icon_url_100: 'a0daad7a5a2d5a25.png',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 1574497,
		unique_creatives: 6,
		unique_publishers: 4,
		first_seen: '2026-01-27T02:40:10.730Z',
		last_seen: '2026-01-28T16:47:21.100Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 19142695.875,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{cabb60bf3b311f58986d68daeaac4b66,6dd54845c40c36f834bf2c463539eef0,6dd54845c40c36f834bf2c463539eef0,c6ab4bfa9443e7e3596f1d55bff22f82,5f7d31afade69a33f7e4a66ebfe709ba}'
	},
	{
		advertiser_name: 'Spider Solitaire: Classic',
		advertiser_store_id: 'com.andreyrebrik.spider',
		advertiser_icon_url_100: 'c11e6ce0369b39f1.png',
		advertiser_category: 'game_card',
		advertiser_installs: 1554476,
		unique_creatives: 5,
		unique_publishers: 3,
		first_seen: '2026-01-19T19:03:48.232Z',
		last_seen: '2026-01-28T21:39:24.107Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 50618083.666666666667,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{33bc7e159ac13c4dbd89d5e7f6ea859a,09681048ca8c9aa58cd5b812725c977d,f0d5df928ac3d8a993a2d529e6c3bc8e,ab588f5097906262fa127caa5797a25d,fa99f5cbf044cc0bdb43abdeb9c09b1a}'
	},
	{
		advertiser_name: 'AliExpress - Shopping App',
		advertiser_store_id: 'com.alibaba.aliexpresshd',
		advertiser_icon_url_100: 'c51b6ec9316cd392.jpeg',
		advertiser_category: 'shopping',
		advertiser_installs: 813176567,
		unique_creatives: 1,
		unique_publishers: 3,
		first_seen: '2026-01-04T13:34:55.085Z',
		last_seen: '2026-01-28T19:20:10.049Z',
		ad_network_domains: '{liftoff.io,opera.com,unity.com}',
		avg_publisher_installs: 4464708.333333333333,
		mmp_domains: '{appsflyer.com,developer.huawei.com}',
		top_md5_hashes:
			'{4f7de228025c800c46647f2c481e55be,4f7de228025c800c46647f2c481e55be,4f7de228025c800c46647f2c481e55be}'
	},
	{
		advertiser_name: 'KAI: Comic Maker Manga, Manhwa',
		advertiser_store_id: 'com.ai.comic.book',
		advertiser_icon_url_100: '85a37a3c16c92db6.png',
		advertiser_category: 'comics',
		advertiser_installs: 504412,
		unique_creatives: 3,
		unique_publishers: 3,
		first_seen: '2026-01-04T01:52:31.471Z',
		last_seen: '2026-01-04T22:01:34.114Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 928122.25,
		mmp_domains: '{adjust.com}',
		top_md5_hashes:
			'{556d3e25fda7b9d6e6e9dba354b66824,ccc55315311bc8cd5d10fcfccdbb0d9b,ccc55315311bc8cd5d10fcfccdbb0d9b,e3107767893cfaaed7b7c374b1ef7066}'
	},
	{
		advertiser_name: 'Logo Quest: Brand Trivia',
		advertiser_store_id: 'com.wolfking.logo.quiz',
		advertiser_icon_url_100: '81cff4a43d7823a6.png',
		advertiser_category: 'game_word',
		advertiser_installs: 12802,
		unique_creatives: 3,
		unique_publishers: 3,
		first_seen: '2026-01-20T00:34:37.224Z',
		last_seen: '2026-01-26T12:16:18.570Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 488391.0,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{4626f9d7a477f3288c0fc4cae9048b63,1a861f963ad34f3ac2553c60e4615334,f37b6f437830f4c137be144b5618be63}'
	},
	{
		advertiser_name: 'rednote',
		advertiser_store_id: 'com.xingin.xhs',
		advertiser_icon_url_100: '94366bc994163be9.png',
		advertiser_category: 'social networking',
		advertiser_installs: 34316072,
		unique_creatives: 3,
		unique_publishers: 3,
		first_seen: '2026-01-15T08:24:36.544Z',
		last_seen: '2026-01-28T14:15:38.613Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 13695862.5,
		mmp_domains: '{appsflyer.com,developer.huawei.com}',
		top_md5_hashes:
			'{caa054416059b579436844b92cc55b9d,d7082c6ea2cb3b4d6cc6f7d2d46ef11d,d7082c6ea2cb3b4d6cc6f7d2d46ef11d,99fa070d0e296fb21c773d502dd16da1}'
	},
	{
		advertiser_name: 'Facebook',
		advertiser_store_id: 'com.facebook.katana',
		advertiser_icon_url_100: '8c337467676c9893.png',
		advertiser_category: 'social networking',
		advertiser_installs: 11244654338,
		unique_creatives: 3,
		unique_publishers: 3,
		first_seen: '2026-01-21T07:00:39.953Z',
		last_seen: '2026-01-26T18:26:39.591Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 50431071.0,
		mmp_domains: null,
		top_md5_hashes:
			'{aeea70e77c5ca33fca555ab0310d36ab,124060e46132e18927df93051023d0f5,8eee4490da5834ae4792810bd4561175}'
	},
	{
		advertiser_name: 'SEGA FOOTBALL CLUB CHAMPIONS',
		advertiser_store_id: 'com.sega.FootballClubChampions',
		advertiser_icon_url_100: 'c84f155d9a5e01f5.png',
		advertiser_category: 'game_sports',
		advertiser_installs: 2323885,
		unique_creatives: 2,
		unique_publishers: 3,
		first_seen: '2026-01-23T19:40:41.531Z',
		last_seen: '2026-01-25T18:35:28.626Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1282257.666666666667,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{79d8d4d129e3886d9d72a3c7a361b8c8,b373b9cf951013da2f37c822cd64eee8,79d8d4d129e3886d9d72a3c7a361b8c8}'
	},
	{
		advertiser_name: 'Audible: Audio Entertainment',
		advertiser_store_id: 'com.audible.application',
		advertiser_icon_url_100: '907a6e65f1189ec3.png',
		advertiser_category: 'books_and_reference',
		advertiser_installs: 255338790,
		unique_creatives: 4,
		unique_publishers: 3,
		first_seen: '2025-12-31T16:46:46.922Z',
		last_seen: '2026-01-03T11:52:52.690Z',
		ad_network_domains: '{affle.com,digitalturbine.com,google.com}',
		avg_publisher_installs: 3160063.75,
		mmp_domains: '{kochava.com}',
		top_md5_hashes:
			'{c27e9c279f13b967d85b72c9525ebd5c,ddf99d11175a61fc9f789cbe6c0ec02c,3f269142c3bd7f6f98c461badaaf1f59,417772ba411e58b2d432f649ee09a6f1}'
	},
	{
		advertiser_name: 'CallApp: Caller ID & Block',
		advertiser_store_id: 'com.callapp.contacts',
		advertiser_icon_url_100: 'eb32b44cc3989e33.png',
		advertiser_category: 'communication',
		advertiser_installs: 386146416,
		unique_creatives: 4,
		unique_publishers: 3,
		first_seen: '2026-01-04T13:38:52.993Z',
		last_seen: '2026-01-25T18:09:57.415Z',
		ad_network_domains: '{bidease.com,google.com}',
		avg_publisher_installs: 704677.75,
		mmp_domains: '{singular.net}',
		top_md5_hashes:
			'{a4f3ab83ef8e5687d980c29123e1dc9e,1b13525bbe13fb0511167bc98dea6c99,77399e61d8cd23c012d04bacf935a590,4b4c1c556b3018987590d096f98b698f}'
	},
	{
		advertiser_name: 'ViX:TV, Deportes y Noticias',
		advertiser_store_id: 'com.univision.prendetv',
		advertiser_icon_url_100: 'd4ac6bc394fc2983.png',
		advertiser_category: 'entertainment',
		advertiser_installs: 113268950,
		unique_creatives: 2,
		unique_publishers: 2,
		first_seen: '2026-01-16T14:26:08.365Z',
		last_seen: '2026-01-28T17:26:49.009Z',
		ad_network_domains: '{bidease.com,google.com}',
		avg_publisher_installs: 7390104.0,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes: '{83567e89c89418b53313507a36fa688c,2739373b50917cef6354ce00f33d3b43}'
	},
	{
		advertiser_name: 'Project Makeover',
		advertiser_store_id: 'com.bgg.jump',
		advertiser_icon_url_100: 'c161e31eb53f4d0a.png',
		advertiser_category: 'game_casual',
		advertiser_installs: 200680538,
		unique_creatives: 1,
		unique_publishers: 2,
		first_seen: '2026-01-19T17:14:21.479Z',
		last_seen: '2026-01-27T04:26:48.251Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 19004457.5,
		mmp_domains: '{adjust.com}',
		top_md5_hashes: '{fd20313e3c767ddc3fc4cd95c5ac01b4,fd20313e3c767ddc3fc4cd95c5ac01b4}'
	},
	{
		advertiser_name: 'Lotsa Slots - Casino Games',
		advertiser_store_id: 'com.diamondlife.slots.vegas.free',
		advertiser_icon_url_100: 'd1b8685b23c10f7e.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 28710075,
		unique_creatives: 2,
		unique_publishers: 2,
		first_seen: '2026-01-01T00:11:22.724Z',
		last_seen: '2026-01-21T02:56:00.449Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 164448.0,
		mmp_domains: '{adjust.com}',
		top_md5_hashes: '{de2075d6ab70d4adf8c27ebddd270052,374dc98d5816a2eba9c5bdee79ca7a51}'
	},
	{
		advertiser_name: 'Cashman Casino Slots Games',
		advertiser_store_id: 'com.productmadness.cashmancasino',
		advertiser_icon_url_100: 'bb30c40f1bc6c5cd.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 20481006,
		unique_creatives: 12,
		unique_publishers: 2,
		first_seen: '2025-12-31T18:54:49.236Z',
		last_seen: '2026-01-15T05:11:39.279Z',
		ad_network_domains: '{bigabid.com,digitalturbine.com,google.com,unity.com}',
		avg_publisher_installs: 5376097.666666666667,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{95633f319d58d26268b4955657f73d01,e5b7bb8dff10bb1656adc9df5fc3da90,ebac808378fdb9e5dccfcc76c3aa221b,20d429ba7e6992537ab0b6f238c5ad35,ed00bf84cb420798e213571e8ccebb5c}'
	},
	{
		advertiser_name: 'Block Blast!',
		advertiser_store_id: 'com.block.juggle',
		advertiser_icon_url_100: 'd414496f667369cc.jpeg',
		advertiser_category: 'game_puzzle',
		advertiser_installs: 817703560,
		unique_creatives: 2,
		unique_publishers: 2,
		first_seen: '2025-12-31T17:52:00.498Z',
		last_seen: '2026-01-04T10:33:34.419Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1655590.0,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes: '{c1ef2ab7ce391b4c77c31fa4661beddb,238a86d15668e51c8980324e1b02e009}'
	},
	{
		advertiser_name: 'MapleStory : Idle RPG',
		advertiser_store_id: 'com.nexon.ma',
		advertiser_icon_url_100: 'e0ae36c12b36e939.png',
		advertiser_category: 'game_role_playing',
		advertiser_installs: 3712901,
		unique_creatives: 2,
		unique_publishers: 2,
		first_seen: '2026-01-17T16:20:54.898Z',
		last_seen: '2026-01-21T16:42:28.801Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5711088.5,
		mmp_domains: '{adjust.com}',
		top_md5_hashes: '{9bdd4f056f527cf51e77dfef59701ec0,726c5dc7850f980dddd4b427823ff22b}'
	},
	{
		advertiser_name: 'All TV Remote - Screen Cast',
		advertiser_store_id: 'com.remote.tv.cast.screenmirror.app',
		advertiser_icon_url_100: 'fc29f136ce181b31.png',
		advertiser_category: 'tools',
		advertiser_installs: 5187633,
		unique_creatives: 2,
		unique_publishers: 2,
		first_seen: '2026-01-28T06:51:53.130Z',
		last_seen: '2026-01-28T14:06:30.423Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 19024892.0,
		mmp_domains: null,
		top_md5_hashes:
			'{63077d58ee7e464f465e4c538afcdaae,6f2e960252f4002ea7dd93eef8f3a3bf,63077d58ee7e464f465e4c538afcdaae}'
	},
	{
		advertiser_name: 'Game Emulator: GB4 Retro Games',
		advertiser_store_id: 'com.game.emulator.gb4.retro.gameboy.collection',
		advertiser_icon_url_100: '86616f97381a71c7.png',
		advertiser_category: 'tools',
		advertiser_installs: 4408160,
		unique_creatives: 2,
		unique_publishers: 2,
		first_seen: '2026-01-03T18:52:24.825Z',
		last_seen: '2026-01-04T21:17:56.648Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 3452784.5,
		mmp_domains: null,
		top_md5_hashes: '{edff233a52208d14bdc1e80372069358,24936212fd658c49cc439c85407c4138}'
	},
	{
		advertiser_name: 'Forest Island: Relaxing Game',
		advertiser_store_id: 'com.Nanali.ForestIsland',
		advertiser_icon_url_100: 'edbe96e2b3c10909.png',
		advertiser_category: 'game_simulation',
		advertiser_installs: 5634955,
		unique_creatives: 1,
		unique_publishers: 2,
		first_seen: '2026-01-01T01:24:27.694Z',
		last_seen: '2026-01-17T16:20:54.898Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 5786139.0,
		mmp_domains: '{adjust.com}',
		top_md5_hashes: '{b88cb978eb66d41852bbe6adfa85d539,a80c4e7f039db848038d84da67d3ad0f}'
	},
	{
		advertiser_name: 'Slots: Heart of Vegas Casino',
		advertiser_store_id: 'com.productmadness.hovmobile',
		advertiser_icon_url_100: 'd84f5a8f31287764.png',
		advertiser_category: 'game_casino',
		advertiser_installs: 24150874,
		unique_creatives: 3,
		unique_publishers: 2,
		first_seen: '2026-01-16T09:03:15.449Z',
		last_seen: '2026-01-21T02:46:02.443Z',
		ad_network_domains: '{bigabid.com,unity.com}',
		avg_publisher_installs: 1476009.0,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes:
			'{d3272173d84128c053ff3a1e189d8bc7,6259728c0a97c7df3f83a1eaef4ca69e,d1e2c1e7122df351bcf37b8762d21bf2}'
	},
	{
		advertiser_name: 'FreeCell Solitaire: Classic',
		advertiser_store_id: 'com.andreyrebrik.freecell',
		advertiser_icon_url_100: 'c11e6ce0369b39f1.png',
		advertiser_category: 'game_card',
		advertiser_installs: 852140,
		unique_creatives: 5,
		unique_publishers: 2,
		first_seen: '2026-01-21T00:00:48.016Z',
		last_seen: '2026-01-28T16:47:21.100Z',
		ad_network_domains: '{yandex.com}',
		avg_publisher_installs: 2615134.833333333333,
		mmp_domains: '{appmetrica.yandex.com,metrica.yandex.com}',
		top_md5_hashes:
			'{1cf7a7e94f3f2230cd1539059fac45f7,f252604291e2ef7ad24c6e8beebe80e7,f3c6415da1d17242c050bb6ed39f0408,40f4fd72cb4718fd912ab94a9fc41f5b,a3f9b94f8831911a772ee2b3b8ac08d8}'
	},
	{
		advertiser_name: 'Varo Bank: Online Banking',
		advertiser_store_id: 'com.varomoney.bank',
		advertiser_icon_url_100: 'c563389dc562749d.png',
		advertiser_category: 'finance',
		advertiser_installs: 6897646,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-28T20:12:29.089Z',
		last_seen: '2026-01-28T20:12:29.089Z',
		ad_network_domains: '{bidease.com,unity.com}',
		avg_publisher_installs: 12276128.0,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes: '{9492d069bd5b1abcfe23ff56918e4f2a}'
	},
	{
		advertiser_name: 'Volume Booster & Sound Booster',
		advertiser_store_id: 'audio.sound.effect.bass.virtrualizer.equalizer.eq.soundbooster',
		advertiser_icon_url_100: '8ece75914aa652ad.png',
		advertiser_category: 'music_and_audio',
		advertiser_installs: 810516,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-28T14:15:38.613Z',
		last_seen: '2026-01-28T14:15:38.613Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 17084332.0,
		mmp_domains: null,
		top_md5_hashes: '{fc1c8e72bcf767b0aafac99c79f71991}'
	},
	{
		advertiser_name: 'Volume Booster - Music & Sound',
		advertiser_store_id: 'com.alp.volume.booster.bass',
		advertiser_icon_url_100: 'c1d96964ce933333.png',
		advertiser_category: 'music_and_audio',
		advertiser_installs: 1860575,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-01T02:00:52.479Z',
		last_seen: '2026-01-01T02:00:52.479Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 605086.0,
		mmp_domains: '{adjust.com}',
		top_md5_hashes: '{ffc7d3256f3d4563f6c459968e34c271}'
	},
	{
		advertiser_name: 'Voxon: Voice Changer, Recorder',
		advertiser_store_id: 'com.voxon.voice.changer.recorder',
		advertiser_icon_url_100: '92764ceb4d2d314d.png',
		advertiser_category: 'music_and_audio',
		advertiser_installs: 51039,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-31T06:55:28.116Z',
		last_seen: '2026-01-31T06:55:28.116Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 6097624.0,
		mmp_domains: null,
		top_md5_hashes: '{974c2f62322fa27f8a46b7ac5bd553f0}'
	},
	{
		advertiser_name: 'Weather: Live radar & widgets',
		advertiser_store_id: 'com.accurate.weather.forecast.live',
		advertiser_icon_url_100: '9296656765ec8d89.jpeg',
		advertiser_category: 'weather',
		advertiser_installs: 28397445,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-27T02:02:00.893Z',
		last_seen: '2026-01-27T02:02:00.893Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 58960797.0,
		mmp_domains: '{appsflyer.com,branch.io}',
		top_md5_hashes: '{08781701e5e3b684df24810cde6838ca}'
	},
	{
		advertiser_name: 'Words of Wonders: Crossword',
		advertiser_store_id: 'com.fugo.wow',
		advertiser_icon_url_100: '80f43e52ac7cb2d6.png',
		advertiser_category: 'game_word',
		advertiser_installs: 427109859,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-15T16:27:58.183Z',
		last_seen: '2026-01-15T16:27:58.183Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 4857617.0,
		mmp_domains: '{appmetrica.yandex.com,appsflyer.com,metrica.yandex.com}',
		top_md5_hashes: '{50f0724dfc414cac82e12c60b307633f}'
	},
	{
		advertiser_name: 'Worms Zone .io - Hungry Snake',
		advertiser_store_id: 'com.wildspike.wormszone',
		advertiser_icon_url_100: '90a9a5d6d82e27e3.png',
		advertiser_category: 'game_action',
		advertiser_installs: 633166569,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-27T01:31:53.149Z',
		last_seen: '2026-01-27T01:31:53.149Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 61500629.0,
		mmp_domains: '{appmetrica.yandex.com,appsflyer.com,metrica.yandex.com}',
		top_md5_hashes: '{0154127a5e08c17f273ba973910bfed9}'
	},
	{
		advertiser_name: 'jcb game - happy truck repair',
		advertiser_store_id: 'com.blackatomgames.toontruckwashandrepair',
		advertiser_icon_url_100: 'bebcb3409de2c489.png',
		advertiser_category: 'game_simulation',
		advertiser_installs: 2204,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-15T15:02:23.413Z',
		last_seen: '2026-01-15T15:02:23.413Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 2108281.0,
		mmp_domains: null,
		top_md5_hashes: '{c3097329c1d2276c1db2c9fc55431c60}'
	},
	{
		advertiser_name: '戦国村を作ろう3',
		advertiser_store_id: 'net.myoji_yurai.myojiSengoku3',
		advertiser_icon_url_100: 'd5c5466ad03617f2.png',
		advertiser_category: 'game_simulation',
		advertiser_installs: 4085,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-23T04:16:04.636Z',
		last_seen: '2026-01-23T04:16:04.636Z',
		ad_network_domains: '{NULL}',
		avg_publisher_installs: 7170.0,
		mmp_domains: null,
		top_md5_hashes: '{80b849feba3ba8ef00baefda8ea88a77}'
	},
	{
		advertiser_name: null,
		advertiser_store_id: 'com.android.vending',
		advertiser_icon_url_100: null,
		advertiser_category: null,
		advertiser_installs: null,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-16T02:47:03.670Z',
		last_seen: '2026-01-16T02:47:03.670Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 1572611.0,
		mmp_domains: null,
		top_md5_hashes: '{8c4f374dd4de36b18db3bbd397b486f2}'
	},
	{
		advertiser_name: 'Roblox',
		advertiser_store_id: 'com.roblox.client',
		advertiser_icon_url_100: 'c6cd3972269d8c33.png',
		advertiser_category: 'game_adventure',
		advertiser_installs: 1470919838,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-28T08:02:11.867Z',
		last_seen: '2026-01-28T08:02:11.867Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 21119974.0,
		mmp_domains: '{appsflyer.com}',
		top_md5_hashes: '{202c1dc68a949a2861e29c02adb097f0}'
	},
	{
		advertiser_name: 'AI Emoji Maker - Smart Emoji',
		advertiser_store_id: 'com.wa.ai.emojimaker',
		advertiser_icon_url_100: 'ed9d9666c061b992.png',
		advertiser_category: 'personalization',
		advertiser_installs: 3942877,
		unique_creatives: 1,
		unique_publishers: 1,
		first_seen: '2026-01-28T21:12:37.163Z',
		last_seen: '2026-01-28T21:12:37.163Z',
		ad_network_domains: '{google.com}',
		avg_publisher_installs: 11538791.0,
		mmp_domains: null,
		top_md5_hashes: '{26c88cb14e6304ffc43fed1e3e9df3df}'
	}
];
interface ProcessedApp {
	app_name: string;
	store_id: string;
	best_week: string;
	icon_url_100: string;
	weekly_installs: number;
	weekly_percent_increase: number;
	baseline_installs: number;
	baseline_installs_pct: number;
	installs_z_score_2w: number;
	installs_z_score_4w: number;
	installs_acceleration: number;
	wow_growth_pct: number;
	momentum_pct: number | null;
	composite_score: number;
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
				baseline_installs: row.baseline_installs,
				baseline_installs_pct: row.baseline_installs_pct,
				installs_z_score_2w: row.installs_z_score_2w,
				installs_z_score_4w: row.installs_z_score_4w,
				installs_acceleration: row.installs_acceleration,
				wow_growth_pct: row.wow_growth_pct,
				momentum_pct: row.momentum_pct,
				composite_score: row.composite_score,
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
		(a, b) => b.composite_score - a.composite_score
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
	const appsWithWowGrowth = apps.filter((app) => app.wow_growth_pct != null);
	const avgGrowth =
		appsWithWowGrowth.length > 0
			? appsWithWowGrowth.reduce((sum, app) => sum + app.wow_growth_pct, 0) /
				appsWithWowGrowth.length
			: 0;
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
			reportPeriod: 'January 2026',
			generatedDate: 'March 11, 2026'
		},
		topApps,
		// Meta Tags
		title: 'User Acquisition Report - January 2026 | AppGoblin',
		description:
			'See January 2026 mobile ad campaigns, ad networks, and creatives behind the fastest-rising apps.',
		keywords:
			'user acquisition, january 2026, mobile ad campaigns, app marketing, mobile advertising, ad creatives, install growth'
	};
};
