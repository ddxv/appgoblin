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
	host_ad_domain: string | null;
	initial_ad_domain: string | null;
	mmp_domain: string | null;
	md5_hash: string;
	pub_count: number;
}

interface AdNetworkData {
	ad_network_domain: string;
	publisher_count: number;
	advertiser_count: number;
	creatives_count: number;
}

const rawMostPopularCreatives = [
	{
		phash: 'd17f25799add637d',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 34,
		first_seen: '2025-09-12T19:43:38.026Z',
		last_seen: '2025-09-22T19:40:29.665Z',
		md5_hash: 'b5da6ddb8fad23ac2c438c802b475ad9',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png'
	},
	{
		phash: 'd08b7d073f2bfe38',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 32,
		first_seen: '2025-09-12T19:58:16.415Z',
		last_seen: '2025-09-22T14:57:03.009Z',
		md5_hash: '24783926a4d0a8e73ac23d40ed447541',
		advertiser_store_id: 'com.zhiliaoapp.musically',
		advertiser_icon_url_100: 'd93b2ee16686303e.png'
	},
	{
		phash: 'c0ea7b75d406849f',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 13,
		first_seen: '2025-09-01T09:29:14.254Z',
		last_seen: '2025-09-19T00:59:30.056Z',
		md5_hash: 'de5a3a61bd3fad55508595520606bd25',
		advertiser_store_id: 'com.niuaigo.solitaire.klondike',
		advertiser_icon_url_100: 'd041663f1d3b0be6.png'
	},
	{
		phash: 'd7e766f7fd7eb0b8',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 11,
		first_seen: '2025-09-01T14:29:03.380Z',
		last_seen: '2025-09-05T05:41:30.107Z',
		md5_hash: '1c7e2914a891e35ea561ab09d6313e46',
		advertiser_store_id: 'com.microsoft.copilot',
		advertiser_icon_url_100: 'ec3496cbc9393626.png'
	},
	{
		phash: 'e5f95fbe6dd4fe6d',
		file_extension: 'mp4',
		advertiser_count: 1,
		publisher_count: 5,
		first_seen: '2025-09-01T03:09:52.549Z',
		last_seen: '2025-09-02T02:45:01.763Z',
		md5_hash: '66d37bb6cb4dad5369fe6d63b5a8ae07',
		advertiser_store_id: 'easy.launcher',
		advertiser_icon_url_100: '879368b7386e91a5.png'
	}
];

const rawAdNetworkData: AdNetworkData[] = [
	{
		ad_network_domain: 'google.com',
		publisher_count: 641,
		advertiser_count: 105,
		creatives_count: 387
	},
	{
		ad_network_domain: 'unity3d.com',
		publisher_count: 61,
		advertiser_count: 34,
		creatives_count: 60
	},
	{
		ad_network_domain: 'yandex.com',
		publisher_count: 26,
		advertiser_count: 14,
		creatives_count: 54
	},
	{
		ad_network_domain: 'mintegral.com',
		publisher_count: 37,
		advertiser_count: 29,
		creatives_count: 36
	},
	{
		ad_network_domain: 'fyber.com',
		publisher_count: 27,
		advertiser_count: 16,
		creatives_count: 32
	},
	{
		ad_network_domain: 'bidease.com',
		publisher_count: 22,
		advertiser_count: 9,
		creatives_count: 24
	},
	{
		ad_network_domain: 'bidmachine.io',
		publisher_count: 9,
		advertiser_count: 8,
		creatives_count: 23
	},
	{
		ad_network_domain: 'bigabid.com',
		publisher_count: 25,
		advertiser_count: 5,
		creatives_count: 19
	},
	{
		ad_network_domain: 'amazonaws.com',
		publisher_count: 11,
		advertiser_count: 8,
		creatives_count: 14
	}
];

