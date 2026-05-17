import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

type NumericField =
	| 'apple_app_ads_direct_percentage'
	| 'apple_app_ads_reseller_percentage'
	| 'apple_sdk_percentage'
	| 'google_api_call_percentage'
	| 'google_app_ads_direct_percentage'
	| 'google_app_ads_reseller_percentage'
	| 'google_sdk_percentage'
	| 'apple_app_ads_direct_installs_d30'
	| 'apple_app_ads_reseller_installs_d30'
	| 'apple_sdk_installs_d30'
	| 'google_api_call_installs_d30'
	| 'google_app_ads_direct_installs_d30'
	| 'google_app_ads_reseller_installs_d30'
	| 'google_sdk_installs_d30'
	| 'total_app_count'
	| 'installs_d30'
	| 'percent_open_source'
	| 'apple_app_ads_direct_latest_pct_market_share_change'
	| 'apple_sdk_latest_pct_market_share_change'
	| 'google_app_ads_direct_latest_pct_market_share_change'
	| 'google_sdk_latest_pct_market_share_change'
	| 'apple_app_ads_direct_latest_total_apps_change_pct'
	| 'apple_sdk_latest_total_apps_change_pct'
	| 'google_app_ads_direct_latest_total_apps_change_pct'
	| 'google_sdk_latest_total_apps_change_pct'
	| 'apple_app_ads_direct_latest_apps_added'
	| 'apple_sdk_latest_apps_added'
	| 'google_app_ads_direct_latest_apps_added'
	| 'google_sdk_latest_apps_added'
	| 'apple_app_ads_direct_latest_apps_lost'
	| 'apple_sdk_latest_apps_lost'
	| 'google_app_ads_direct_latest_apps_lost'
	| 'google_sdk_latest_apps_lost';

type StringField =
	| 'company_name'
	| 'company_domain'
	| 'parent_company_domain'
	| 'parent_company_name'
	| 'api_ip_resolved_country'
	| 'company_logo_url'
	| 'parent_company_logo_url'
	| 'company_category'
	| 'trends_latest_period';

type EcosystemCompanyData = {
	company_name: string;
	company_domain: string;
	parent_company_domain: string | null;
	parent_company_name: string | null;
	apple_app_ads_direct_percentage: number | null;
	apple_app_ads_reseller_percentage: number | null;
	apple_sdk_percentage: number | null;
	google_api_call_percentage: number | null;
	google_app_ads_direct_percentage: number | null;
	google_app_ads_reseller_percentage: number | null;
	google_sdk_percentage: number | null;
	apple_app_ads_direct_installs_d30: number | null;
	apple_app_ads_reseller_installs_d30: number | null;
	apple_sdk_installs_d30: number | null;
	google_api_call_installs_d30: number | null;
	google_app_ads_direct_installs_d30: number | null;
	google_app_ads_reseller_installs_d30: number | null;
	google_sdk_installs_d30: number | null;
	total_app_count: number | null;
	installs_d30: number | null;
	percent_open_source: number;
	api_ip_resolved_country: string | null;
	company_logo_url: string | null;
	parent_company_logo_url: string | null;
	company_category: string | null;
	trends_latest_period: string | null;
	apple_app_ads_direct_latest_pct_market_share_change: number | null;
	apple_sdk_latest_pct_market_share_change: number | null;
	google_app_ads_direct_latest_pct_market_share_change: number | null;
	google_sdk_latest_pct_market_share_change: number | null;
	apple_app_ads_direct_latest_total_apps_change_pct: number | null;
	apple_sdk_latest_total_apps_change_pct: number | null;
	google_app_ads_direct_latest_total_apps_change_pct: number | null;
	google_sdk_latest_total_apps_change_pct: number | null;
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
	shareKey: keyof EcosystemCompanyData;
	installsKey: keyof EcosystemCompanyData;
	shareChangeKey: keyof EcosystemCompanyData;
	appsChangeKey: keyof EcosystemCompanyData;
	appsAddedKey: keyof EcosystemCompanyData;
	appsLostKey: keyof EcosystemCompanyData;
};

