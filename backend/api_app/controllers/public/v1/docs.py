"""Public API v1 documentation endpoints."""

from copy import deepcopy
from typing import Any, Self

from litestar import Controller, Request, get
from litestar.enums import MediaType, OpenAPIMediaType
from litestar.openapi.plugins import ScalarRenderPlugin

V1_PATH_PREFIX = "/api/v1/"
V1_DOCS_PATH_PREFIX = "/api/v1/docs/"
V1_OPENAPI_JSON_PATH = "/api/v1/docs/openapi.json"
PUBLIC_API_SERVER_URL = "https://appgoblin.info"
SCALAR_CSS_URL = "data:text/css,"
APP_BASICS_EXAMPLE_STORE_ID = "dev.thirdgate.appgoblin"
APP_BASICS_EXAMPLE_RESPONSE = {
    "name": "AppGoblin: Scan Trackers & SDK",
    "store_id": APP_BASICS_EXAMPLE_STORE_ID,
    "store": "Google Play",
    "category": "tools",
    "rating": 0,
    "rating_count": 0,
    "installs": 37,
    "weekly_active_users": 3,
    "monthly_active_users": 4,
    "monthly_ad_revenue": 0.0,
    "monthly_iap_revenue": 0.0,
    "installs_weekly": 1,
    "installs_monthly": 6.0,
    "rating_count_weekly": None,
    "store_last_updated": "2026-03-14",
    "developer_id": "9106252563958903597",
    "developer_name": "3rd Gate",
    "developer_url": "appgoblin.info",
    "release_date": "2025-03-16",
    "ad_supported": False,
    "in_app_purchases": False,
    "store_link": (
        "https://play.google.com/store/apps/details?id=dev.thirdgate.appgoblin"
    ),
}
COMPANIES_INDEX_EXAMPLE_RESPONSE = [
    {
        "name": "Unity",
        "company_domain": "unity.com",
        "parent_company_domain": None,
        "parent_company_name": None,
        "api_ip_resolved_country": "US",
        "total_app_count": 145_516,
        "installs_d30": 96_783_797_489,
        "trends_latest_period": "2026Q1",
        "google_sdk_latest_pct_market_share": 18.34,
        "apple_sdk_latest_pct_market_share": 7.91,
        "google_app_ads_direct_latest_pct_market_share": 2.06,
        "apple_app_ads_direct_latest_pct_market_share": 0.73,
        "google_sdk_latest_pct_market_share_change": 4.63,
        "apple_sdk_latest_pct_market_share_change": 1.82,
        "google_app_ads_direct_latest_pct_market_share_change": -0.57,
        "apple_app_ads_direct_latest_pct_market_share_change": 0.14,
        "google_sdk_latest_total_apps": 51_202,
        "apple_sdk_latest_total_apps": 16_887,
        "google_app_ads_direct_latest_total_apps": 1_904,
        "apple_app_ads_direct_latest_total_apps": 612,
        "google_sdk_latest_apps_added": 1487,
        "apple_sdk_latest_apps_added": 311,
        "google_app_ads_direct_latest_apps_added": 127,
        "apple_app_ads_direct_latest_apps_added": 42,
        "google_sdk_latest_apps_lost": 221,
        "apple_sdk_latest_apps_lost": 18,
        "google_app_ads_direct_latest_apps_lost": 406,
        "apple_app_ads_direct_latest_apps_lost": 27,
    }
]
COMPANY_OVERVIEW_EXAMPLE_DOMAIN = "unity.com"
COMPANY_OVERVIEW_EXAMPLE_RESPONSE = {
    "domain_is_mapped": True,
    "company_types": [
        "ad-networks",
        "development-tools",
        "mediation",
    ],
    "metrics": {
        "total_apps": 0,
        "adstxt_direct_android_total_apps": 99976,
        "adstxt_direct_ios_total_apps": 45540,
        "adstxt_reseller_android_total_apps": 40957,
        "adstxt_reseller_ios_total_apps": 19469,
        "sdk_android_total_apps": 39452,
        "sdk_ios_total_apps": 16381,
        "sdk_total_apps": 55833,
        "api_android_total_apps": 11175,
        "api_total_apps": 11175,
        "sdk_android_installs_d30": 86325326083,
        "sdk_ios_installs_d30": 31415926535,
        "adstxt_direct_android_installs_d30": 96783797489,
        "adstxt_reseller_android_installs_d30": 42347935007,
    },
    "trends": {
        "latest_period": "2026Q1",
        "android_app_ads_direct_market_share_change_pct": -0.57,
        "android_app_ads_direct_apps_lost": 406,
        "android_sdk_api_market_share_change_pct": 4.63,
        "android_sdk_api_apps_lost": 221,
        "ios_app_ads_direct_market_share_change_pct": 0.14,
        "ios_app_ads_direct_apps_lost": 27,
        "ios_sdk_api_market_share_change_pct": 1.82,
        "ios_sdk_api_apps_lost": 18,
    },
    "mapping_notice": None,
    "datasets": {
        "sdk_api_android": {
            "available": True,
            "estimated_rows": 39452,
            "url": "example.csv",
        },
        "sdk_api_ios": {
            "available": True,
            "estimated_rows": 16381,
            "url": "exampl.csv",
        },
    },
}
COMPANY_APPS_ADDED_EXAMPLE_RESPONSE = {
    "company_domain": "unity.com",
    "tag_source": "sdk",
    "year": 2026,
    "quarter": 1,
    "status": "added",
    "android_apps": ["com.example.first"],
    "ios_apps": ["id1234567890"],
}
V1_OPERATION_DOCS = {
    "/api/v1/companies": {
        "get": {
            "summary": "/companies",
            "description": (
                "Endpoint: `GET /api/v1/companies`\n\n"
                "Returns the public company index with queryable company domains, "
                "display names, parent mappings, installs, and the latest trend "
                "snapshot fields for market share, market-share change, total "
                "apps, apps added, and apps lost."
            ),
        }
    },
    "/api/v1/companies/{company_domain}": {
        "get": {
            "summary": "/companies/{company_domain}",
            "description": (
                "Endpoint: `GET /api/v1/companies/{company_domain}`\n\n"
                "Returns the public company overview for a single domain, including "
                "mapping status, company types, key metrics, a latest-trends summary, "
                "and dataset availability."
            ),
        }
    },
    "/api/v1/companies/{company_domain}/app-changes": {
        "get": {
            "summary": "/companies/{company_domain}/app-changes",
            "description": (
                "Endpoint: `GET /api/v1/companies/{company_domain}/app-changes`\n\n"
                "Returns ordered Android and iOS app store IDs for apps added to or "
                "lost from a company in a specific year/quarter slice, filtered by "
                "status and a single tag source."
            ),
        }
    },
    "/api/v1/apps/{store_id}": {
        "get": {
            "summary": "/apps/{store_id}",
            "description": (
                "Endpoint: `GET /api/v1/apps/{store_id}`\n\n"
                "Returns stable public app metadata plus MAU, recent install, and "
                "estimated revenue signals for a single app."
            ),
        }
    },
    "/api/v1/apps/{store_id}/ranks": {
        "get": {
            "summary": "/apps/{store_id}/ranks",
            "description": (
                "Endpoint: `GET /api/v1/apps/{store_id}/ranks`\n\n"
                "Returns flat best-rank records by country, collection, and category "
                "for the last 90 days."
            ),
        }
    },
    "/api/v1/apps/{store_id}/sdks": {
        "get": {
            "summary": "/apps/{store_id}/sdks",
            "description": (
                "Endpoint: `GET /api/v1/apps/{store_id}/sdks`\n\n"
                "Returns public SDK findings, permissions, package queries, SKAdNetwork "
                "entries, and unmapped evidence for a single app."
            ),
        }
    },
}

