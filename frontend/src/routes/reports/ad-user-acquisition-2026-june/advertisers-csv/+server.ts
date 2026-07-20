import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { requireFullAuth } from '$lib/server/auth/auth';
import { db } from '$lib/server/auth/db';
import { userHasTierAccess } from '$lib/server/subscription';

const reportJsonModules = import.meta.glob('../*.json', {
	eager: true,
	import: 'default'
}) as Record<string, unknown>;

// ---- Types matching the JSON data shapes ----

interface AdvertiserEntry {
	store_id: string;
	app_name: string;
	icon_128: string;
	category: string | null;
	weekly_installs: number;
	creative_count_from_impact: number;
	ad_networks_set: Set<string>;
	mmp_set: Set<string>;
	unique_publishers: number;
	unique_creatives_reach: number;
	total_installs: number | null;
	developer: string | null;
	is_new: boolean;
}

interface ImpactGrowthRow {
	app_name: string;
	store_id: string;
	icon_128: string;
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
	host_ad_domain: string | null;
	host_company_logo_url: string | null;
	initial_ad_domain: string | null;
	initial_company_logo_url: string | null;
	mmp_domains: string | string[] | null;
	pub_count: number;
}

interface ReachRow {
	advertiser_name: string | null;
	advertiser_store_id: string;
	advertiser_icon_128: string | null;
	advertiser_category: string | null;
	advertiser_installs: number | null;
	unique_creatives: number;
	unique_publishers: number;
	first_seen: string;
	last_seen: string;
	ad_network_domains: string | string[];
	mmp_domains: string | string[] | null;
	avg_publisher_installs: number;
}

interface NewAdvertiserRow {
	name: string;
	store_id: string;
	category: string;
	installs: number | null;
	installs_sum_1w: number | null;
	release_date: string;
	developer_name: string | null;
	ad_network_domains: string | string[] | null;
	creative_count: number;
}

// ---- Helpers ----

function parseArrayField(value: string | string[] | null | undefined): string[] {
	if (!value) return [];
	if (Array.isArray(value)) return value.filter((v): v is string => !!v);
	return value
		.replace(/^[{]|[}]$/g, '')
		.split(',')
		.map((s) => s.trim())
		.filter((s) => s && s.toLowerCase() !== 'null');
}

function escapeCsvField(value: unknown): string {
	if (value == null) return '';
	const str = String(value);
	if (str.includes(',') || str.includes('"') || str.includes('\n')) {
		return `"${str.replace(/"/g, '""')}"`;
	}
	return str;
}

function toCsvRow(values: unknown[]): string {
	return values.map(escapeCsvField).join(',') + '\n';
}

// ---- Subscription check ----

async function userHasB2BAccess(userId: number): Promise<boolean> {
	return userHasTierAccess(userId, 'b2b_sdk', 'b2b_appads', 'b2b_premium');
}

// ---- Build advertiser CSV ----