const rawData: AppAdData[] = [
	{
		app_name: 'PragerU',
		store_app: 705470,
		store_id: 'com.cappital.prageru',
		icon_url_100: 'ce4e6531316cce9a.png',
		weekly_installs: 14605,
		weekly_percent_increase: 330.381611905113,
		phash: 'bb94c47994cec6d0',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: 'b86db8f6946ad999c12c6a2dd714796b',
		pub_count: 1
	},
	{
		app_name: 'Tiki Solitaire TriPeaks',
		store_app: 725413,
		store_id: 'com.gsn.android.tripeaks',
		icon_url_100: '85571b4b6c991b72.png',
		weekly_installs: 17212,
		weekly_percent_increase: 137.079889807163,
		phash: 'd40f55b97edc37f5',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: 'cd0a0ddab8dc6434e4ffacdb6495a634',
		pub_count: 1
	},
	{
		app_name: 'Crypto.com: Buy BTC, ETH & CRO',
		store_app: 631294,
		store_id: 'co.mona.android',
		icon_url_100: 'dcf96ae26869a492.jpeg',
		weekly_installs: 176688,
		weekly_percent_increase: 127.230988849878,
		phash: '877867ce38679895',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: 'fd957f0e127049ff7c41d0b74f36bc04',
		pub_count: 3
	},
	{
		app_name: 'Crypto.com: Buy BTC, ETH & CRO',
		store_app: 631294,
		store_id: 'co.mona.android',
		icon_url_100: 'dcf96ae26869a492.jpeg',
		weekly_installs: 176688,
		weekly_percent_increase: 127.230988849878,
		phash: '96b3db74cfef7d97',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: 'fd957f0e127049ff7c41d0b74f36bc04',
		pub_count: 1
	},
	{
		app_name: 'Crypto.com: Buy BTC, ETH & CRO',
		store_app: 631294,
		store_id: 'co.mona.android',
		icon_url_100: 'dcf96ae26869a492.jpeg',
		weekly_installs: 176688,
		weekly_percent_increase: 127.230988849878,
		phash: 'b890c72fcdee8819',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: 'fd957f0e127049ff7c41d0b74f36bc04',
		pub_count: 1
	},
	{
		app_name: 'CallApp: Caller ID & Block',
		store_app: 624183,
		store_id: 'com.callapp.contacts',
		icon_url_100: 'eb32b44cc3989e33.png',
		weekly_installs: 2175912,
		weekly_percent_increase: 103.659085612345,
		phash: '98536d1c1eed9649',
		file_extension: 'png',
		host_ad_domain: 'bidease.com',
		initial_ad_domain: 'bidmachine.io',
		mmp_domain: null,
		md5_hash: '77399e61d8cd23c012d04bacf935a590',
		pub_count: 1
	},
	{
		app_name: 'Fetch: America’s Rewards App',
		store_app: 578834,
		store_id: 'com.fetchrewards.fetchrewards.hop',
		icon_url_100: 'bf3d6868873d60c1.png',
		weekly_installs: 114124,
		weekly_percent_increase: 100.922535211268,
		phash: 'e7da3de5502d5212',
		file_extension: 'jpeg',
		host_ad_domain: 'appier.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: '3652dc0266c56bfb49afd02f59776651',
		pub_count: 1
	},
	{
		app_name: 'Tango- Live Stream, Video Chat',
		store_app: 614244,
		store_id: 'com.sgiggle.production',
		icon_url_100: 'f1b6c6c889933c4d.jpeg',
		weekly_installs: 1725058,
		weekly_percent_increase: 97.5968449713007,
		phash: 'bb7c86c3e5f6db9c',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: 'ae5c027d28b8624901c158f77027aa6e',
		pub_count: 1
	},
	{
		app_name: 'Play Together: My Farm',
		store_app: 10409929,
		store_id: 'com.haegin.playtogether',
		icon_url_100: 'c833b3ba45b9312d.png',
		weekly_installs: 46342,
		weekly_percent_increase: 37.4582882228188,
		phash: '982661b69ef11c9e',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: '60ef9f7e6c9c9f8168fb67c9884c04a6',
		pub_count: 1
	},
	{
		app_name: 'Solitaire - Classic Card Games',
		store_app: 725403,
		store_id: 'beetles.puzzle.solitaire',
		icon_url_100: '85e4641f4b3b194f.png',
		weekly_installs: 120744,
		weekly_percent_increase: 31.056153432865,
		phash: '85e4741f433b194f',
		file_extension: 'png',
		host_ad_domain: 'moloco.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: '63f90efce09e010086ac27da69008034',
		pub_count: 1
	},
	{
		app_name: 'Solitaire - Classic Card Games',
		store_app: 725403,
		store_id: 'beetles.puzzle.solitaire',
		icon_url_100: '85e4641f4b3b194f.png',
		weekly_installs: 120744,
		weekly_percent_increase: 31.056153432865,
		phash: '9ec76c3019cf3299',
		file_extension: 'jpg',
		host_ad_domain: 'moloco.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: '63f90efce09e010086ac27da69008034',
		pub_count: 1
	},
	{
		app_name: 'Starbucks',
		store_app: 644243,
		store_id: 'com.starbucks.mobilecard',
		icon_url_100: 'ce3e1146ec7133c6.png',
		weekly_installs: 74483,
		weekly_percent_increase: 16.5536073359466,
		phash: 'ddc7cb58c31438c3',
		file_extension: 'jpg',
		host_ad_domain: 'appreciate.mobi',
		initial_ad_domain: 'fyber.com',
		mmp_domain: 'branch.io',
		md5_hash: '6923be16d6287465b3d44699f1111535',
		pub_count: 1
	},
	{
		app_name: 'Blackjack 21: casino card game',
		store_app: 727687,
		store_id: 'blackjack.casino.card.game',
		icon_url_100: '9552977669b5642c.png',
		weekly_installs: 3830,
		weekly_percent_increase: 10.2475532527346,
		phash: 'f1b1945336d894ed',
		file_extension: 'mp4',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: 'fc54a9c97a6173efbe6032f6814a1a31',
		pub_count: 1
	},
	{
		app_name: 'Yelp: Food, Delivery & Reviews',
		store_app: 704177,
		store_id: 'com.yelp.android',
		icon_url_100: '8ecd6c937394384d.png',
		weekly_installs: 69028,
		weekly_percent_increase: 5.28419013628009,
		phash: 'cbb3dc64b2692436',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: '77d2edf1c5ff577c0b9e9e1c57819cb7',
		pub_count: 1
	},
	{
		app_name: 'Yelp: Food, Delivery & Reviews',
		store_app: 704177,
		store_id: 'com.yelp.android',
		icon_url_100: '8ecd6c937394384d.png',
		weekly_installs: 69028,
		weekly_percent_increase: 5.28419013628009,
		phash: 'e09dc6e3ad32698c',
		file_extension: 'jpeg',
		host_ad_domain: 'google.com',
		initial_ad_domain: 'google.com',
		mmp_domain: null,
		md5_hash: '77d2edf1c5ff577c0b9e9e1c57819cb7',
		pub_count: 1
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
	ad_networks: Set<string>;
	mmp_domains: Set<string>;
	creatives: Array<{
		md5_hash: string;
		phash: string;
		file_extension: string;
		host_ad_domain: string | null;
		initial_ad_domain: string | null;
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
				ad_networks: new Set(),
				mmp_domains: new Set(),
				creatives: []
			});
		}

		const app = appsMap.get(row.store_app)!;
		app.creative_count++;
		app.pub_count += row.pub_count;

		if (row.host_ad_domain) app.ad_networks.add(row.host_ad_domain);
		if (row.initial_ad_domain) app.ad_networks.add(row.initial_ad_domain);
		if (row.mmp_domain) app.mmp_domains.add(row.mmp_domain);

		app.creatives.push({
			md5_hash: row.md5_hash,
			phash: row.phash,
			file_extension: row.file_extension,
			host_ad_domain: row.host_ad_domain,
			initial_ad_domain: row.initial_ad_domain
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
	apps.forEach((app) => app.ad_networks.forEach((net) => allNetworks.add(net)));

	const topApps = apps.slice(0, 5);

	// Sort ad networks by publisher count
	const adNetworks = [...rawAdNetworkData].sort((a, b) => b.publisher_count - a.publisher_count);

	// Calculate ad network statistics
	const totalPublishers = adNetworks.reduce((sum, net) => sum + net.publisher_count, 0);
	const totalAdvertisers = adNetworks.reduce((sum, net) => sum + net.advertiser_count, 0);
	const totalNetworkCreatives = adNetworks.reduce((sum, net) => sum + net.creatives_count, 0);

	return {
		apps,
		adNetworks,
		popularCreatives: rawMostPopularCreatives,
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
