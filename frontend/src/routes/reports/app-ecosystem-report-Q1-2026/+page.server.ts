import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import mau2026ExhibitorsCsv from './MAU2026Exhibitors.csv?raw';

type EcosystemCompanyData = {
	company_name: string;
	company_domain: string;
	parent_company_domain: string | null;
	parent_company_name: string | null;
	apple_app_ads_direct_app_count: number | null;
	apple_sdk_app_count: number | null;
	google_app_ads_direct_app_count: number | null;
	google_sdk_app_count: number | null;
	apple_app_ads_direct_percentage: number | null;
	apple_sdk_percentage: number | null;
	google_app_ads_direct_percentage: number | null;
	google_sdk_percentage: number | null;
	apple_app_ads_direct_installs_d30: number | null;
	apple_sdk_installs_d30: number | null;
	google_app_ads_direct_installs_d30: number | null;
	google_sdk_installs_d30: number | null;
	total_app_count: number | null;
	installs_d30: number | null;
	company_logo_url: string | null;
	parent_company_logo_url: string | null;
	company_category: string | null;
	trends_latest_period: string | null;
	apple_app_ads_direct_latest_pct_market_share_change: number | null;
	apple_sdk_latest_pct_market_share_change: number | null;
	google_app_ads_direct_latest_pct_market_share_change: number | null;
	google_sdk_latest_pct_market_share_change: number | null;
	apple_app_ads_direct_latest_apps_added: number | null;
	apple_sdk_latest_apps_added: number | null;
	google_app_ads_direct_latest_apps_added: number | null;
	google_sdk_latest_apps_added: number | null;
	apple_app_ads_direct_latest_apps_lost: number | null;
	apple_sdk_latest_apps_lost: number | null;
	google_app_ads_direct_latest_apps_lost: number | null;
	google_sdk_latest_apps_lost: number | null;
	tag_source: string;
	store: string;
	app_count: number;
	percentage: number;
};

type SurfaceConfig = {
	id: string;
	title: string;
	description: string;
	appCountKey: keyof EcosystemCompanyData;
	minimumLeaderboardApps: number;
	shareKey: keyof EcosystemCompanyData;
	installsKey: keyof EcosystemCompanyData;
	shareChangeKey: keyof EcosystemCompanyData;
	appsAddedKey: keyof EcosystemCompanyData;
	appsLostKey: keyof EcosystemCompanyData;
};

type MetricValueKey = 'shareChangeKey' | 'appsAddedKey' | 'appsLostKey';

type SingleSectionConfig = {
	id: string;
	title: string;
	basisLabel: string;
	description: string;
	descriptionHtml?: string;
	presentation: 'single';
	metricKey: Extract<MetricValueKey, 'shareChangeKey' | 'appsAddedKey' | 'appsLostKey'>;
	primaryMetricLabel: string;
	listLabel: string;
	activeMetaLabel: string;
	tone: 'positive' | 'negative';
	primaryFormat: 'signedPercent' | 'count';
};

type MetricSectionConfig = SingleSectionConfig;

type LeaderboardEntry = {
	companyName: string;
	companyDomain: string;
	parentCompanyName: string | null;
	parentCompanyDomain: string | null;
	companyLogoUrl: string | null;
	primaryValue: number | null;
	share: number | null;
	installs: number | null;
	qoqShareChange: number | null;
	appsAdded: number | null;
	appsLost: number | null;
	totalAppCount: number | null;
};

type MetricSurfacePanel = {
	id: string;
	title: string;
	description: string;
	coverageCount: number;
	meta: string;
	topGood?: LeaderboardEntry[];
	topBad?: LeaderboardEntry[];
	topEntries?: LeaderboardEntry[];
};