SCALAR_OPTIONS = {
    "theme": "purple",
    "expandAllResponses": True,
    "hideClientButton": True,
    "hideModels": True,
    "hideSearch": True,
    "hideTestRequestButton": True,
    "showSidebar": True,
    "showDeveloperTools": "never",
    "showToolbar": "localhost",
    "operationTitleSource": "summary",
    "persistAuth": False,
    "telemetry": True,
    "externalUrls": {
        "dashboardUrl": "https://dashboard.scalar.com",
        "registryUrl": "https://registry.scalar.com",
        "proxyUrl": "https://proxy.scalar.com",
        "apiBaseUrl": "https://api.scalar.com",
    },
    "layout": "modern",
    "isEditable": False,
    "isLoading": False,
    "documentDownloadType": "both",
    "showOperationId": False,
    "hideDarkModeToggle": False,
    "withDefaultFonts": True,
    "defaultOpenFirstTag": True,
    "defaultOpenAllTags": False,
    "expandAllModelSections": False,
    "orderSchemaPropertiesBy": "alpha",
    "orderRequiredPropertiesFirst": True,
    "_integration": "html",
    "default": False,
    "slug": "api-1",
    "title": "API #1",
    "agent": {"disabled": True},
}


class V1ScalarRenderPlugin(ScalarRenderPlugin):
    """Render Scalar against the dedicated v1 schema endpoint."""

    @staticmethod
    def get_openapi_json_route(request: Request) -> str:
        return V1_OPENAPI_JSON_PATH


