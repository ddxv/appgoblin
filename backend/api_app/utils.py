"""Utility functions for the api_app package."""

import pandas as pd


def extend_app_icon_url(df: pd.DataFrame) -> pd.DataFrame:
    """Extend the app icon url. Prefers icon_128, falls back to icon_64."""
    if df.empty:
        df["app_icon_url"] = None
        return df

    df["app_icon_url"] = None
    prefix = "https://media.appgoblin.info/app-icons/"

    for col in ("icon_128", "icon_64"):
        if col not in df.columns:
            continue
        mask = df[col].notna()
        if not mask.any():
            continue
        store_ids = df.loc[mask, "store_id"].astype("object")
        icon_paths = df.loc[mask, col].astype("object")
        df.loc[mask, "app_icon_url"] = prefix + store_ids + "/" + icon_paths
        if mask.all():
            break

    return df
