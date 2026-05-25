"""Tests for company quarterly trend aggregation."""

from pathlib import Path
from unittest.mock import MagicMock, patch

import pandas as pd
import pytest
from litestar import Litestar
from litestar.testing import TestClient

from api_app.controllers.companies import (
    CompaniesController,
    build_company_overview_base,
    build_company_trends_payload,
    get_company_directory,
    prep_companies_overview_df,
)
from api_app.models import (
    CompanyDirectoryEntry,
    CompaniesCategoryOverview,
    CompaniesOverview,
    PlatformCompanies,
    TopCompaniesShort,
)
from dbcon.queries import get_companies_stats
from dbcon.static import build_company_trends_static_data


def test_company_trend_queries_filter_to_2025_q2_and_later_history():
    """Runtime and static trend queries should include 2025 Q2 and later."""
    sql_dir = Path(__file__).resolve().parents[1] / "dbcon" / "sql"
    expected_filter = "year > 2025 OR (year = 2025 AND quarter >= 2)"

    runtime_query = (sql_dir / "query_combined_companies_history.sql").read_text(
        encoding="utf-8"
    )
    static_query = (sql_dir / "query_combined_companies_history_static.sql").read_text(
        encoding="utf-8"
    )

    assert expected_filter in runtime_query
    assert expected_filter in static_query


def _make_company_stats_df() -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "company_domain": "google.com",
                "company_name": "Google",
                "store": "Google Play",
                "tag_source": "sdk",
                "app_category": "all",
                "app_count": 123,
                "installs_total": 1000,
                "installs_d30": 100,
            }
        ]
    )


def test_get_companies_stats_caches_by_params_across_state_instances():
    state_one = MagicMock()
    state_two = MagicMock()
    cached_df = pd.DataFrame(
        [
            {
                "company_domain": "google.com",
                "company_name": "Google",
                "parent_company_domain": "alphabet.com",
                "parent_company_name": "Alphabet",
                "store": 1,
                "app_category": "cache-share-test",
                "tag_source": "sdk",
                "app_count": 12,
                "installs_d30": 5,
            }
        ]
    )

    with patch("dbcon.queries.pd.read_sql", return_value=cached_df) as mock_read_sql:
        first = get_companies_stats(state_one, app_category="cache-share-test")
        second = get_companies_stats(state_two, app_category="cache-share-test")

    assert mock_read_sql.call_count == 1
    assert list(first["store"]) == ["Google Play"]
    assert list(second["store"]) == ["Google Play"]


def _make_history_df() -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "company_domain": "google.com",
                "company_id": 1,
                "parent_id": 1,
                "year": 2024,
                "quarter": 4,
                "store": 1,
                "tag_source": "sdk_api",
                "total_apps": 150,
                "total_apps_in_quarter": 1000,
                "apps_lost": 5,
                "apps_added": 35,
                "pct_market_share": 15.0,
                "pct_apps_added": None,
                "pct_apps_lost": None,
            },
            {
                "company_domain": "google.com",
                "company_id": 1,
                "parent_id": 1,
                "year": 2024,
                "quarter": 4,
                "store": 2,
                "tag_source": "sdk_api",
                "total_apps": 10,
                "total_apps_in_quarter": 500,
                "apps_lost": 0,
                "apps_added": 5,
                "pct_market_share": 2.0,
                "pct_apps_added": None,
                "pct_apps_lost": None,
            },
            {
                "company_domain": "google.com",
                "company_id": 1,
                "parent_id": 1,
                "year": 2025,
                "quarter": 1,
                "store": 1,
                "tag_source": "sdk_api",
                "total_apps": 180,
                "total_apps_in_quarter": 1000,
                "apps_lost": 10,
                "apps_added": 40,
                "pct_market_share": 18.0,
                "pct_apps_added": None,
                "pct_apps_lost": None,
            },
            {
                "company_domain": "google.com",
                "company_id": 1,
                "parent_id": 1,
                "year": 2025,
                "quarter": 1,
                "store": 2,
                "tag_source": "sdk_api",
                "total_apps": 20,
                "total_apps_in_quarter": 500,
                "apps_lost": 0,
                "apps_added": 10,
                "pct_market_share": 4.0,
                "pct_apps_added": None,
                "pct_apps_lost": None,
            },
            {
                "company_domain": "google.com",
                "company_id": 1,
                "parent_id": 1,
                "year": 2024,
                "quarter": 4,
                "store": 1,
                "tag_source": "app_ads_direct",
                "total_apps": 20,
                "total_apps_in_quarter": 1000,
                "apps_lost": 0,
                "apps_added": 20,
                "pct_market_share": 2.0,
                "pct_apps_added": None,
                "pct_apps_lost": None,
            },
            {
                "company_domain": "google.com",
                "company_id": 1,
                "parent_id": 1,
                "year": 2025,
                "quarter": 1,
                "store": 1,
                "tag_source": "app_ads_direct",
                "total_apps": 35,
                "total_apps_in_quarter": 1000,
                "apps_lost": 5,
                "apps_added": 20,
                "pct_market_share": 3.5,
                "pct_apps_added": None,
                "pct_apps_lost": None,
            },
        ]
    )