_SCALAR_PLUGIN = V1ScalarRenderPlugin(
    path="/",
    options=SCALAR_OPTIONS,
    css_url=SCALAR_CSS_URL,
)


def _set_companies_index_example(schema: dict[str, Any]) -> None:
    """Attach a concrete example to the public companies index endpoint."""
    path_item = schema.get("paths", {}).get("/api/v1/companies")
    if not isinstance(path_item, dict):
        return

    get_operation = path_item.get("get")
    if not isinstance(get_operation, dict):
        return

    responses = get_operation.get("responses", {})
    response_200 = responses.get("200")
    if not isinstance(response_200, dict):
        return

    content = response_200.get("content", {})
    json_content = content.get("application/json")
    if not isinstance(json_content, dict):
        return

    json_content["examples"] = {
        "companies_index": {
            "summary": "Companies index with latest trend snapshot fields",
            "value": COMPANIES_INDEX_EXAMPLE_RESPONSE,
        }
    }


def _set_app_basics_example(schema: dict[str, Any]) -> None:
    """Attach a concrete example to the public app basics endpoint."""
    path_item = schema.get("paths", {}).get("/api/v1/apps/{store_id}")
    if not isinstance(path_item, dict):
        return

    get_operation = path_item.get("get")
    if not isinstance(get_operation, dict):
        return

    for parameter in get_operation.get("parameters", []):
        if parameter.get("name") == "store_id":
            parameter["example"] = APP_BASICS_EXAMPLE_STORE_ID

    responses = get_operation.get("responses", {})
    response_200 = responses.get("200")
    if not isinstance(response_200, dict):
        return

    content = response_200.get("content", {})
    json_content = content.get("application/json")
    if not isinstance(json_content, dict):
        return

    json_content["examples"] = {
        "appgoblin_android_app": {
            "summary": "App basics for the AppGoblin Android app",
            "value": APP_BASICS_EXAMPLE_RESPONSE,
        }
    }


def _set_company_overview_example(schema: dict[str, Any]) -> None:
    """Attach a concrete example to the public company detail endpoint."""
    path_item = schema.get("paths", {}).get("/api/v1/companies/{company_domain}")
    if not isinstance(path_item, dict):
        return

    get_operation = path_item.get("get")
    if not isinstance(get_operation, dict):
        return

    for parameter in get_operation.get("parameters", []):
        if parameter.get("name") == "company_domain":
            parameter["example"] = COMPANY_OVERVIEW_EXAMPLE_DOMAIN

    responses = get_operation.get("responses", {})
    response_200 = responses.get("200")
    if not isinstance(response_200, dict):
        return

    content = response_200.get("content", {})
    json_content = content.get("application/json")
    if not isinstance(json_content, dict):
        return

    json_content["examples"] = {
        "unity_company_overview": {
            "summary": "Company detail overview for Unity",
            "value": COMPANY_OVERVIEW_EXAMPLE_RESPONSE,
        }
    }


def _set_company_app_changes_examples(schema: dict[str, Any]) -> None:
    """Attach examples and parameter examples for public company app-change endpoints."""
    path_item = schema.get("paths", {}).get(
        "/api/v1/companies/{company_domain}/app-changes"
    )
    if not isinstance(path_item, dict):
        return

    get_operation = path_item.get("get")
    if not isinstance(get_operation, dict):
        return

    for parameter in get_operation.get("parameters", []):
        if parameter.get("name") == "company_domain":
            parameter["example"] = "unity.com"
        elif parameter.get("name") == "status":
            parameter["example"] = "added"
        elif parameter.get("name") == "tag_source":
            parameter["example"] = "sdk"
        elif parameter.get("name") == "year":
            parameter["example"] = 2026
        elif parameter.get("name") == "quarter":
            parameter["example"] = 1

    responses = get_operation.get("responses", {})
    response_200 = responses.get("200")
    if not isinstance(response_200, dict):
        return

    content = response_200.get("content", {})
    json_content = content.get("application/json")
    if not isinstance(json_content, dict):
        return

    json_content["examples"] = {
        "unity_company_app_changes_added": {
            "summary": "Store IDs for Unity apps added in 2026 Q1",
            "value": {
                **COMPANY_APPS_ADDED_EXAMPLE_RESPONSE,
                "status": "added",
            },
        },
        "unity_company_app_changes_lost": {
            "summary": "Store IDs for Unity apps lost in 2026 Q1",
            "value": {
                **COMPANY_APPS_ADDED_EXAMPLE_RESPONSE,
                "status": "lost",
            },
        },
    }