type MetricSection = {
	id: string;
	title: string;
	basisLabel: string;
	description: string;
	descriptionHtml?: string;
	presentation: 'signed' | 'single';
	primaryMetricLabel: string;
	primaryFormat: 'signedPercent' | 'count';
	goodLabel?: string;
	badLabel?: string;
	listLabel?: string;
	tone?: 'positive' | 'negative';
	panels: MetricSurfacePanel[];
};

type CompanyTypeOption = {
	value: string;
	label: string;
	count: number;
};

const ALL_MAPPED_COMPANY_TYPE = 'all_mapped';
const UNMAPPED_COMPANY_TYPE = '__unmapped__';
const BREAKOUT_SPOTLIGHT_LIMIT = 10;
const MAU_COMBINED_ANALYTICS_COMPANY_TYPE = '__mau_combined_analytics__';
const DEVELOPMENT_TOOLS_COMPANY_TYPE = 'Development Tools';
const MAU_COMBINED_ANALYTICS_COMPANY_TYPES = ['Analytics: Product', 'Analytics: Attribution'];

const SURFACE_CONFIGS: SurfaceConfig[] = [
	{
		id: 'google-sdk',
		title: 'Google Play SDK Footprint',
		description: 'Quarter-over-quarter SDK footprint changes across Google Play apps.',
		appCountKey: 'google_sdk_app_count',
		minimumLeaderboardApps: 20,
		shareKey: 'google_sdk_percentage',
		installsKey: 'google_sdk_installs_d30',
		shareChangeKey: 'google_sdk_latest_pct_market_share_change',
		appsAddedKey: 'google_sdk_latest_apps_added',
		appsLostKey: 'google_sdk_latest_apps_lost'
	},
	{
		id: 'apple-sdk',
		title: 'Apple SDK Footprint',
		description: 'Quarter-over-quarter SDK footprint changes across Apple App Store apps.',
		appCountKey: 'apple_sdk_app_count',
		minimumLeaderboardApps: 20,
		shareKey: 'apple_sdk_percentage',
		installsKey: 'apple_sdk_installs_d30',
		shareChangeKey: 'apple_sdk_latest_pct_market_share_change',
		appsAddedKey: 'apple_sdk_latest_apps_added',
		appsLostKey: 'apple_sdk_latest_apps_lost'
	},
	{
		id: 'google-adstxt',
		title: 'Google Play app-ads.txt Direct',
		description: 'Quarter-over-quarter direct app-ads.txt changes across Google Play publishers.',
		appCountKey: 'google_app_ads_direct_app_count',
		minimumLeaderboardApps: 100,
		shareKey: 'google_app_ads_direct_percentage',
		installsKey: 'google_app_ads_direct_installs_d30',
		shareChangeKey: 'google_app_ads_direct_latest_pct_market_share_change',
		appsAddedKey: 'google_app_ads_direct_latest_apps_added',
		appsLostKey: 'google_app_ads_direct_latest_apps_lost'
	},
	{
		id: 'apple-adstxt',
		title: 'Apple app-ads.txt Direct',
		description:
			'Quarter-over-quarter direct app-ads.txt changes across Apple App Store publishers.',
		appCountKey: 'apple_app_ads_direct_app_count',
		minimumLeaderboardApps: 100,
		shareKey: 'apple_app_ads_direct_percentage',
		installsKey: 'apple_app_ads_direct_installs_d30',
		shareChangeKey: 'apple_app_ads_direct_latest_pct_market_share_change',
		appsAddedKey: 'apple_app_ads_direct_latest_apps_added',
		appsLostKey: 'apple_app_ads_direct_latest_apps_lost'
	}
];