type MetricValueKey = 'shareChangeKey' | 'appsChangeKey' | 'appsAddedKey' | 'appsLostKey';

type SignedSectionConfig = {
	id: string;
	title: string;
	basisLabel: string;
	description: string;
	presentation: 'signed';
	metricKey: Extract<MetricValueKey, 'shareChangeKey' | 'appsChangeKey'>;
	primaryMetricLabel: string;
	goodLabel: string;
	badLabel: string;
	positiveMetaLabel: string;
	negativeMetaLabel: string;
	primaryFormat: 'signedPercent';
};

type SingleSectionConfig = {
	id: string;
	title: string;
	basisLabel: string;
	description: string;
	presentation: 'single';
	metricKey: Extract<MetricValueKey, 'appsAddedKey' | 'appsLostKey'>;
	primaryMetricLabel: string;
	listLabel: string;
	activeMetaLabel: string;
	tone: 'positive' | 'negative';
	primaryFormat: 'count';
};

type MetricSectionConfig = SignedSectionConfig | SingleSectionConfig;

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
	qoqAppsChange: number | null;
	appsAdded: number | null;
	appsLost: number | null;
	totalAppCount: number | null;
	apiCountry: string | null;
	percentOpenSource: number;
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

const NUMERIC_FIELDS: NumericField[] = [
	'apple_app_ads_direct_percentage',
	'apple_app_ads_reseller_percentage',
	'apple_sdk_percentage',
	'google_api_call_percentage',
	'google_app_ads_direct_percentage',
	'google_app_ads_reseller_percentage',
	'google_sdk_percentage',
	'apple_app_ads_direct_installs_d30',
	'apple_app_ads_reseller_installs_d30',
	'apple_sdk_installs_d30',
	'google_api_call_installs_d30',
	'google_app_ads_direct_installs_d30',
	'google_app_ads_reseller_installs_d30',
	'google_sdk_installs_d30',
	'total_app_count',
	'installs_d30',
	'percent_open_source',
	'apple_app_ads_direct_latest_pct_market_share_change',
	'apple_sdk_latest_pct_market_share_change',
	'google_app_ads_direct_latest_pct_market_share_change',
	'google_sdk_latest_pct_market_share_change',
	'apple_app_ads_direct_latest_total_apps_change_pct',
	'apple_sdk_latest_total_apps_change_pct',
	'google_app_ads_direct_latest_total_apps_change_pct',
	'google_sdk_latest_total_apps_change_pct',
	'apple_app_ads_direct_latest_apps_added',
	'apple_sdk_latest_apps_added',
	'google_app_ads_direct_latest_apps_added',
	'google_sdk_latest_apps_added',
	'apple_app_ads_direct_latest_apps_lost',
	'apple_sdk_latest_apps_lost',
	'google_app_ads_direct_latest_apps_lost',
	'google_sdk_latest_apps_lost'
];

const STRING_FIELDS: StringField[] = [
	'company_name',
	'company_domain',
	'parent_company_domain',
	'parent_company_name',
	'api_ip_resolved_country',
	'company_logo_url',
	'parent_company_logo_url',
	'company_category',
	'trends_latest_period'
];

