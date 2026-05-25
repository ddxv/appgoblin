"""Tests for backend analytics helpers."""

import sys
import types

from api_app.analytics import log_umami_page


def test_log_umami_page_normalizes_optional_fields():
    called: dict[str, str] = {}
    fake_umami = types.SimpleNamespace()

    def set_url_base(value: str) -> None:
        called["url_base"] = value

    def set_website_id(value: str) -> None:
        called["website_id"] = value

    def new_page_view(**kwargs) -> None:
        called.update(kwargs)

    fake_umami.set_url_base = set_url_base
    fake_umami.set_website_id = set_website_id
    fake_umami.new_page_view = new_page_view

    original_umami = sys.modules.get("umami")
    sys.modules["umami"] = fake_umami
    try:
        log_umami_page(
            url="/api/v1/companies",
            hostname="appgoblin.info",
            referrer=None,
            ip="203.0.113.1",
            user_id=7,
        )
    finally:
        if original_umami is None:
            del sys.modules["umami"]
        else:
            sys.modules["umami"] = original_umami

    assert called["hostname"] == "appgoblin.info"
    assert called["referrer"] == ""
    assert called["ip_address"] == "203.0.113.1"
    assert called["distinct_id"] == "7"