const SECTION_CONFIGS: MetricSectionConfig[] = [
	{
		id: 'qoq-share-change',
		title: 'Fastest growing mobile companies',
		basisLabel: 'Based on Q/Q market share change',
		description:
			'Standout quarter-over-quarter market share breakouts across ad networks, business tools, analytics, and development tools.',
		descriptionHtml: `<p>Ad Networks were led by <a href="/companies/verve.com">Verve</a> once again after its strong Q4 2025, with other notable breakouts from <a href="/companies/snapchat.com">Snap</a>, <a href="/companies/taurusx.com">TaurusX</a>, <a href="/companies/adjoe-programmatic.com">AdJoe</a>, and <a href="/companies/moloco.com">Moloco</a>.</p><p>Business Tools were driven by smaller but fast-growing names like <a href="/companies/luciq.ai">Luciq</a>. <a href="/companies/paypal.com">PayPal</a> also posted strong mobile growth, while emerging companies like <a href="/companies/appharbr.com">AppHarbr</a> and <a href="/companies/getthinkup.com">ThinkUp</a> stood out.</p><p>In attribution analytics, growth was broadly healthy across the category and was led by <a href="/companies/tenjin.com">Tenjin</a>. One notable absence from the growth list was <a href="/companies/appsflyer.com">AppsFlyer</a>, which has historically been one of the category's largest and most consistent performers.</p><p>For Development Tools, <a href="/companies/divkit.tech">Divkit</a> posted solid growth. The framework launched in 2025 and is backed by <a href="/companies/yandex.com">Yandex</a>.</p>`,
		presentation: 'single',
		metricKey: 'shareChangeKey',
		primaryMetricLabel: 'Q/Q Market Share Change',
		listLabel: 'Breakouts',
		activeMetaLabel: 'share breakouts',
		tone: 'positive',
		primaryFormat: 'signedPercent'
	},
	{
		id: 'apps-lost',
		title: 'Apps lost',
		basisLabel: 'Largest companies churning client apps',
		description:
			'These are the companies that saw the most apps leave their platforms. Many of these companies still saw growth, just that they also churned some client apps at the same time.',
		presentation: 'single',
		metricKey: 'appsLostKey',
		primaryMetricLabel: 'Apps lost',
		listLabel: 'Apps lost watchlist',
		activeMetaLabel: 'losing apps',
		tone: 'negative',
		primaryFormat: 'count'
	}
];

const MAU_EXHIBITOR_SECTION_ID = 'mau-2026-exhibitors';

const MAU_EXHIBITOR_SECTION_CONFIG: MetricSectionConfig = {
	id: MAU_EXHIBITOR_SECTION_ID,
	title: 'MAU 2026 exhibitor breakouts',
	basisLabel: 'Fastest-growing MAU 2026 exhibitors',
	description:
		'This section highlights the fastest-growing companies among the exhibitors at MAU 2026. These companies have demonstrated significant quarter-over-quarter market share growth, making them standouts in the mobile ecosystem. Notable exhibitors with strong growth include Verve, Snap, TaurusX, Adjoe, Moloco, Luciq, Paypal, AppHarbr, ThinkUp, and Tenjin. These companies are worth watching as they continue to expand their presence in the mobile market.',
	presentation: 'single',
	metricKey: 'shareChangeKey',
	primaryMetricLabel: 'Q/Q Market Share Change',
	listLabel: 'Exhibitor breakouts',
	activeMetaLabel: 'exhibitor breakouts',
	tone: 'positive',
	primaryFormat: 'signedPercent'
};

function parseCsvLine(line: string): string[] {
	const values: string[] = [];
	let current = '';
	let inQuotes = false;

	for (let index = 0; index < line.length; index += 1) {
		const char = line[index];

		if (char === '"') {
			const isEscapedQuote = inQuotes && line[index + 1] === '"';
			if (isEscapedQuote) {
				current += '"';
				index += 1;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === ',' && !inQuotes) {
			values.push(current);
			current = '';
		} else {
			current += char;
		}
	}

	values.push(current);
	return values;
}

function coerceValue(rawValue: string): string | number | null {
	const value = rawValue.trim();

	if (!value || value === 'null') {
		return null;
	}

	const numericValue = Number(value);
	if (!Number.isNaN(numericValue)) {
		return numericValue;
	}

	return value;
}

function getStringByKeys(
	record: Record<string, string | number | null>,
	...keys: string[]
): string | null {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'string') {
			return value;
		}
	}

	return null;
}