const SURFACE_CONFIGS: SurfaceConfig[] = [
	{
		id: 'google-sdk',
		title: 'Google Play SDK Footprint',
		description: 'Quarter-over-quarter SDK footprint changes across Google Play apps.',
		shareKey: 'google_sdk_percentage',
		installsKey: 'google_sdk_installs_d30',
		shareChangeKey: 'google_sdk_latest_pct_market_share_change',
		appsChangeKey: 'google_sdk_latest_total_apps_change_pct',
		appsAddedKey: 'google_sdk_latest_apps_added',
		appsLostKey: 'google_sdk_latest_apps_lost'
	},
	{
		id: 'apple-sdk',
		title: 'Apple SDK Footprint',
		description: 'Quarter-over-quarter SDK footprint changes across Apple App Store apps.',
		shareKey: 'apple_sdk_percentage',
		installsKey: 'apple_sdk_installs_d30',
		shareChangeKey: 'apple_sdk_latest_pct_market_share_change',
		appsChangeKey: 'apple_sdk_latest_total_apps_change_pct',
		appsAddedKey: 'apple_sdk_latest_apps_added',
		appsLostKey: 'apple_sdk_latest_apps_lost'
	},
	{
		id: 'google-adstxt',
		title: 'Google Play app-ads.txt Direct',
		description: 'Quarter-over-quarter direct app-ads.txt changes across Google Play publishers.',
		shareKey: 'google_app_ads_direct_percentage',
		installsKey: 'google_app_ads_direct_installs_d30',
		shareChangeKey: 'google_app_ads_direct_latest_pct_market_share_change',
		appsChangeKey: 'google_app_ads_direct_latest_total_apps_change_pct',
		appsAddedKey: 'google_app_ads_direct_latest_apps_added',
		appsLostKey: 'google_app_ads_direct_latest_apps_lost'
	},
	{
		id: 'apple-adstxt',
		title: 'Apple app-ads.txt Direct',
		description:
			'Quarter-over-quarter direct app-ads.txt changes across Apple App Store publishers.',
		shareKey: 'apple_app_ads_direct_percentage',
		installsKey: 'apple_app_ads_direct_installs_d30',
		shareChangeKey: 'apple_app_ads_direct_latest_pct_market_share_change',
		appsChangeKey: 'apple_app_ads_direct_latest_total_apps_change_pct',
		appsAddedKey: 'apple_app_ads_direct_latest_apps_added',
		appsLostKey: 'apple_app_ads_direct_latest_apps_lost'
	}
];

const SECTION_CONFIGS: MetricSectionConfig[] = [
	{
		id: 'qoq-share-change',
		title: 'Quarter-over-quarter breakouts',
		basisLabel: 'Based on Q/Q market share change',
		description: 'Largest market share gains and pullbacks for each store and tracking surface.',
		presentation: 'signed',
		metricKey: 'shareChangeKey',
		primaryMetricLabel: 'Q/Q share',
		goodLabel: 'Share gainers to watch',
		badLabel: 'Share decliners to watch',
		positiveMetaLabel: 'gainers',
		negativeMetaLabel: 'decliners',
		primaryFormat: 'signedPercent'
	},
	{
		id: 'qoq-company-app-change',
		title: 'Quarter-over-quarter breakouts',
		basisLabel: 'Based on Q/Q change in company apps',
		description:
			'Fastest app-footprint growth and contraction for each store and tracking surface.',
		presentation: 'signed',
		metricKey: 'appsChangeKey',
		primaryMetricLabel: 'Q/Q app change',
		goodLabel: 'Footprint growers to watch',
		badLabel: 'Footprint decliners to watch',
		positiveMetaLabel: 'growers',
		negativeMetaLabel: 'decliners',
		primaryFormat: 'signedPercent'
	},
	{
		id: 'apps-added',
		title: 'Apps added',
		basisLabel: 'Largest companies adding tracked apps',
		description:
			'Raw app additions with current share context so the biggest expansions stand out quickly.',
		presentation: 'single',
		metricKey: 'appsAddedKey',
		primaryMetricLabel: 'Apps added',
		listLabel: 'Apps added watchlist',
		activeMetaLabel: 'adding apps',
		tone: 'positive',
		primaryFormat: 'count'
	},
	{
		id: 'apps-lost',
		title: 'Apps lost',
		basisLabel: 'Largest companies shedding tracked apps',
		description:
			'Raw app losses with current share context so the biggest pullbacks are easy to isolate.',
		presentation: 'single',
		metricKey: 'appsLostKey',
		primaryMetricLabel: 'Apps lost',
		listLabel: 'Apps lost watchlist',
		activeMetaLabel: 'losing apps',
		tone: 'negative',
		primaryFormat: 'count'
	}
];

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