def _make_company_categories_df() -> pd.DataFrame:
    return pd.DataFrame(
        [{"company_domain": "google.com", "company_type_slug": "ad-network"}]
    )


def _make_parent_company_stats_df(total_apps: int) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "company_domain": "google.com",
                "company_name": "Google",
                "store": "Google Play",
                "tag_source": "sdk",
                "app_category": "all",
                "app_count": total_apps,
                "installs_total": 1000,
                "installs_d30": 100,
            },
            {
                "company_domain": "google.com",
                "company_name": "Google",
                "store": "Google Play",
                "tag_source": "app_ads_direct",
                "app_category": "all",
                "app_count": max(total_apps // 2, 1),
                "installs_total": 1000,
                "installs_d30": 100,
            },
        ]
    )


def _make_ad_domain_overview_df(app_count: int) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "store": "google",
                "relationship": "direct",
                "publisher_id_count": app_count,
                "developer_count": app_count,
                "app_count": app_count,
            }
        ]
    )


def _make_publishers_overview_df(app_count: int) -> pd.DataFrame:
    return pd.DataFrame(
        [
            {
                "store": "google",
                "relationship": "direct",
                "publisher_id": "pub-1",
                "app_count": app_count,
            }
        ]
    )


def test_build_company_overview_base_adds_aggregated_trends():
    """Company detail payload should expose aggregated quarterly trend summaries."""
    state = MagicMock()
    company_stats_df = _make_company_stats_df()
    history_df = _make_history_df()
    company_trends_summaries, _ = build_company_trends_static_data(history_df)
    company_categories_df = _make_company_categories_df()
    mediation_companies_df = pd.DataFrame(columns=["company_domain"])

    with (
        patch(
            "api_app.controllers.companies.get_company_stats",
            return_value=company_stats_df,
        ),
        patch(
            "api_app.controllers.companies.get_company_trends_summary",
            return_value=company_trends_summaries["google.com"],
        ),
        patch(
            "api_app.controllers.companies.get_company_categories",
            return_value=company_categories_df,
        ),
        patch(
            "api_app.controllers.companies.get_mediation_companies",
            return_value=mediation_companies_df,
        ),
    ):
        overview = build_company_overview_base(state=state, company_domain="google.com")

    assert overview.company_types == ["ad-network"]
    assert overview.trends_summary is not None
    assert overview.trends_summary.latest_period == "2025-Q1"
    assert overview.trends_summary.sources["android_sdk_api"].platform == "android"
    assert overview.trends_summary.sources["android_sdk_api"].tag_source == "sdk_api"
    assert overview.trends_summary.sources["android_sdk_api"].latest_total_apps == 180
    assert overview.trends_summary.sources["android_sdk_api"].previous_total_apps == 150
    assert overview.trends_summary.sources["android_sdk_api"].latest_apps_added == 40
    assert overview.trends_summary.sources["android_sdk_api"].latest_apps_lost == 10
    assert (
        overview.trends_summary.sources["android_sdk_api"].qoq_total_apps_change == 30
    )
    assert (
        overview.trends_summary.sources["android_sdk_api"].trailing_year_apps_added
        == 75
    )
    assert (
        overview.trends_summary.sources["android_sdk_api"].trailing_year_apps_lost == 15
    )
    assert overview.trends_summary.sources[
        "android_sdk_api"
    ].latest_pct_market_share == pytest.approx(18.0, abs=0.0001)
    assert overview.trends_summary.sources["ios_sdk_api"].latest_total_apps == 20
    assert overview.trends_summary.sources["ios_sdk_api"].previous_total_apps == 10
    assert overview.trends_summary.sources[
        "ios_sdk_api"
    ].latest_pct_market_share == pytest.approx(4.0, abs=0.0001)
    assert overview.trends_summary.sources[
        "ios_sdk_api"
    ].latest_pct_market_share_change == pytest.approx(2.0, abs=0.000001)
    assert overview.trends_summary.sources[
        "android_app_ads_direct"
    ].latest_pct_market_share == pytest.approx(3.5, abs=0.0001)
    assert overview.trends_summary.sources[
        "android_app_ads_direct"
    ].latest_pct_market_share_change == pytest.approx(1.5, abs=0.000001)