function getRequiredStringByKeys(
	record: Record<string, string | number | null>,
	...keys: string[]
): string {
	return getStringByKeys(record, ...keys) ?? '';
}

function getNumberByKeys(
	record: Record<string, string | number | null>,
	...keys: string[]
): number | null {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'number' && !Number.isNaN(value)) {
			return value;
		}
	}

	return null;
}

function getMarketShareRatio(
	record: Record<string, string | number | null>,
	legacyKey: string,
	percentKey: string
): number | null {
	const legacyValue = getNumberByKeys(record, legacyKey);
	if (legacyValue !== null) {
		return legacyValue;
	}

	const percentValue = getNumberByKeys(record, percentKey);
	if (percentValue === null) {
		return null;
	}

	return percentValue / 100;
}

function parseCSV(csvContent: string): EcosystemCompanyData[] {
	const lines = csvContent.trim().split(/\r?\n/).filter(Boolean);

	if (lines.length < 2) {
		return [];
	}

	const headers = parseCsvLine(lines[0]).map((header) => header.trim());

	return lines.slice(1).map((line) => {
		const values = parseCsvLine(line);
		const record: Record<string, string | number | null> = {};

		headers.forEach((header, index) => {
			record[header] = coerceValue(values[index] ?? '');
		});

		const appleDirectAppCount = getNumberByKeys(
			record,
			'apple_app_ads_direct_app_count',
			'apple_app_ads_direct_total_apps'
		);
		const appleSdkAppCount = getNumberByKeys(record, 'apple_sdk_app_count', 'apple_sdk_total_apps');
		const googleDirectAppCount = getNumberByKeys(
			record,
			'google_app_ads_direct_app_count',
			'google_app_ads_direct_total_apps'
		);
		const googleSdkAppCount = getNumberByKeys(
			record,
			'google_sdk_app_count',
			'google_sdk_total_apps'
		);
		const totalAppCount =
			getNumberByKeys(record, 'total_app_count') ??
			sumNullable([appleDirectAppCount, appleSdkAppCount, googleDirectAppCount, googleSdkAppCount]);

		return {
			company_name: getRequiredStringByKeys(record, 'company_name'),
			company_domain: getRequiredStringByKeys(record, 'company_domain'),
			parent_company_domain: getStringByKeys(record, 'parent_company_domain'),
			parent_company_name: getStringByKeys(record, 'parent_company_name'),
			apple_app_ads_direct_app_count: appleDirectAppCount,
			apple_sdk_app_count: appleSdkAppCount,
			google_app_ads_direct_app_count: googleDirectAppCount,
			google_sdk_app_count: googleSdkAppCount,
			apple_app_ads_direct_percentage: getMarketShareRatio(
				record,
				'apple_app_ads_direct_percentage',
				'apple_app_ads_direct_pct_market_share'
			),
			apple_sdk_percentage: getMarketShareRatio(
				record,
				'apple_sdk_percentage',
				'apple_sdk_pct_market_share'
			),
			google_app_ads_direct_percentage: getMarketShareRatio(
				record,
				'google_app_ads_direct_percentage',
				'google_app_ads_direct_pct_market_share'
			),
			google_sdk_percentage: getMarketShareRatio(
				record,
				'google_sdk_percentage',
				'google_sdk_pct_market_share'
			),
			apple_app_ads_direct_installs_d30: getNumberByKeys(
				record,
				'apple_app_ads_direct_installs_d30'
			),
			apple_sdk_installs_d30: getNumberByKeys(record, 'apple_sdk_installs_d30'),
			google_app_ads_direct_installs_d30: getNumberByKeys(
				record,
				'google_app_ads_direct_installs_d30'
			),
			google_sdk_installs_d30: getNumberByKeys(record, 'google_sdk_installs_d30'),
			total_app_count: totalAppCount,
			installs_d30: getNumberByKeys(record, 'installs_d30'),
			company_logo_url: getStringByKeys(record, 'company_logo_url'),
			parent_company_logo_url: getStringByKeys(record, 'parent_company_logo_url'),
			company_category: getStringByKeys(record, 'company_category'),
			trends_latest_period: getStringByKeys(record, 'trends_latest_period', 'trends_period'),
			apple_app_ads_direct_latest_pct_market_share_change: getNumberByKeys(
				record,
				'apple_app_ads_direct_latest_pct_market_share_change',
				'apple_app_ads_direct_pct_market_share_change'
			),
			apple_sdk_latest_pct_market_share_change: getNumberByKeys(
				record,
				'apple_sdk_latest_pct_market_share_change',
				'apple_sdk_pct_market_share_change'
			),
			google_app_ads_direct_latest_pct_market_share_change: getNumberByKeys(
				record,
				'google_app_ads_direct_latest_pct_market_share_change',
				'google_app_ads_direct_pct_market_share_change'
			),
			google_sdk_latest_pct_market_share_change: getNumberByKeys(
				record,
				'google_sdk_latest_pct_market_share_change',
				'google_sdk_pct_market_share_change'
			),
			apple_app_ads_direct_latest_apps_added: getNumberByKeys(
				record,
				'apple_app_ads_direct_latest_apps_added',
				'apple_app_ads_direct_apps_added'
			),
			apple_sdk_latest_apps_added: getNumberByKeys(
				record,
				'apple_sdk_latest_apps_added',
				'apple_sdk_apps_added'
			),
			google_app_ads_direct_latest_apps_added: getNumberByKeys(
				record,
				'google_app_ads_direct_latest_apps_added',
				'google_app_ads_direct_apps_added'
			),
			google_sdk_latest_apps_added: getNumberByKeys(
				record,
				'google_sdk_latest_apps_added',
				'google_sdk_apps_added'
			),
			apple_app_ads_direct_latest_apps_lost: getNumberByKeys(
				record,
				'apple_app_ads_direct_latest_apps_lost',
				'apple_app_ads_direct_apps_lost'
			),
			apple_sdk_latest_apps_lost: getNumberByKeys(
				record,
				'apple_sdk_latest_apps_lost',
				'apple_sdk_apps_lost'
			),
			google_app_ads_direct_latest_apps_lost: getNumberByKeys(
				record,
				'google_app_ads_direct_latest_apps_lost',
				'google_app_ads_direct_apps_lost'
			),
			google_sdk_latest_apps_lost: getNumberByKeys(
				record,
				'google_sdk_latest_apps_lost',
				'google_sdk_apps_lost'
			),
			tag_source: 'report',
			store: 'all',
			app_count: totalAppCount,
			percentage: 0
		};
	});
}

