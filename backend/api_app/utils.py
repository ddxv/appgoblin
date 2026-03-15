"""Utility functions for the api_app package."""

import pandas as pd


def extend_app_icon_url(df: pd.DataFrame) -> pd.DataFrame:
    """Extend the app icon url."""
    if df.empty:
        df["app_icon_url"] = None
        return df

    has_icon_url = df["icon_url_100"].notna()
    df["app_icon_url"] = None

    if has_icon_url.any():
        prefix = "https://media.appgoblin.info/app-icons/"
        store_ids = df.loc[has_icon_url, "store_id"].astype("object")
        icon_paths = df.loc[has_icon_url, "icon_url_100"].astype("object")
        df.loc[has_icon_url, "app_icon_url"] = prefix + store_ids + "/" + icon_paths

    return df