def test_build_company_overview_base_exposes_domain_and_parent_scopes():
    """Parent-company domains should expose both direct-domain and parent rollup totals."""
    state = MagicMock()
    trend_summary = MagicMock(latest_period="2025-Q1", sources={})
    company_categories_df = _make_company_categories_df()
    mediation_companies_df = pd.DataFrame(columns=["company_domain"])
    domain_stats_df = _make_parent_company_stats_df(total_apps=12)
    parent_stats_df = _make_parent_company_stats_df(total_apps=120)
    domain_adstxt_df = _make_ad_domain_overview_df(app_count=6)
    parent_adstxt_df = _make_ad_domain_overview_df(app_count=60)
    domain_publishers_df = _make_publishers_overview_df(app_count=6)
    parent_publishers_df = _make_publishers_overview_df(app_count=60)

    def _stats_side_effect(*args, **kwargs):
        return (
            parent_stats_df if kwargs.get("include_parent_rollup") else domain_stats_df
        )

    def _adstxt_side_effect(*args, **kwargs):
        return (
            parent_adstxt_df
            if kwargs.get("include_parent_rollup")
            else domain_adstxt_df
        )

    def _publishers_side_effect(*args, **kwargs):
        return (
            parent_publishers_df
            if kwargs.get("include_parent_rollup")
            else domain_publishers_df
        )

    with (
        patch(
            "api_app.controllers.companies.get_parent_companies",
            return_value=["google.com"],
        ),
        patch(
            "api_app.controllers.companies.get_company_stats",
            side_effect=_stats_side_effect,
        ),
        patch(
            "api_app.controllers.companies.get_company_adstxt_ad_domain_overview",
            side_effect=_adstxt_side_effect,
        ),
        patch(
            "api_app.controllers.companies.get_company_adstxt_publishers_overview",
            side_effect=_publishers_side_effect,
        ),
        patch(
            "api_app.controllers.companies.get_company_trends_summary",
            return_value=trend_summary,
        ),
        patch(
            "api_app.controllers.companies.get_company_categories",
            return_value=company_categories_df,
        ),
        patch(
            "api_app.controllers.companies.get_mediation_companies",
            return_value=mediation_companies_df,
        ),
    ):
        overview = build_company_overview_base(state=state, company_domain="google.com")

    assert overview.parent_overview is not None
    assert overview.domain_overview is not None
    assert overview.categories["all"].sdk_android_total_apps == 120
    assert overview.parent_overview.categories["all"].sdk_android_total_apps == 120
    assert overview.domain_overview.categories["all"].sdk_android_total_apps == 12
    assert (
        overview.adstxt_ad_domain_overview
        == overview.parent_overview.adstxt_ad_domain_overview
    )
    assert (
        overview.parent_overview.adstxt_ad_domain_overview["google"]["direct"][
            "app_count"
        ]
        == 60
    )
    assert (
        overview.domain_overview.adstxt_ad_domain_overview["google"]["direct"][
            "app_count"
        ]
        == 6
    )
    assert overview.trends_summary is trend_summary
    assert overview.parent_overview.trends_summary is None
    assert overview.domain_overview.trends_summary is trend_summary


