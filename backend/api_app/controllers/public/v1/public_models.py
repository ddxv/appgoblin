"""Data models for public user-facing API contracts."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TypeAlias

AppSdkEvidenceByPath: TypeAlias = dict[str, list[str]]
AppSdkEvidenceByPackage: TypeAlias = dict[str, AppSdkEvidenceByPath]
AppSdkEvidenceByCompany: TypeAlias = dict[str, AppSdkEvidenceByPackage]
AppSdkEvidenceByCategory: TypeAlias = dict[str, AppSdkEvidenceByCompany]
AppSdkUnmappedEvidence: TypeAlias = dict[str, AppSdkEvidenceByPath]


@dataclass
class PublicCompanyListItem:
    """Minimal company entry returned by the public companies index."""

    name: str | None = None
    company_domain: str | None = None
    parent_company_domain: str | None = None
    parent_company_name: str | None = None
    api_ip_resolved_country: str | None = None
    total_app_count: int | None = None
    installs_d30: int | None = None
    google_sdk_app_count: int | None = None
    apple_sdk_app_count: int | None = None
    google_api_call_app_count: int | None = None
    apple_api_call_app_count: int | None = None
    google_app_ads_direct_app_count: int | None = None
    apple_app_ads_direct_app_count: int | None = None
    google_app_ads_reseller_app_count: int | None = None
    apple_app_ads_reseller_app_count: int | None = None
    trends_latest_period: str | None = None
    google_sdk_latest_pct_market_share: float | None = None
    apple_sdk_latest_pct_market_share: float | None = None
    google_app_ads_direct_latest_pct_market_share: float | None = None
    apple_app_ads_direct_latest_pct_market_share: float | None = None
    google_sdk_latest_pct_market_share_change: float | None = None
    apple_sdk_latest_pct_market_share_change: float | None = None
    google_app_ads_direct_latest_pct_market_share_change: float | None = None
    apple_app_ads_direct_latest_pct_market_share_change: float | None = None
    google_sdk_latest_total_apps: int | None = None
    apple_sdk_latest_total_apps: int | None = None
    google_app_ads_direct_latest_total_apps: int | None = None
    apple_app_ads_direct_latest_total_apps: int | None = None
    google_sdk_latest_apps_added: int | None = None
    apple_sdk_latest_apps_added: int | None = None
    google_app_ads_direct_latest_apps_added: int | None = None
    apple_app_ads_direct_latest_apps_added: int | None = None
    google_sdk_latest_apps_lost: int | None = None
    apple_sdk_latest_apps_lost: int | None = None
    google_app_ads_direct_latest_apps_lost: int | None = None
    apple_app_ads_direct_latest_apps_lost: int | None = None


@dataclass
class PublicCategoryCompanyStats:
    """Public company metrics grouped by platform and signal source."""

    total_apps: int = 0
    adstxt_direct_android_total_apps: int = 0
    adstxt_direct_ios_total_apps: int = 0
    adstxt_reseller_android_total_apps: int = 0
    adstxt_reseller_ios_total_apps: int = 0
    sdk_android_total_apps: int = 0
    sdk_ios_total_apps: int = 0
    sdk_total_apps: int = 0
    api_android_total_apps: int = 0
    api_total_apps: int = 0
    sdk_android_installs_d30: int = 0
    sdk_ios_installs_d30: int = 0
    adstxt_direct_android_installs_d30: int = 0
    adstxt_reseller_android_installs_d30: int = 0


@dataclass
class PublicCompanyTrends:
    """Public quarterly trend summary flattened by platform and signal source."""

    latest_period: str | None = None
    android_app_ads_direct_market_share_change_pct: float | None = None
    android_app_ads_direct_apps_lost: int | None = None
    android_sdk_api_market_share_change_pct: float | None = None
    android_sdk_api_apps_lost: int | None = None
    ios_app_ads_direct_market_share_change_pct: float | None = None
    ios_app_ads_direct_apps_lost: int | None = None
    ios_sdk_api_market_share_change_pct: float | None = None
    ios_sdk_api_apps_lost: int | None = None


@dataclass
class CompanyDatasetTarget:
    """Download metadata for a single public company dataset."""

    available: bool
    estimated_rows: int
    url: str | None


@dataclass
class CompanyDatasets:
    """Public company dataset links grouped by platform."""

    sdk_api_android: CompanyDatasetTarget
    sdk_api_ios: CompanyDatasetTarget


@dataclass
class PublicCompanyOverview:
    """Public company detail payload returned by the v1 API."""

    domain_is_mapped: bool = False
    company_types: list[str] = field(default_factory=list)
    metrics: PublicCategoryCompanyStats = field(
        default_factory=PublicCategoryCompanyStats
    )
    trends: PublicCompanyTrends | None = None
    mapping_notice: str | None = None
    datasets: CompanyDatasets | None = None


@dataclass
class PublicCompanyAppChangeStoreIds:
    """Public paid response for a company app-change slice."""

    domain_name: str
    tag_source: str
    year: int
    quarter: int
    status: str
    store_ids: list[str] = field(default_factory=list)


@dataclass
class PublicAppBasics:
    """Stable public app metadata plus power-user adoption and revenue estimates."""

    name: str | None = None
    store_id: str | None = None
    store: str | None = None
    category: str | None = None
    rating: float | None = None
    rating_count: int | None = None
    installs: int | None = None
    weekly_active_users: int | None = None
    monthly_active_users: int | None = None
    monthly_ad_revenue: float | None = None
    monthly_iap_revenue: float | None = None
    installs_weekly: int | float | None = None
    installs_monthly: int | float | None = None
    rating_count_weekly: int | None = None
    store_last_updated: str | None = None
    developer_id: str | None = None
    developer_name: str | None = None
    developer_url: str | None = None
    release_date: str | None = None
    ad_supported: bool | None = None
    in_app_purchases: bool | None = None
    store_link: str | None = None


@dataclass
class PublicAppBestRank:
    """Best rank achieved for a country/collection/category tuple."""

    country: str
    collection: str
    category: str
    best_rank: int


@dataclass
class PublicAppSdkDetails:
    """Detailed SDK and manifest findings for a single app.

    The nested keys below identifiers such as category slug, company domain, and
    SDK package prefix are dynamic. Evidence keys like ``smali`` or
    ``application/provider`` represent the file path or manifest/XML path where
    AppGoblin found the matched value, so they intentionally remain open-ended.
    """

    company_categories: AppSdkEvidenceByCategory = field(default_factory=dict)
    permissions: list[str] = field(default_factory=list)
    app_queries: list[str] = field(default_factory=list)
    skadnetwork: list[str] = field(default_factory=list)
    unmapped_sdks: AppSdkUnmappedEvidence = field(default_factory=dict)