async function buildAdvertiserCsv(): Promise<string> {
	const rawImpact = (reportJsonModules['../impact_growth.json'] ?? []) as ImpactGrowthRow[];
	const rawReach = (reportJsonModules['../reach.json'] ?? []) as ReachRow[];
	const rawNewAds = (reportJsonModules['../new_advertisers.json'] ?? []) as NewAdvertiserRow[];

	// ---- Advertiser dataset: one row per unique advertiser ----
	const advertiserMap = new Map<string, AdvertiserEntry>();

	// Process impact_growth data
	for (const row of rawImpact) {
		if (!advertiserMap.has(row.store_id)) {
			advertiserMap.set(row.store_id, {
				store_id: row.store_id,
				app_name: row.app_name,
				icon_128: row.icon_128,
				category: null,
				weekly_installs: 0,
				creative_count_from_impact: 0,
				ad_networks_set: new Set(),
				mmp_set: new Set(),
				unique_publishers: 0,
				unique_creatives_reach: 0,
				total_installs: null,
				developer: null,
				is_new: false
			});
		}
		const entry = advertiserMap.get(row.store_id)!;
		entry.weekly_installs = Math.max(entry.weekly_installs, row.weekly_installs);
		entry.creative_count_from_impact++;
		entry.unique_publishers = Math.max(entry.unique_publishers, row.pub_count);
		if (row.host_ad_domain) entry.ad_networks_set.add(row.host_ad_domain);
		if (row.initial_ad_domain) entry.ad_networks_set.add(row.initial_ad_domain);
		parseArrayField(row.mmp_domains).forEach((d) => entry.mmp_set.add(d));
	}

	// Merge reach data
	for (const row of rawReach) {
		const sid = row.advertiser_store_id;
		if (advertiserMap.has(sid)) {
			const entry = advertiserMap.get(sid)!;
			entry.unique_publishers = Math.max(entry.unique_publishers, row.unique_publishers);
			entry.unique_creatives_reach = Math.max(entry.unique_creatives_reach, row.unique_creatives);
			entry.total_installs = row.advertiser_installs;
			entry.category = entry.category || row.advertiser_category || null;
			if (row.advertiser_name) entry.app_name = row.advertiser_name;
			parseArrayField(row.ad_network_domains).forEach((d) => entry.ad_networks_set.add(d));
			parseArrayField(row.mmp_domains).forEach((d) => entry.mmp_set.add(d));
		} else {
			advertiserMap.set(sid, {
				store_id: sid,
				app_name: row.advertiser_name ?? sid,
				icon_128: row.advertiser_icon_128 ?? '',
				category: row.advertiser_category ?? null,
				weekly_installs: 0,
				creative_count_from_impact: 0,
				ad_networks_set: new Set(parseArrayField(row.ad_network_domains)),
				mmp_set: new Set(parseArrayField(row.mmp_domains)),
				unique_publishers: row.unique_publishers,
				unique_creatives_reach: row.unique_creatives,
				total_installs: row.advertiser_installs,
				developer: null,
				is_new: false
			});
		}
	}

	// Process new advertisers — fill developer name from this source
	for (const row of rawNewAds) {
		if (advertiserMap.has(row.store_id)) {
			const entry = advertiserMap.get(row.store_id)!;
			entry.is_new = true;
			if (!entry.developer) entry.developer = row.developer_name;
			entry.total_installs = entry.total_installs ?? row.installs;
			// Backfill weekly_installs from new_advertiser data
			if (entry.weekly_installs === 0 && row.installs_sum_1w) {
				entry.weekly_installs = Math.round(row.installs_sum_1w);
			}
		} else {
			const networks = parseArrayField(row.ad_network_domains);
			advertiserMap.set(row.store_id, {
				store_id: row.store_id,
				app_name: row.name,
				icon_128: '',
				category: row.category ?? null,
				weekly_installs: row.installs_sum_1w ? Math.round(row.installs_sum_1w) : 0,
				creative_count_from_impact: 0,
				ad_networks_set: new Set(networks),
				mmp_set: new Set(),
				unique_publishers: 0,
				unique_creatives_reach: 0,
				total_installs: row.installs,
				developer: row.developer_name,
				is_new: true
			});
		}
	}

	// Backfill developer names from DB for rows still missing them
	const storeIdsMissingDev: string[] = [];
	for (const [sid, entry] of advertiserMap) {
		if (!entry.developer) storeIdsMissingDev.push(sid);
	}
	if (storeIdsMissingDev.length > 0) {
		const storeIdList = storeIdsMissingDev.map((id) => `'${id.replace(/'/g, "''")}'`).join(',');
		try {
			const devRows = await db.query<{ store_id: string; developer_name: string | null }>(
				`SELECT DISTINCT store_id, developer_name FROM apps
                 WHERE store_id IN (${storeIdList}) AND developer_name IS NOT NULL`
			);
			for (const row of devRows) {
				if (row.developer_name) {
					const entry = advertiserMap.get(row.store_id);
					if (entry) entry.developer = row.developer_name;
				}
			}
		} catch (err) {
			console.error('Failed to backfill developer names:', err);
		}
	}

	// Backfill weekly_installs for rows still at 0
	// Use installs_sum_1w from new_advertisers or total_installs / 4 as rough proxy
	for (const [, entry] of advertiserMap) {
		if (entry.weekly_installs === 0) {
			// Try from new-advertiser weekly data (already merged via total_installs in some cases)
			if (entry.total_installs && entry.total_installs > 0) {
				entry.weekly_installs = Math.round(entry.total_installs / 4);
			}
		}
	}

	// Estimate ad buying size score
	function estimateBuyingSize(entry: AdvertiserEntry): number {
		const installScore = Math.log2(Math.max(entry.weekly_installs, 1)) * 2;
		const publisherScore = entry.unique_publishers * 3;
		const creativeScore =
			Math.max(entry.creative_count_from_impact, entry.unique_creatives_reach) * 5;
		const networkScore = entry.ad_networks_set.size * 10;
		return Math.round(installScore + publisherScore + creativeScore + networkScore);
	}

	// ---- Write CSV ----
	let csv = '';

	// Header row
	csv += toCsvRow([
		'store_id',
		'app_name',
		'category',
		'developer',
		'report_period',
		'weekly_installs',
		'total_estimated_installs',
		'unique_publishers',
		'unique_creatives_count',
		'ad_networks',
		'mmp_providers',
		'estimated_buying_size_score'
	]);

	// Sort by estimated buying size descending
	const sorted = Array.from(advertiserMap.values()).sort((a, b) => {
		return estimateBuyingSize(b) - estimateBuyingSize(a);
	});

	for (const entry of sorted) {
		const buyingScore = estimateBuyingSize(entry);
		csv += toCsvRow([
			entry.store_id,
			entry.app_name,
			entry.category ?? '',
			entry.developer ?? '',
			'June 2026',
			entry.weekly_installs,
			entry.total_installs ?? '',
			entry.unique_publishers,
			Math.max(entry.creative_count_from_impact, entry.unique_creatives_reach),
			[...entry.ad_networks_set].join('; '),
			[...entry.mmp_set].join('; '),
			buyingScore
		]);
	}

	return csv;
}

// ---- Endpoint ----

export async function GET(event: RequestEvent) {
	const { user } = requireFullAuth(event);

	const hasB2B = await userHasB2BAccess(user.id);
	if (!hasB2B) {
		throw error(403, 'A B2B Intelligence subscription is required to download this CSV.');
	}

	const csv = await buildAdvertiserCsv();

	return new Response(csv, {
		status: 200,
		headers: {
			'Content-Type': 'text/csv; charset=utf-8',
			'Content-Disposition': `attachment; filename="appgoblin-june-2026-advertisers.csv"`
		}
	});
}