def test_build_company_trends_payload_splits_history_by_platform():
    """Full company trends payload should keep separate histories for Android and iOS."""
    state = MagicMock()
    history_df = _make_history_df()

    with patch(
        "api_app.controllers.companies.get_combined_companies_history",
        return_value=history_df,
    ):
        trends = build_company_trends_payload(state=state, company_domain="google.com")

    assert trends.latest_period == "2025-Q1"
    assert [point.source_key for point in trends.history["android_sdk_api"]] == [
        "android_sdk_api",
        "android_sdk_api",
    ]
    assert [point.period for point in trends.history["android_sdk_api"]] == [
        "2024-Q4",
        "2025-Q1",
    ]
    assert trends.history["android_sdk_api"][1].pct_market_share == pytest.approx(
        18.0, abs=0.0001
    )
    assert trends.history["android_sdk_api"][
        1
    ].pct_market_share_change == pytest.approx(3.0, abs=0.000001)
    assert trends.history["ios_sdk_api"][1].pct_market_share == pytest.approx(
        4.0, abs=0.0001
    )
    assert trends.history["ios_sdk_api"][
        1
    ].pct_market_share_change_pct == pytest.approx(100.0, abs=0.0001)
    assert trends.history["android_app_ads_direct"][1].platform == "android"
    assert trends.history["android_app_ads_direct"][1].tag_source == "app_ads_direct"
    assert trends.history["android_app_ads_direct"][
        1
    ].pct_market_share == pytest.approx(3.5, abs=0.0001)


def test_build_company_trends_static_data_flattens_overview_metrics():
    """Static trend precomputation should expose flattened QoQ overview metrics."""
    history_df = _make_history_df()

    _, trends_overview_df = build_company_trends_static_data(history_df)

    row = trends_overview_df.set_index("company_domain").loc["google.com"]
    assert row["google_sdk_latest_pct_market_share"] == pytest.approx(
        18.0, abs=0.000001
    )
    assert row["apple_sdk_latest_pct_market_share"] == pytest.approx(4.0, abs=0.000001)
    assert row["google_app_ads_direct_latest_pct_market_share"] == pytest.approx(
        3.5, abs=0.000001
    )
    assert row["google_sdk_latest_pct_market_share_change"] == pytest.approx(
        20.0, abs=0.000001
    )
    assert row["apple_sdk_latest_pct_market_share_change"] == pytest.approx(
        100.0, abs=0.000001
    )
    assert row["google_app_ads_direct_latest_pct_market_share_change"] == pytest.approx(
        75.0, abs=0.000001
    )
    assert row["google_sdk_latest_total_apps"] == 180
    assert row["apple_sdk_latest_total_apps"] == 20
    assert row["google_app_ads_direct_latest_total_apps"] == 35
    assert "google_sdk_latest_total_apps_change_pct" not in row.index
    assert "apple_sdk_latest_total_apps_change_pct" not in row.index
    assert "google_app_ads_direct_latest_total_apps_change_pct" not in row.index
    assert row["google_sdk_latest_apps_added"] == 40
    assert row["apple_sdk_latest_apps_added"] == 10
    assert row["google_app_ads_direct_latest_apps_added"] == 20
    assert row["google_sdk_latest_apps_lost"] == 10
    assert row["apple_sdk_latest_apps_lost"] == 0
    assert row["google_app_ads_direct_latest_apps_lost"] == 5


def test_build_company_trends_static_data_caps_overview_qoq_share_change_pct():
    """Overview QoQ share change percentages should be capped for readability."""
    history_df = pd.DataFrame(
        [
            {
                "company_domain": "smallco.com",
                "year": 2024,
                "quarter": 4,
                "store": 1,
                "tag_source": "sdk_api",
                "total_apps": 1,
                "total_apps_in_quarter": 1000,
                "apps_lost": 0,
                "apps_added": 1,
            },
            {
                "company_domain": "smallco.com",
                "year": 2025,
                "quarter": 1,
                "store": 1,
                "tag_source": "sdk_api",
                "total_apps": 100,
                "total_apps_in_quarter": 1000,
                "apps_lost": 0,
                "apps_added": 99,
            },
        ]
    )

    _, trends_overview_df = build_company_trends_static_data(history_df)

    row = trends_overview_df.set_index("company_domain").loc["smallco.com"]
    assert row["google_sdk_latest_pct_market_share"] == pytest.approx(
        10.0, abs=0.000001
    )
    assert row["google_sdk_latest_pct_market_share_change"] == pytest.approx(
        500.0, abs=0.000001
    )


