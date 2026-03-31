"""Integration tests for /api/v1/companies endpoint."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from dataclasses import dataclass
from unittest.mock import MagicMock, patch

import pytest
from litestar import Litestar
from litestar.testing import TestClient

from api_app.controllers.v1_companies import V1CompaniesController
from api_app.guards import _CachedKey
from app import RateLimitMiddleware
from litestar.middleware import DefineMiddleware


@dataclass
class FakeCompanyDetail:
    company_id: int
    name: str
    count: int


@dataclass
class FakeCompaniesOverview:
    companies_overview: list
    top: object = None
    categories: object = None


@asynccontextmanager
async def _mock_lifespan(app: Litestar) -> AsyncGenerator[None]:
    """Set up mock dbconwrite on the app state for all requests."""
    app.state.dbconwrite = MagicMock()
    yield


def _make_test_app():
    return Litestar(
        route_handlers=[V1CompaniesController],
        lifespan=[_mock_lifespan],
        middleware=[DefineMiddleware(RateLimitMiddleware)],
    )


@pytest.fixture(autouse=True)
def _reset_caches():
    from api_app import guards as g

    g._KEY_CACHE.clear()
    g._LAST_USED_UPDATES.clear()
    g._rate_limiter._buckets.clear()
    g._daily_quota._counters.clear()
    yield


def _patch_key_found(tier="free"):
    return patch(
        "api_app.guards._query_key",
        return_value=_CachedKey(user_id=1, tier=tier, expires_at=9e9),
    )


def _patch_key_not_found():
    return patch("api_app.guards._query_key", return_value=None)


FAKE_OVERVIEW = FakeCompaniesOverview(
    companies_overview=[
        FakeCompanyDetail(company_id=1, name="Google", count=50000),
        FakeCompanyDetail(company_id=2, name="Meta", count=30000),
    ]
)


def _patch_overview(overview=FAKE_OVERVIEW):
    return patch("api_app.controllers.v1_companies.get_overviews", return_value=overview)


class TestV1CompaniesAuth:
    def test_no_api_key_returns_401(self):
        app = _make_test_app()
        with TestClient(app=app, raise_server_exceptions=False) as client:
            resp = client.get("/api/v1/companies")
        assert resp.status_code == 401
        assert "Missing X-API-Key" in resp.json()["detail"]

    def test_invalid_api_key_returns_401(self):
        app = _make_test_app()
        with (
            _patch_key_not_found(),
            TestClient(app=app, raise_server_exceptions=False) as client,
        ):
            resp = client.get(
                "/api/v1/companies",
                headers={"X-API-Key": "ag_totallyfake"},
            )
        assert resp.status_code == 401

    def test_valid_key_returns_200(self):
        app = _make_test_app()
        with (
            _patch_key_found("free"),
            _patch_overview(),
            TestClient(app=app, raise_server_exceptions=False) as client,
        ):
            resp = client.get(
                "/api/v1/companies",
                headers={"X-API-Key": "ag_goodkey"},
            )

        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) == 2
        assert data[0]["name"] == "Google"
        assert data[1]["count"] == 30000


class TestV1CompaniesRateLimitHeaders:
    def test_response_has_ratelimit_headers(self):
        app = _make_test_app()
        with (
            _patch_key_found("free"),
            _patch_overview(),
            TestClient(app=app) as client,
        ):
            resp = client.get(
                "/api/v1/companies",
                headers={"X-API-Key": "ag_headercheck"},
            )

        assert resp.status_code == 200
        assert resp.headers["x-ratelimit-limit"] == "30"
        assert resp.headers["x-ratelimit-remaining"] == "29"

    def test_daily_quota_headers_present(self):
        app = _make_test_app()
        with (
            _patch_key_found("free"),
            _patch_overview(),
            TestClient(app=app) as client,
        ):
            resp = client.get(
                "/api/v1/companies",
                headers={"X-API-Key": "ag_dailyheader"},
            )

        assert resp.headers["x-ratelimit-policy"] == "1000;w=86400"
        assert resp.headers["x-ratelimit-quota-remaining"] == "999"


class TestV1CompaniesRateLimit:
    def test_per_minute_429(self):
        app = _make_test_app()
        with (
            _patch_key_found("free"),
            _patch_overview(),
            TestClient(app=app, raise_server_exceptions=False) as client,
        ):
            key = "ag_ratelimit429"
            headers = {"X-API-Key": key}

            for _ in range(30):
                resp = client.get("/api/v1/companies", headers=headers)
                assert resp.status_code == 200

            resp = client.get("/api/v1/companies", headers=headers)
            assert resp.status_code == 429
            assert "Rate limit exceeded" in resp.json()["detail"]
            assert "retry-after" in resp.headers

    def test_daily_quota_429(self):
        app = _make_test_app()
        with (
            _patch_key_found("b2b_premium"),
            _patch_overview(),
            TestClient(app=app, raise_server_exceptions=False) as client,
        ):
            from api_app import guards as g
            import hashlib

            raw_key = "ag_daily429"
            key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
            headers = {"X-API-Key": raw_key}

            # Exhaust daily quota using the hash
            for _ in range(500_000):
                g._daily_quota.check(key_hash, 500_000)

            resp = client.get("/api/v1/companies", headers=headers)
            assert resp.status_code == 429
            assert "Daily request quota" in resp.json()["detail"]


class TestV1CompaniesTierRateLimits:
    @pytest.mark.parametrize(
        "tier,expected_minute",
        [
            ("free", "30"),
            ("premium_access", "200"),
            ("b2b_sdk", "2000"),
            ("b2b_premium", "10000"),
        ],
    )
    def test_tier_minute_limit_in_header(self, tier, expected_minute):
        app = _make_test_app()
        with (
            _patch_key_found(tier),
            _patch_overview(),
            TestClient(app=app) as client,
        ):
            resp = client.get(
                "/api/v1/companies",
                headers={"X-API-Key": f"ag_{tier}key"},
            )

        assert resp.status_code == 200
        assert resp.headers["x-ratelimit-limit"] == expected_minute