function getString(
	record: Record<string, string | number | null>,
	key: StringField
): string | null {
	const value = record[key];
	return typeof value === 'string' ? value : null;
}

function getRequiredString(
	record: Record<string, string | number | null>,
	key: StringField
): string {
	return getString(record, key) ?? '';
}

function getNumber(
	record: Record<string, string | number | null>,
	key: NumericField
): number | null {
	const value = record[key];
	return typeof value === 'number' && !Number.isNaN(value) ? value : null;
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

		return {
			company_name: getRequiredString(record, 'company_name'),
			company_domain: getRequiredString(record, 'company_domain'),
			parent_company_domain: getString(record, 'parent_company_domain'),
			parent_company_name: getString(record, 'parent_company_name'),
			apple_app_ads_direct_percentage: getNumber(record, 'apple_app_ads_direct_percentage'),
			apple_app_ads_reseller_percentage: getNumber(record, 'apple_app_ads_reseller_percentage'),
			apple_sdk_percentage: getNumber(record, 'apple_sdk_percentage'),
			google_api_call_percentage: getNumber(record, 'google_api_call_percentage'),
			google_app_ads_direct_percentage: getNumber(record, 'google_app_ads_direct_percentage'),
			google_app_ads_reseller_percentage: getNumber(record, 'google_app_ads_reseller_percentage'),
			google_sdk_percentage: getNumber(record, 'google_sdk_percentage'),
			apple_app_ads_direct_installs_d30: getNumber(record, 'apple_app_ads_direct_installs_d30'),
			apple_app_ads_reseller_installs_d30: getNumber(record, 'apple_app_ads_reseller_installs_d30'),
			apple_sdk_installs_d30: getNumber(record, 'apple_sdk_installs_d30'),
			google_api_call_installs_d30: getNumber(record, 'google_api_call_installs_d30'),
			google_app_ads_direct_installs_d30: getNumber(record, 'google_app_ads_direct_installs_d30'),
			google_app_ads_reseller_installs_d30: getNumber(
				record,
				'google_app_ads_reseller_installs_d30'
			),
			google_sdk_installs_d30: getNumber(record, 'google_sdk_installs_d30'),
			total_app_count: getNumber(record, 'total_app_count'),
			installs_d30: getNumber(record, 'installs_d30'),
			percent_open_source: getNumber(record, 'percent_open_source') ?? 0,
			api_ip_resolved_country: getString(record, 'api_ip_resolved_country'),
			company_logo_url: getString(record, 'company_logo_url'),
			parent_company_logo_url: getString(record, 'parent_company_logo_url'),
			company_category: getString(record, 'company_category'),
			trends_latest_period: getString(record, 'trends_latest_period'),
			apple_app_ads_direct_latest_pct_market_share_change: getNumber(
				record,
				'apple_app_ads_direct_latest_pct_market_share_change'
			),
			apple_sdk_latest_pct_market_share_change: getNumber(
				record,
				'apple_sdk_latest_pct_market_share_change'
			),
			google_app_ads_direct_latest_pct_market_share_change: getNumber(
				record,
				'google_app_ads_direct_latest_pct_market_share_change'
			),
			google_sdk_latest_pct_market_share_change: getNumber(
				record,
				'google_sdk_latest_pct_market_share_change'
			),
			apple_app_ads_direct_latest_total_apps_change_pct: getNumber(
				record,
				'apple_app_ads_direct_latest_total_apps_change_pct'
			),
			apple_sdk_latest_total_apps_change_pct: getNumber(
				record,
				'apple_sdk_latest_total_apps_change_pct'
			),
			google_app_ads_direct_latest_total_apps_change_pct: getNumber(
				record,
				'google_app_ads_direct_latest_total_apps_change_pct'
			),
			google_sdk_latest_total_apps_change_pct: getNumber(
				record,
				'google_sdk_latest_total_apps_change_pct'
			),
			apple_app_ads_direct_latest_apps_added: getNumber(
				record,
				'apple_app_ads_direct_latest_apps_added'
			),
			apple_sdk_latest_apps_added: getNumber(record, 'apple_sdk_latest_apps_added'),
			google_app_ads_direct_latest_apps_added: getNumber(
				record,
				'google_app_ads_direct_latest_apps_added'
			),
			google_sdk_latest_apps_added: getNumber(record, 'google_sdk_latest_apps_added'),
			apple_app_ads_direct_latest_apps_lost: getNumber(
				record,
				'apple_app_ads_direct_latest_apps_lost'
			),
			apple_sdk_latest_apps_lost: getNumber(record, 'apple_sdk_latest_apps_lost'),
			google_app_ads_direct_latest_apps_lost: getNumber(
				record,
				'google_app_ads_direct_latest_apps_lost'
			),
			google_sdk_latest_apps_lost: getNumber(record, 'google_sdk_latest_apps_lost'),
			tag_source: 'report',
			store: 'all',
			app_count: getNumber(record, 'total_app_count') ?? 0,
			percentage: 0
		};
	});
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
		.map(([value, count]) => ({
			value,
			label: getCompanyTypeLabel(value),
			count
		}))
		.sort((a, b) => {
			if (a.value === UNMAPPED_COMPANY_TYPE) return 1;
			if (b.value === UNMAPPED_COMPANY_TYPE) return -1;
			return b.count - a.count || a.label.localeCompare(b.label);
		});

	return [
		{
			value: ALL_MAPPED_COMPANY_TYPE,
			label: getCompanyTypeLabel(ALL_MAPPED_COMPANY_TYPE),
			count: mappedRows.length
		},
		...options
	];
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
	metricKey: Extract<MetricValueKey, 'appsAddedKey' | 'appsLostKey'>
): number {
	const metricValue = getSurfaceMetricValue(row, surface, metricKey) ?? 0;
	const shareValue = (row[surface.shareKey] as number | null) ?? 0;
	return metricValue * shareValue;
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
		qoqAppsChange: (row[surface.appsChangeKey] as number | null) ?? null,
		appsAdded: (row[surface.appsAddedKey] as number | null) ?? null,
		appsLost: (row[surface.appsLostKey] as number | null) ?? null,
		totalAppCount: row.total_app_count,
		apiCountry: row.api_ip_resolved_country,
		percentOpenSource: row.percent_open_source,
		primaryValue
	};
}

