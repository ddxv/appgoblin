<script lang="ts" generics="TData, TValue">
	import {
		type PaginationState,
		type SortingState,
		type ColumnFiltersState,
		getCoreRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		getFilteredRowModel
	} from '@tanstack/table-core';

	import Pagination from '$lib/components/data-table/Pagination.svelte';
	import ExportAsCSV from '$lib/components/data-table/ExportAsCSV.svelte';
	import type { CompaniesOverviewEntries } from '../types';

	import { createSvelteTable, FlexRender } from '$lib/components/data-table/index.js';

	import { genericColumns } from '$lib/components/data-table/generic-column';
	import Shield from 'lucide-svelte/icons/shield';
	import CircleHalf from 'lucide-svelte/icons/shield-half';
	import Eye from 'lucide-svelte/icons/eye';

	import { formatNumber } from '$lib/utils/formatNumber';
	import { countryCodeToEmoji } from '$lib/utils/countryCodeToEmoji';

	type MetricValue = 'installs' | 'market_share' | 'qoq_share' | 'apps_lost' | 'app_count';

	type MetricOption = {
		value: MetricValue;
		label: string;
	};

	type ViewMode = 'auto' | 'sdk' | 'ads' | 'both' | 'api';

	type DataTableProps<CompaniesOverviewEntries, TValue> = {
		data: CompaniesOverviewEntries[];
		viewMode?: ViewMode;
		showLimitNote?: boolean;
	};

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 50 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);

	let globalFilter = $state<string>('');
	let dataMetric = $state<MetricValue>('app_count');

	let {
		data,
		viewMode = 'auto',
		showLimitNote = false
	}: DataTableProps<CompaniesOverviewEntries, TValue> = $props();

	import { page } from '$app/state';

	// ===== View mode resolution =====
	let resolvedViewMode = $derived.by<ViewMode>(() => {
		if (viewMode !== 'auto') {
			return viewMode;
		}
		if (!page.params.type) {
			return 'both';
		}
		if (page.params.type == 'ad-networks') return 'ads';
		if (page.params.type == 'app-publishers') return 'api';
		return 'sdk';
	});
	let showsSdkColumns = $derived(resolvedViewMode !== 'ads' && resolvedViewMode !== 'api');
	let showsApiColumns = $derived(resolvedViewMode === 'api');
	let showsAdsColumns = $derived(resolvedViewMode !== 'sdk');
	let isAdsPage = $derived(resolvedViewMode === 'ads');

	// ===== Dynamic column definitions =====
	let columns = $derived.by<ReturnType<typeof genericColumns>>(() => {
		// In app-publishers mode: show per-store app counts + per-store installs
		if (showsApiColumns) {
			return genericColumns([
				{ title: 'Tracking', accessorKey: 'percent_open_source', isSortable: true },
				{ title: 'Servers', accessorKey: 'api_ip_resolved_country', isSortable: true },
				{ title: 'Company', accessorKey: 'company_name', isSortable: true },
				{ title: 'Parent Company', accessorKey: 'parent_company_name', isSortable: true },
				{ title: 'Total Apps', accessorKey: 'total_app_count', isSortable: true },
				{ title: 'Android Apps', accessorKey: 'google_app_count', isSortable: true },
				{ title: 'iOS Apps', accessorKey: 'apple_app_count', isSortable: true },
				{ title: 'Total Installs (30d)', accessorKey: 'installs_d30', isSortable: true },
				{ title: 'Android Installs', accessorKey: 'google_installs_d30', isSortable: true },
				{ title: 'iOS Installs', accessorKey: 'apple_installs_d30', isSortable: true }
			]);
		}

		const sdkMetricColDefs = [
			{ title: 'SDK Android', accessorKey: 'google_sdk_app_count', isSortable: true },
			{ title: 'SDK iOS', accessorKey: 'apple_sdk_app_count', isSortable: true },
			{ title: 'SDK Android', accessorKey: 'google_sdk_installs_d30', isSortable: true },
			{ title: 'SDK iOS', accessorKey: 'apple_sdk_installs_d30', isSortable: true },
			{ title: 'SDK Android', accessorKey: 'google_sdk_percentage', isSortable: true },
			{ title: 'SDK iOS', accessorKey: 'apple_sdk_percentage', isSortable: true },
			{
				title: 'SDK Android',
				accessorKey: 'google_sdk_latest_pct_market_share_change',
				isSortable: true
			},
			{
				title: 'SDK iOS',
				accessorKey: 'apple_sdk_latest_pct_market_share_change',
				isSortable: true
			},
			{ title: 'SDK Android', accessorKey: 'google_sdk_latest_apps_lost', isSortable: true },
			{ title: 'SDK iOS', accessorKey: 'apple_sdk_latest_apps_lost', isSortable: true }
		];
		const apiColDefs = [
			{ title: 'API Android', accessorKey: 'google_api_call_app_count', isSortable: true },
			{ title: 'API iOS', accessorKey: 'apple_api_call_app_count', isSortable: true }
		];

		const rawCols = [
			{ title: 'Tracking', accessorKey: 'percent_open_source', isSortable: true },
			{ title: 'Servers', accessorKey: 'api_ip_resolved_country', isSortable: true },
			{ title: 'Company', accessorKey: 'company_name', isSortable: true },
			{ title: 'Parent Company', accessorKey: 'parent_company_name', isSortable: true },
			{ title: 'Total Apps', accessorKey: 'total_app_count', isSortable: true },
			// App counts
			...sdkMetricColDefs.filter((c) => c.accessorKey.endsWith('_app_count')),
			...apiColDefs,
			// Ad counts
			{ title: 'Direct Android', accessorKey: 'google_app_ads_direct_app_count', isSortable: true },
			{ title: 'Direct iOS', accessorKey: 'apple_app_ads_direct_app_count', isSortable: true },
			{
				title: 'Reseller Android',
				accessorKey: 'google_app_ads_reseller_app_count',
				isSortable: true
			},
			{ title: 'Reseller iOS', accessorKey: 'apple_app_ads_reseller_app_count', isSortable: true },
			// Metric columns — installs + market share
			...sdkMetricColDefs.filter(
				(c) => c.accessorKey.includes('installs_d30') || c.accessorKey.includes('percentage')
			),
			{
				title: 'Direct Android',
				accessorKey: 'google_app_ads_direct_installs_d30',
				isSortable: true
			},
			{ title: 'Direct iOS', accessorKey: 'apple_app_ads_direct_installs_d30', isSortable: true },
			{
				title: 'Direct Android',
				accessorKey: 'google_app_ads_direct_percentage',
				isSortable: true
			},
			{ title: 'Direct iOS', accessorKey: 'apple_app_ads_direct_percentage', isSortable: true },
			// Trend columns
			...sdkMetricColDefs.filter(
				(c) =>
					c.accessorKey.includes('latest_pct_market_share_change') ||
					c.accessorKey.includes('latest_apps_lost')
			),
			{
				title: 'Direct Android',
				accessorKey: 'google_app_ads_direct_latest_pct_market_share_change',
				isSortable: true
			},
			{
				title: 'Direct iOS',
				accessorKey: 'apple_app_ads_direct_latest_pct_market_share_change',
				isSortable: true
			},
			{
				title: 'Direct Android',
				accessorKey: 'google_app_ads_direct_latest_apps_lost',
				isSortable: true
			},
			{
				title: 'Direct iOS',
				accessorKey: 'apple_app_ads_direct_latest_apps_lost',
				isSortable: true
			}
		];
		return genericColumns(rawCols);
	});

	const globalFilterFn = (row: any, columnId: string, filterValue: string) => {
		const name = row.original.company_name?.toLowerCase() ?? '';
		const domain = row.original.company_domain?.toLowerCase() ?? '';
		const parentName = row.original.parent_company_name?.toLowerCase() ?? '';
		const parentDomain = row.original.parent_company_domain?.toLowerCase() ?? '';
		const query = filterValue.toLowerCase();
		return (
			name.includes(query) ||
			domain.includes(query) ||
			parentName.includes(query) ||
			parentDomain.includes(query)
		);
	};

	const table = createSvelteTable({
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get globalFilter() {
				return globalFilter;
			}
		},

		getSortedRowModel: getSortedRowModel(),

		globalFilterFn,

		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},

		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onGlobalFilterChange: (updater) => {
			globalFilter = typeof updater === 'function' ? updater(globalFilter) : updater;
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	function formatPercentage(num: number) {
		if (num && num > 0) {
			num = num * 100;
			if (num < 10) {
				return num.toFixed(2) + '%';
			} else {
				return num.toFixed(0) + '%';
			}
		}
		return '';
	}

	function formatTrimmed(num: number, digits: number) {
		return num.toFixed(digits).replace(/\.0+$|(?<=\.[0-9]*[1-9])0+$/, '');
	}

	function getShareDigits(num: number) {
		const absolute = Math.abs(num);
		if (absolute >= 10) return 2;
		if (absolute >= 1) return 3;
		if (absolute >= 0.1) return 4;
		if (absolute >= 0.01) return 5;
		return 6;
	}

	const MAX_QOQ_SHARE_CHANGE_PCT = 500;

	function formatQoqShareChangePct(num: number | null | undefined) {
		if (typeof num !== 'number' || Number.isNaN(num)) {
			return '';
		}
		const capped = Math.min(num, MAX_QOQ_SHARE_CHANGE_PCT);
		const absolute = Math.abs(capped);
		const digits = absolute >= 100 ? 0 : absolute >= 10 ? 1 : 2;
		const prefix = capped > 0 ? '+' : '';
		const suffix = capped >= MAX_QOQ_SHARE_CHANGE_PCT ? '%+' : '%';
		return `${prefix}${formatTrimmed(capped, digits)}${suffix}`;
	}

	function formatOptionalNumber(num: number | null | undefined) {
		if (typeof num !== 'number' || Number.isNaN(num)) {
			return '';
		}
		return formatNumber(num);
	}
	let hasCategorySelected = $derived(Boolean(page.params.category));
	const QOQ_METRICS: MetricValue[] = ['qoq_share', 'apps_lost'];
	const BASE_METRIC_OPTIONS: MetricOption[] = [
		{ value: 'installs', label: 'Installs (Last 30 Days)' },
		{ value: 'market_share', label: 'Market Share' },
		{ value: 'app_count', label: 'Company App Counts' }
	];
	const QOQ_METRIC_OPTIONS: MetricOption[] = [
		{ value: 'qoq_share', label: 'Q/Q Market Share Change %' },
		{ value: 'apps_lost', label: 'Q/Q Apps Lost' }
	];
	let metricOptions = $derived(
		hasCategorySelected
			? BASE_METRIC_OPTIONS
			: [
					BASE_METRIC_OPTIONS[0],
					BASE_METRIC_OPTIONS[1],
					...QOQ_METRIC_OPTIONS,
					BASE_METRIC_OPTIONS[2]
				]
	);

	$effect(() => {
		if (hasCategorySelected && QOQ_METRICS.includes(dataMetric)) {
			dataMetric = 'installs';
		}
	});

	function shouldShowHeader(header: any) {
		if (header.column.id === 'percent_open_source') return true;
		if (header.column.id === 'api_ip_resolved_country') return true;
		if (header.column.id === 'company_name') return true;
		if (header.column.id === 'parent_company_name') return true;
		if (header.column.id === 'total_app_count') return dataMetric === 'app_count';

		let headerHasInstall = header.column.id.includes('install');
		let headerHasAppCount =
			header.column.id.endsWith('_app_count') && header.column.id !== 'total_app_count';
		let headerHasPercent = header.column.id.includes('percentage');
		let headerHasShareChange = header.column.id.includes('latest_pct_market_share_change');
		let headerHasAppsLost = header.column.id.includes('latest_apps_lost');
		let headerIsAds = header.column.id.includes('direct') || header.column.id.includes('reseller');
		if (showsApiColumns) {
			// Basic columns always visible
			let alwaysCols = [
				'percent_open_source',
				'api_ip_resolved_country',
				'company_name',
				'parent_company_name'
			];
			if (alwaysCols.includes(header.column.id)) return true;
			// App count columns when metric is app_count
			if (dataMetric === 'app_count') {
				let appCountCols = ['total_app_count', 'google_app_count', 'apple_app_count'];
				return appCountCols.includes(header.column.id);
			}
			// Install columns when metric is installs
			if (dataMetric === 'installs') {
				let installCols = ['installs_d30', 'google_installs_d30', 'apple_installs_d30'];
				return installCols.includes(header.column.id);
			}
			return false;
		}

		let headerIsApi = header.column.id.includes('api_call');
		let headerIsSdk = header.column.id.includes('_sdk_');

		if (dataMetric === 'app_count' && headerHasAppCount) {
			return true;
		}

		if (dataMetric === 'installs' && headerHasInstall) {
			return true;
		} else if (dataMetric === 'market_share' && headerHasPercent) {
			return true;
		} else if (dataMetric === 'qoq_share' && headerHasShareChange) {
			return true;
		} else if (dataMetric === 'apps_lost' && headerHasAppsLost) {
			return true;
		}
		return false;
	}

	function getCompanyNameColumnWidth(header: any) {
		if (header.column.id === 'company_name') {
			if (resolvedViewMode === 'both') {
				return 'w-[24%]';
			}
			if (isAdsPage || showsApiColumns) {
				return 'w-[30%]';
			} else {
				return 'w-[36%]';
			}
		}
		if (header.column.id === 'parent_company_name') {
			return 'w-[18%]';
		}
		return '';
	}

	function hasDistinctParentCompany(company: any) {
		return Boolean(
			company.parent_company_domain && company.parent_company_domain !== company.company_domain
		);
	}
</script>

{#if showLimitNote}
	<p class="text-xs mb-1">
		Table shows the top 1,000 company domains. Use the site wide search for specific domains or
		companies that may not make the top 1000.
	</p>
{/if}
<div class="table-container p-0 md:p-2">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-8 m-2">
		<div class="preset-outlined-surface-100-900 flex items-center flex-col p-0 md:p-2">
			<input
				placeholder="Filter top companies..."
				value={globalFilter}
				oninput={(e) => {
					const value = e.currentTarget.value;
					table.setGlobalFilter(value);
				}}
				class="max-w-sm p-1"
			/>
		</div>
		<div class="flex flex-col justify-center gap-1 p-2 md:items-start">
			<label for="metric-select" class="px-1 text-sm md:text-base">Metric</label>
			<select
				id="metric-select"
				class="select select-sm preset-outlined-primary-100-900 w-full max-w-sm p-1"
				bind:value={dataMetric}
			>
				{#if showsApiColumns}
					<option value="app_count">App Count</option>
					<option value="installs">Installs (Last 30 Days)</option>
				{:else}
					{#each metricOptions as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				{/if}
			</select>
			{#if hasCategorySelected}
				<p class="px-1 text-xs text-surface-500-400">
					Q/Q metrics are only available on the all-companies overview.
				</p>
			{/if}
		</div>
	</div>
	<div class="overflow-x-auto pl-0">
		<table class="table table-hover table-compact table-auto w-full">
			<thead class="text-sm md:text-base">
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							{#if shouldShowHeader(header)}
								<th class={getCompanyNameColumnWidth(header)}>
									{#if !header.isPlaceholder}
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									{/if}
								</th>
							{/if}
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each table.getRowModel().rows as row (row.id)}
					<tr class="px-0">
						<td class="text-center">
							{#if row.original.percent_open_source > 0.75}
								<div
									class="flex items-center justify-center gap-1 text-success-900-100"
									title="Mostly open source - minimal tracking"
								>
									<Shield class="w-4 h-4" />
									<span class="text-xs">Open Source</span>
								</div>
							{:else if row.original.percent_open_source > 0.3}
								<div
									class="flex items-center justify-center gap-1 text-warning-900-100"
									title="Mixed open/closed source"
								>
									<CircleHalf class="w-4 h-4" />
									<span class="text-xs">Mixed</span>
								</div>
							{:else if row.original.percent_open_source == 0}
								<div
									class="flex items-center justify-center gap-1 text-error-900-100"
									title="Closed source - likely tracking"
								>
									<Eye class="w-4 h-4" />
									<span class="text-xs">Tracking</span>
								</div>
							{:else}
								<div
									class="flex items-center justify-center gap-1 text-gray-500"
									title="Unknown tracking status"
								>
									<span class="text-xs">Unknown</span>
								</div>
							{/if}
						</td>
						<td class="text-center">
							{#if row.original.api_ip_resolved_country}
								<span
									class="text-xs md:text-sm"
									title={`API IP addresses for this domain commonly resolve to: ${row.original.api_ip_resolved_country}`}
								>
									{countryCodeToEmoji(row.original.api_ip_resolved_country)}
								</span>
							{/if}
						</td>
						<td class="w-0">
							<a
								href="/companies/{row.original.company_domain}"
								style="cursor: pointer;"
								class=" text-xs md:text-sm"
							>
								<div class="flex items-center">
									{#if row.original.company_logo_url}
										<img
											src={`https://media.appgoblin.info/${row.original.company_logo_url}`}
											alt={row.original.company_name}
											class="w-8 h-8 rounded-sm mr-2"
											loading="lazy"
										/>
									{:else}
										<img
											src="/default_company_logo.png"
											alt="Default Company Logo"
											class="w-8 h-8 rounded-sm mr-2"
											loading="lazy"
										/>
									{/if}
									{#if row.original.company_name}
										{row.original.company_name}
										({row.original.company_domain})
									{:else}
										{row.original.company_domain}
									{/if}
								</div>
							</a>
						</td>
						<td class="w-0">
							{#if hasDistinctParentCompany(row.original)}
								<a
									href="/companies/{row.original.parent_company_domain}"
									style="cursor: pointer;"
									class="text-xs md:text-sm"
								>
									<div class="flex items-center">
										{#if row.original.parent_company_logo_url}
											<img
												src={`https://media.appgoblin.info/${row.original.parent_company_logo_url}`}
												alt={row.original.parent_company_name ?? row.original.parent_company_domain}
												class="w-8 h-8 rounded-sm mr-2"
												loading="lazy"
											/>
										{:else}
											<img
												src="/default_company_logo.png"
												alt="Default Company Logo"
												class="w-8 h-8 rounded-sm mr-2"
												loading="lazy"
											/>
										{/if}
										{#if row.original.parent_company_name}
											{row.original.parent_company_name}
											({row.original.parent_company_domain})
										{:else}
											{row.original.parent_company_domain}
										{/if}
									</div>
								</a>
							{:else}
								<span class="text-xs text-surface-500-400">-</span>
							{/if}
						</td>
						{#if showsApiColumns && dataMetric == 'app_count'}
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{formatOptionalNumber(row.original.total_app_count)}
								</p>
							</td>
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{formatOptionalNumber(row.original.google_app_count)}
								</p>
							</td>
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{formatOptionalNumber(row.original.apple_app_count)}
								</p>
							</td>
						{/if}
						{#if showsApiColumns && dataMetric == 'installs'}
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">{formatNumber(row.original.installs_d30 ?? 0)}</p>
							</td>
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{formatNumber(row.original.google_installs_d30 ?? 0)}
								</p>
							</td>
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{formatNumber(row.original.apple_installs_d30 ?? 0)}
								</p>
							</td>
						{/if}

						{#if !showsApiColumns && dataMetric == 'app_count'}
							<td class="table-cell-fit">
								<p class="text-xs md:text-sm">
									{formatOptionalNumber(row.original.total_app_count)}
								</p>
							</td>
							{#if showsSdkColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.google_sdk_app_count)}
									</p>
								</td>
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.apple_sdk_app_count)}
									</p>
								</td>
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.google_api_call_app_count)}
									</p>
								</td>
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.apple_api_call_app_count)}
									</p>
								</td>
							{/if}
							{#if showsAdsColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.google_app_ads_direct_app_count)}
									</p>
								</td>
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.apple_app_ads_direct_app_count)}
									</p>
								</td>
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.google_app_ads_reseller_app_count)}
									</p>
								</td>
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.apple_app_ads_reseller_app_count)}
									</p>
								</td>
							{/if}
						{/if}

						{#if !showsApiColumns && dataMetric == 'installs'}
							{#if showsSdkColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatNumber(row.original.google_sdk_installs_d30)}
									</p>
								</td>
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatNumber(row.original.apple_sdk_installs_d30)}
									</p>
								</td>
							{/if}
							{#if showsAdsColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatNumber(row.original.google_app_ads_direct_installs_d30)}
									</p>
								</td>

								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatNumber(row.original.apple_app_ads_direct_installs_d30)}
									</p>
								</td>
							{/if}
						{/if}

						{#if !showsApiColumns && dataMetric == 'market_share'}
							{#if showsSdkColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatPercentage(row.original.google_sdk_percentage)}
									</p>
								</td>

								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatPercentage(row.original.apple_sdk_percentage)}
									</p>
								</td>
							{/if}

							{#if showsAdsColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatPercentage(row.original.google_app_ads_direct_percentage)}
									</p>
								</td>

								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatPercentage(row.original.apple_app_ads_direct_percentage)}
									</p>
								</td>
							{/if}
						{/if}

						{#if !showsApiColumns && dataMetric == 'qoq_share'}
							{#if showsSdkColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatQoqShareChangePct(
											row.original.google_sdk_latest_pct_market_share_change
										)}
									</p>
								</td>

								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatQoqShareChangePct(row.original.apple_sdk_latest_pct_market_share_change)}
									</p>
								</td>
							{/if}

							{#if showsAdsColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatQoqShareChangePct(
											row.original.google_app_ads_direct_latest_pct_market_share_change
										)}
									</p>
								</td>

								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatQoqShareChangePct(
											row.original.apple_app_ads_direct_latest_pct_market_share_change
										)}
									</p>
								</td>
							{/if}
						{/if}

						{#if !showsApiColumns && dataMetric == 'apps_lost'}
							{#if showsSdkColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.google_sdk_latest_apps_lost)}
									</p>
								</td>

								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.apple_sdk_latest_apps_lost)}
									</p>
								</td>
							{/if}

							{#if showsAdsColumns}
								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.google_app_ads_direct_latest_apps_lost)}
									</p>
								</td>

								<td class="table-cell-fit">
									<p class="text-xs md:text-sm">
										{formatOptionalNumber(row.original.apple_app_ads_direct_latest_apps_lost)}
									</p>
								</td>
							{/if}
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
		<footer class="flex justify-between">
			<div class="flex items-center justify-end space-x-2 py-4">
				<Pagination tableModel={table} />
				<ExportAsCSV {table} filename="appgoblin_companies" />
			</div>
		</footer>
	</div>
</div>