def test_build_company_trends_static_data_omits_overview_total_apps_change_pct():
    """Overview rows should no longer expose flattened total-app change percentages."""
    history_df = pd.DataFrame(
        [
            {
                "company_domain": "smallco.com",
                "year": 2024,
                "quarter": 4,
                "store": 1,
                "tag_source": "sdk_api",
                "total_apps": 10,
                "total_apps_in_quarter": 100,
                "apps_lost": 0,
                "apps_added": 10,
            },
            {
                "company_domain": "smallco.com",
                "year": 2025,
                "quarter": 1,
                "store": 1,
                "tag_source": "sdk_api",
                "total_apps": 20,
                "total_apps_in_quarter": 1000,
                "apps_lost": 2,
                "apps_added": 12,
            },
        ]
    )

    _, trends_overview_df = build_company_trends_static_data(history_df)

    row = trends_overview_df.set_index("company_domain").loc["smallco.com"]
    assert row["google_sdk_latest_total_apps"] == 20
    assert row["google_sdk_latest_pct_market_share_change"] == pytest.approx(
        -80.0, abs=0.000001
    )
    assert "google_sdk_latest_total_apps_change_pct" not in row.index


def test_prep_companies_overview_df_skips_static_trends_for_category_views():
    """Category-filtered overview tables should not merge global static QoQ trend columns."""
    state = MagicMock()
    overview_df = pd.DataFrame(
        [
            {
                "company_name": "Google",
                "company_domain": "google.com",
                "parent_company_domain": "alphabet.com",
                "parent_company_name": "Alphabet",
                "store": "Google Play",
                "tag_source": "sdk",
                "app_count": 100,
                "cat_total_app_count": 1000,
                "installs_d30": 5000,
            }
        ]
    )

    with (
        patch(
            "api_app.controllers.companies.get_company_open_source",
            return_value=pd.DataFrame(
                [{"company_domain": "google.com", "percent_open_source": 0.0}]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_countries",
            return_value=pd.DataFrame(
                [{"company_domain": "google.com", "api_ip_resolved_country": "US"}]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_logos_df",
            return_value=pd.DataFrame(
                [{"company_domain": "google.com", "company_logo_url": "logo.png"}]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_categories",
            return_value=pd.DataFrame(
                columns=["company_domain", "company_type", "company_type_slug"]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_trends_overview"
        ) as get_company_trends_overview_mock,
    ):
        prepped_df = prep_companies_overview_df(
            state,
            overview_df,
            include_trends_overview=False,
        )

    assert "google_sdk_latest_pct_market_share_change" not in prepped_df.columns
    assert "google_sdk_latest_total_apps_change_pct" not in prepped_df.columns
    get_company_trends_overview_mock.assert_not_called()


def test_prep_companies_overview_df_adds_company_category_without_mediation():
    """Overview rows should expose one company category per domain."""
    state = MagicMock()
    overview_df = pd.DataFrame(
        [
            {
                "company_name": "Google",
                "company_domain": "google.com",
                "parent_company_domain": "alphabet.com",
                "parent_company_name": "Alphabet",
                "store": "Google Play",
                "tag_source": "sdk",
                "app_count": 100,
                "cat_total_app_count": 1000,
                "installs_d30": 5000,
            }
        ]
    )

    with (
        patch(
            "api_app.controllers.companies.get_company_open_source",
            return_value=pd.DataFrame(
                [{"company_domain": "google.com", "percent_open_source": 0.0}]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_countries",
            return_value=pd.DataFrame(
                [{"company_domain": "google.com", "api_ip_resolved_country": "US"}]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_logos_df",
            return_value=pd.DataFrame(
                [{"company_domain": "google.com", "company_logo_url": "logo.png"}]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_categories",
            return_value=pd.DataFrame(
                [
                    {
                        "company_domain": "google.com",
                        "company_type": "Ad Network",
                        "company_type_slug": "ad-network",
                    },
                    {
                        "company_domain": "google.com",
                        "company_type": "Mediation",
                        "company_type_slug": "mediation",
                    },
                ]
            ),
        ),
        patch(
            "api_app.controllers.companies.get_company_trends_overview",
            return_value=pd.DataFrame(),
        ),
    ):
        prepped_df = prep_companies_overview_df(state, overview_df)

    assert prepped_df.loc[0, "company_category"] == "Ad Network"


def test_companies_endpoint_returns_company_category_field():
    """The companies endpoint should pass through company_category rows."""
    overview = CompaniesOverview(
        companies_overview=[
            {
                "company_domain": "google.com",
                "company_name": "Google",
                "company_category": "Ad Network",
                "google_sdk_latest_apps_added": 40,
                "google_sdk_latest_apps_lost": 10,
            }
        ],
        top=TopCompaniesShort(
            sdk_ios=PlatformCompanies(ios=[], android=[]),
            sdk_android=PlatformCompanies(ios=[], android=[]),
            adstxt_direct_ios=PlatformCompanies(ios=[], android=[]),
            adstxt_direct_android=PlatformCompanies(ios=[], android=[]),
        ),
        categories=CompaniesCategoryOverview(),
    )
    app = Litestar(route_handlers=[CompaniesController])

    with (
        patch("api_app.controllers.companies.get_overviews", return_value=overview),
        TestClient(app=app, raise_server_exceptions=False) as client,
    ):
        response = client.get("/api/companies")

    assert response.status_code == 200
    payload = response.json()
    assert payload["companies_overview"][0]["company_category"] == "Ad Network"
    assert "google_sdk_latest_apps_added" not in payload["companies_overview"][0]
    assert payload["companies_overview"][0]["google_sdk_latest_apps_lost"] == 10


def test_get_company_directory_builds_unique_rows_with_logo_context():
    state = MagicMock()
    companies_df = pd.DataFrame(
        [
            {
                "company_domain": "google.com",
                "company_name": "Google",
                "parent_company_domain": "alphabet.com",
                "parent_company_name": "Alphabet",
                "store": "Google Play",
                "tag_source": "sdk",
                "app_category": "all",
                "app_count": 100,
                "installs_d30": 10,
            },
            {
                "company_domain": "google.com",
                "company_name": "Google",
                "parent_company_domain": "alphabet.com",
                "parent_company_name": "Alphabet",
                "store": "Apple App Store",
                "tag_source": "sdk",
                "app_category": "all",
                "app_count": 50,
                "installs_d30": 5,
            },
            {
                "company_domain": "adte.com",
                "company_name": None,
                "parent_company_domain": None,
                "parent_company_name": None,
                "store": "Google Play",
                "tag_source": "sdk",
                "app_category": "all",
                "app_count": 25,
                "installs_d30": 2,
            },
        ]
    )
    logos_df = pd.DataFrame(
        [
            {"company_domain": "google.com", "company_logo_url": "google-logo.png"},
            {"company_domain": "alphabet.com", "company_logo_url": "alphabet-logo.png"},
            {"company_domain": "adte.com", "company_logo_url": None},
        ]
    )

    with (
        patch(
            "api_app.controllers.companies.get_companies_stats",
            return_value=companies_df,
        ),
        patch(
            "api_app.controllers.companies.get_company_logos_df",
            return_value=logos_df,
        ),
    ):
        directory = get_company_directory(state)

    assert directory == [
        CompanyDirectoryEntry(
            name="Google",
            company_domain="google.com",
            parent_company_domain="alphabet.com",
            parent_company_name="Alphabet",
            company_logo_url="google-logo.png",
            parent_company_logo_url="alphabet-logo.png",
        ),
        CompanyDirectoryEntry(
            name="adte.com",
            company_domain="adte.com",
            parent_company_domain=None,
            parent_company_name=None,
            company_logo_url=None,
            parent_company_logo_url=None,
        ),
    ]


def test_companies_list_endpoint_returns_slim_directory_payload():
    directory = [
        CompanyDirectoryEntry(
            name="Google",
            company_domain="google.com",
            parent_company_domain="alphabet.com",
            parent_company_name="Alphabet",
            company_logo_url="google-logo.png",
            parent_company_logo_url="alphabet-logo.png",
        )
    ]
    app = Litestar(route_handlers=[CompaniesController])

    with (
        patch(
            "api_app.controllers.companies.get_company_directory",
            return_value=directory,
        ),
        TestClient(app=app, raise_server_exceptions=False) as client,
    ):
        response = client.get("/api/companies/list")

    assert response.status_code == 200
    assert response.json() == [
        {
            "name": "Google",
            "company_domain": "google.com",
            "parent_company_domain": "alphabet.com",
            "parent_company_name": "Alphabet",
            "company_logo_url": "google-logo.png",
            "parent_company_logo_url": "alphabet-logo.png",
        }
    ]