def _set_operation_docs(schema: dict[str, Any]) -> None:
    """Set stable Scalar-friendly summaries and descriptions for public v1 routes."""
    paths = schema.get("paths", {})
    if not isinstance(paths, dict):
        return

    for path, methods in V1_OPERATION_DOCS.items():
        path_item = paths.get(path)
        if not isinstance(path_item, dict):
            continue

        for method, metadata in methods.items():
            operation = path_item.get(method)
            if not isinstance(operation, dict):
                continue

            operation["summary"] = metadata["summary"]
            operation["description"] = metadata["description"]


def build_v1_openapi_schema(request: Request) -> dict[str, Any]:
    """Return a filtered OpenAPI schema containing only public v1 endpoints."""
    schema = deepcopy(request.app.openapi_schema.to_schema())
    schema["paths"] = {
        path: value
        for path, value in schema.get("paths", {}).items()
        if path.startswith(V1_PATH_PREFIX) and not path.startswith(V1_DOCS_PATH_PREFIX)
    }
    schema["info"] = {
        **schema.get("info", {}),
        "title": "AppGoblin Public API v1",
        "version": "0.1.0",
        "description": (
            "Interactive reference for AppGoblin public v1 endpoints.\n\n"
            "## Authentication\n"
            "Create or manage your API Token from the AppGoblin account dashboard, "
            "then send it in the `X-API-Key` header on each request.\n\n"
            "- Header: `X-API-Key: <your-api-token>`\n"
            f"- Get a token: {PUBLIC_API_SERVER_URL}/account/api-keys\n"
            "\n"
            "## Rate Limits\n"
            "Rate limits are enforced per API key and vary by subscription tier.\n\n"
            "- Free API keys include a baseline limit of 30 requests per minute and "
            "1,000 requests per day\n"
            "- Paid tiers include higher per-minute and daily quotas\n"
            "- Responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, "
            "`X-RateLimit-Policy`, and `X-RateLimit-Quota-Remaining` headers\n"
            "- Requests that exceed a limit return `429 Too Many Requests`; "
            "minute-limit responses may also include `Retry-After`\n"
            "\n"
            "- App basics include stable store metadata plus MAU, recent install, and "
            "estimated revenue metrics\n"
            "- Public app payloads intentionally omit internal IDs, app icon URLs, and "
            "creative inventory counters\n"
            "- App endpoints accept valid public API tokens\n"
            "- Company endpoints require a paid subscription tier"
        ),
    }
    components = schema.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})
    security_schemes["ApiKeyAuth"] = {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-Key",
        "description": (
            "Generate an API Token from the AppGoblin dashboard and send it as the "
            "X-API-Key header."
        ),
    }
    schema["security"] = [{"ApiKeyAuth": []}]
    schema["servers"] = [{"url": PUBLIC_API_SERVER_URL}]
    _set_operation_docs(schema)
    _set_companies_index_example(schema)
    _set_app_basics_example(schema)
    _set_company_overview_example(schema)
    _set_company_app_changes_examples(schema)
    return schema


class V1DocsController(Controller):
    """Generated documentation views for the public v1 API."""

    path = "/api/v1/docs"
    include_in_schema = False

    @get(
        path="/openapi.json",
        media_type=OpenAPIMediaType.OPENAPI_JSON,
    )
    async def openapi_json(self: Self, request: Request) -> dict[str, Any]:
        """Return the public v1 OpenAPI schema."""
        return build_v1_openapi_schema(request)

    @get(path="/openapi", media_type=MediaType.HTML)
    async def openapi(self: Self, request: Request) -> bytes:
        """Render Scalar for the public v1 OpenAPI schema."""
        return _SCALAR_PLUGIN.render(request, build_v1_openapi_schema(request))