function parseExhibitorDomains(csvContent: string): Set<string> {
	const lines = csvContent.trim().split(/\r?\n/).filter(Boolean);

	if (lines.length < 2) {
		return new Set();
	}

	const headers = parseCsvLine(lines[0]).map((header) => header.trim());
	const domainIndex = headers.indexOf('company_domain');

	if (domainIndex === -1) {
		return new Set();
	}

	const domains = lines
		.slice(1)
		.map((line) => parseCsvLine(line)[domainIndex]?.trim().toLowerCase() ?? '')
		.filter(Boolean);

	return new Set(domains);
}

function sumNullable(values: Array<number | null>): number {
	return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

function hasValue(value: number | null): value is number {
	return typeof value === 'number' && !Number.isNaN(value);
}

function getCompanyTypeValue(row: EcosystemCompanyData): string {
	return row.company_category ?? UNMAPPED_COMPANY_TYPE;
}

function getCompanyTypeLabel(value: string): string {
	if (value === MAU_COMBINED_ANALYTICS_COMPANY_TYPE) {
		return 'Analytics';
	}

	if (value === ALL_MAPPED_COMPANY_TYPE) {
		return 'All mapped companies';
	}

	if (value === UNMAPPED_COMPANY_TYPE) {
		return 'Unmapped (Company Category null)';
	}

	return value;
}

function buildCompanyTypeOptions(rows: EcosystemCompanyData[]): CompanyTypeOption[] {
	const counts = new Map<string, number>();
	const mappedRows = rows.filter((row) => getCompanyTypeValue(row) !== UNMAPPED_COMPANY_TYPE);

	for (const row of rows) {
		const value = getCompanyTypeValue(row);
		counts.set(value, (counts.get(value) ?? 0) + 1);
	}

	const options = Array.from(counts.entries())
		.filter(([value]) => value !== UNMAPPED_COMPANY_TYPE)
		.map(([value, count]) => ({
			value,
			label: getCompanyTypeLabel(value),
			count
		}))
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

	return [
		{
			value: ALL_MAPPED_COMPANY_TYPE,
			label: getCompanyTypeLabel(ALL_MAPPED_COMPANY_TYPE),
			count: mappedRows.length
		},
		...options
	];
}

function buildMauCompanyTypeOptions(
	rows: EcosystemCompanyData[],
	exhibitorDomains: Set<string>
): CompanyTypeOption[] {
	const exhibitorRows = rows.filter((row) =>
		exhibitorDomains.has(row.company_domain.toLowerCase())
	);
	const counts = new Map<string, number>();
	let combinedAnalyticsCount = 0;

	for (const row of exhibitorRows) {
		const value = getCompanyTypeValue(row);

		if (value === UNMAPPED_COMPANY_TYPE || value === DEVELOPMENT_TOOLS_COMPANY_TYPE) {
			continue;
		}

		if (MAU_COMBINED_ANALYTICS_COMPANY_TYPES.includes(value)) {
			combinedAnalyticsCount += 1;
			continue;
		}

		counts.set(value, (counts.get(value) ?? 0) + 1);
	}

	if (combinedAnalyticsCount > 0) {
		counts.set(MAU_COMBINED_ANALYTICS_COMPANY_TYPE, combinedAnalyticsCount);
	}

	const options = Array.from(counts.entries())
		.map(([value, count]) => ({
			value,
			label: getCompanyTypeLabel(value),
			count
		}))
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

	return [
		{
			value: ALL_MAPPED_COMPANY_TYPE,
			label: getCompanyTypeLabel(ALL_MAPPED_COMPANY_TYPE),
			count: options.reduce((total, option) => total + option.count, 0)
		},
		...options
	];
}

function buildCompanyTypeOptionsBySection(
	rows: EcosystemCompanyData[],
	exhibitorDomains: Set<string>
): Record<string, CompanyTypeOption[]> {
	return {
		[MAU_EXHIBITOR_SECTION_ID]: buildMauCompanyTypeOptions(rows, exhibitorDomains)
	};
}

function getSurfaceMetricValue(
	row: EcosystemCompanyData,
	surface: SurfaceConfig,
	metricKey: MetricValueKey
): number | null {
	return (row[surface[metricKey]] as number | null) ?? null;
}

function getShareWeightedImpact(
	row: EcosystemCompanyData,
	surface: SurfaceConfig,
	metricKey: MetricValueKey
): number {
	const metricValue = getSurfaceMetricValue(row, surface, metricKey) ?? 0;

	if (metricKey === 'shareChangeKey') {
		return metricValue;
	}

	const shareValue = (row[surface.shareKey] as number | null) ?? 0;
	return metricValue * shareValue;
}

function meetsSurfaceAppCountMinimum(row: EcosystemCompanyData, surface: SurfaceConfig): boolean {
	const appCount = row[surface.appCountKey] as number | null;
	return (appCount ?? 0) >= surface.minimumLeaderboardApps;
}

function toLeaderboardEntry(
	row: EcosystemCompanyData,
	surface: SurfaceConfig,
	primaryValue: number | null
): LeaderboardEntry {
	return {
		companyName: row.company_name,
		companyDomain: row.company_domain,
		parentCompanyName: row.parent_company_name,
		parentCompanyDomain: row.parent_company_domain,
		companyLogoUrl: row.company_logo_url,
		share: (row[surface.shareKey] as number | null) ?? null,
		installs: (row[surface.installsKey] as number | null) ?? null,
		qoqShareChange: (row[surface.shareChangeKey] as number | null) ?? null,
		appsAdded: (row[surface.appsAddedKey] as number | null) ?? null,
		appsLost: (row[surface.appsLostKey] as number | null) ?? null,
		totalAppCount: row.total_app_count,
		primaryValue
	};
}

function buildSingleSurfacePanel(
	rows: EcosystemCompanyData[],
	surface: SurfaceConfig,
	section: SingleSectionConfig
): MetricSurfacePanel {
	const rowsWithCoverage = rows.filter(
		(row) =>
			hasValue(row[surface.shareKey] as number | null) ||
			hasValue(row[surface.installsKey] as number | null)
	);
	const activeRows = rows
		.filter(
			(row) =>
				(getSurfaceMetricValue(row, surface, section.metricKey) ?? 0) > 0 &&
				meetsSurfaceAppCountMinimum(row, surface)
		)
		.sort(
			(a, b) =>
				getShareWeightedImpact(b, surface, section.metricKey) -
					getShareWeightedImpact(a, surface, section.metricKey) ||
				(getSurfaceMetricValue(b, surface, section.metricKey) ?? Number.NEGATIVE_INFINITY) -
					(getSurfaceMetricValue(a, surface, section.metricKey) ?? Number.NEGATIVE_INFINITY)
		);

	return {
		id: `${section.id}-${surface.id}`,
		title: surface.title,
		description: surface.description,
		coverageCount: rowsWithCoverage.length,
		meta: `${rowsWithCoverage.length} tracked • ${activeRows.length} ${section.activeMetaLabel}`,
		topEntries: activeRows
			.slice(0, BREAKOUT_SPOTLIGHT_LIMIT)
			.map((row) =>
				toLeaderboardEntry(row, surface, getSurfaceMetricValue(row, surface, section.metricKey))
			)
	};
}

function buildMetricSection(
	rows: EcosystemCompanyData[],
	section: MetricSectionConfig
): MetricSection {
	return {
		id: section.id,
		title: section.title,
		basisLabel: section.basisLabel,
		description: section.description,
		descriptionHtml: section.descriptionHtml,
		presentation: section.presentation,
		primaryMetricLabel: section.primaryMetricLabel,
		primaryFormat: section.primaryFormat,
		goodLabel: undefined,
		badLabel: undefined,
		listLabel: section.listLabel,
		tone: section.tone,
		panels: SURFACE_CONFIGS.map((surface) => buildSingleSurfacePanel(rows, surface, section))
	};
}

function buildMetricSections(rows: EcosystemCompanyData[]): MetricSection[] {
	return SECTION_CONFIGS.map((section) => buildMetricSection(rows, section));
}

function buildReportMetricSections(
	rows: EcosystemCompanyData[],
	exhibitorDomains: Set<string>
): MetricSection[] {
	const exhibitorRows = rows.filter((row) =>
		exhibitorDomains.has(row.company_domain.toLowerCase())
	);

	return [
		...buildMetricSections(rows),
		buildMetricSection(exhibitorRows, MAU_EXHIBITOR_SECTION_CONFIG)
	];
}

function buildMetricSectionsByCompanyType(
	rows: EcosystemCompanyData[],
	options: CompanyTypeOption[],
	exhibitorDomains: Set<string>
): Record<string, MetricSection[]> {
	const sectionsByCompanyType: Record<string, MetricSection[]> = {
		[ALL_MAPPED_COMPANY_TYPE]: buildReportMetricSections(
			rows.filter((row) => getCompanyTypeValue(row) !== UNMAPPED_COMPANY_TYPE),
			exhibitorDomains
		)
	};

	for (const option of options) {
		if (option.value === ALL_MAPPED_COMPANY_TYPE) {
			continue;
		}

		if (option.value === MAU_COMBINED_ANALYTICS_COMPANY_TYPE) {
			sectionsByCompanyType[MAU_COMBINED_ANALYTICS_COMPANY_TYPE] = buildReportMetricSections(
				rows.filter((row) =>
					MAU_COMBINED_ANALYTICS_COMPANY_TYPES.includes(getCompanyTypeValue(row))
				),
				exhibitorDomains
			);
			continue;
		}

		sectionsByCompanyType[option.value] = buildReportMetricSections(
			rows.filter((row) => getCompanyTypeValue(row) === option.value),
			exhibitorDomains
		);
	}

	if (!sectionsByCompanyType[MAU_COMBINED_ANALYTICS_COMPANY_TYPE]) {
		sectionsByCompanyType[MAU_COMBINED_ANALYTICS_COMPANY_TYPE] = buildReportMetricSections(
			rows.filter((row) => MAU_COMBINED_ANALYTICS_COMPANY_TYPES.includes(getCompanyTypeValue(row))),
			exhibitorDomains
		);
	}

	return sectionsByCompanyType;
}

export const load: PageServerLoad = async ({ fetch }) => {
	const csvResponse = await fetch(
		'/reports/mobile-apps-growth-sdks-q1-2026/AppGoblin Mobile Ecosystem 2026 Q1.csv'
	);

	if (!csvResponse.ok) {
		throw error(500, 'CSV not available');
	}

	const csvContent = await csvResponse.text();
	const allData = parseCSV(csvContent);
	const exhibitorDomains = parseExhibitorDomains(mau2026ExhibitorsCsv);
	const reportPeriod = allData[0]?.trends_latest_period ?? '2026-Q1';
	const companyTypeOptions = buildCompanyTypeOptions(allData);
	const companyTypeOptionsBySection = buildCompanyTypeOptionsBySection(allData, exhibitorDomains);
	const metricSections = buildReportMetricSections(allData, exhibitorDomains);
	const metricSectionsByCompanyType = buildMetricSectionsByCompanyType(
		allData,
		companyTypeOptions,
		exhibitorDomains
	);
	const trackedSdkCompanies = allData.filter(
		(row) => hasValue(row.google_sdk_percentage) || hasValue(row.apple_sdk_percentage)
	).length;
	const trackedAdCompanies = allData.filter(
		(row) =>
			hasValue(row.google_app_ads_direct_percentage) ||
			hasValue(row.apple_app_ads_direct_percentage)
	).length;

	return {
		allData,
		metricSections,
		metricSectionsByCompanyType,
		companyTypeOptions,
		companyTypeOptionsBySection,
		summary: {
			totalCompanies: allData.length,
			trackedSdkCompanies,
			trackedAdCompanies,
			companyAppFootprint: sumNullable(allData.map((row) => row.total_app_count)),
			installsFootprint: sumNullable(allData.map((row) => row.installs_d30)),
			reportPeriod
		},
		title: 'AppGoblin Mobile Ecosystem Report Q1 2026 | AppGoblin',
		description:
			'Quarter-over-quarter mobile ecosystem shifts for SDK and app-ads.txt direct footprints across Google Play and Apple App Store companies in Q1 2026.',
		keywords:
			'mobile ecosystem report, sdk market share, app-ads.txt trends, qoq mobile growth, google play sdk, apple app store sdk'
	};
};