function buildSignedSurfacePanel(
	rows: EcosystemCompanyData[],
	surface: SurfaceConfig,
	section: SignedSectionConfig
): MetricSurfacePanel {
	const rowsWithCoverage = rows.filter(
		(row) =>
			hasValue(row[surface.shareKey] as number | null) ||
			hasValue(row[surface.installsKey] as number | null)
	);
	const rowsWithMetric = rows.filter((row) =>
		hasValue(getSurfaceMetricValue(row, surface, section.metricKey))
	);
	const positiveRows = rowsWithMetric.filter(
		(row) => (getSurfaceMetricValue(row, surface, section.metricKey) ?? 0) > 0
	);
	const negativeRows = rowsWithMetric.filter(
		(row) => (getSurfaceMetricValue(row, surface, section.metricKey) ?? 0) < 0
	);
	const topGood = positiveRows
		.sort(
			(a, b) =>
				(getSurfaceMetricValue(b, surface, section.metricKey) ?? Number.NEGATIVE_INFINITY) -
				(getSurfaceMetricValue(a, surface, section.metricKey) ?? Number.NEGATIVE_INFINITY)
		)
		.slice(0, 5)
		.map((row) =>
			toLeaderboardEntry(row, surface, getSurfaceMetricValue(row, surface, section.metricKey))
		);
	const topBad = negativeRows
		.sort(
			(a, b) =>
				(getSurfaceMetricValue(a, surface, section.metricKey) ?? Number.POSITIVE_INFINITY) -
				(getSurfaceMetricValue(b, surface, section.metricKey) ?? Number.POSITIVE_INFINITY)
		)
		.slice(0, 5)
		.map((row) =>
			toLeaderboardEntry(row, surface, getSurfaceMetricValue(row, surface, section.metricKey))
		);

	return {
		id: `${section.id}-${surface.id}`,
		title: surface.title,
		description: surface.description,
		coverageCount: rowsWithCoverage.length,
		meta: `${rowsWithCoverage.length} tracked • ${positiveRows.length} ${section.positiveMetaLabel} • ${negativeRows.length} ${section.negativeMetaLabel}`,
		topGood,
		topBad
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
		.filter((row) => (getSurfaceMetricValue(row, surface, section.metricKey) ?? 0) > 0)
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
			.slice(0, 5)
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
		presentation: section.presentation,
		primaryMetricLabel: section.primaryMetricLabel,
		primaryFormat: section.primaryFormat,
		goodLabel: section.presentation === 'signed' ? section.goodLabel : undefined,
		badLabel: section.presentation === 'signed' ? section.badLabel : undefined,
		listLabel: section.presentation === 'single' ? section.listLabel : undefined,
		tone: section.presentation === 'single' ? section.tone : undefined,
		panels: SURFACE_CONFIGS.map((surface) =>
			section.presentation === 'signed'
				? buildSignedSurfacePanel(rows, surface, section)
				: buildSingleSurfacePanel(rows, surface, section)
		)
	};
}

function buildMetricSections(rows: EcosystemCompanyData[]): MetricSection[] {
	return SECTION_CONFIGS.map((section) => buildMetricSection(rows, section));
}

function buildMetricSectionsByCompanyType(
	rows: EcosystemCompanyData[],
	options: CompanyTypeOption[]
): Record<string, MetricSection[]> {
	const sectionsByCompanyType: Record<string, MetricSection[]> = {
		[ALL_MAPPED_COMPANY_TYPE]: buildMetricSections(
			rows.filter((row) => getCompanyTypeValue(row) !== UNMAPPED_COMPANY_TYPE)
		)
	};

	for (const option of options) {
		if (option.value === ALL_MAPPED_COMPANY_TYPE) {
			continue;
		}

		sectionsByCompanyType[option.value] = buildMetricSections(
			rows.filter((row) => getCompanyTypeValue(row) === option.value)
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
	const reportPeriod = allData[0]?.trends_latest_period ?? '2026-Q1';
	const companyTypeOptions = buildCompanyTypeOptions(allData);
	const metricSections = buildMetricSections(allData);
	const metricSectionsByCompanyType = buildMetricSectionsByCompanyType(allData, companyTypeOptions);
	const trackedSdkCompanies = allData.filter(
		(row) => hasValue(row.google_sdk_percentage) || hasValue(row.apple_sdk_percentage)
	).length;
	const trackedAdCompanies = allData.filter(
		(row) =>
			hasValue(row.google_app_ads_direct_percentage) ||
			hasValue(row.apple_app_ads_direct_percentage)
	).length;
	const openSourceWeightedCompanies = allData.filter(
		(row) => row.percent_open_source >= 0.75
	).length;
	const usHostedApiCompanies = allData.filter((row) => row.api_ip_resolved_country === 'US').length;

	return {
		allData,
		metricSections,
		metricSectionsByCompanyType,
		companyTypeOptions,
		summary: {
			totalCompanies: allData.length,
			trackedSdkCompanies,
			trackedAdCompanies,
			openSourceWeightedCompanies,
			usHostedApiCompanies,
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
