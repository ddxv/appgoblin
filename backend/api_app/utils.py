"""Utility functions for the api_app package."""

import numpy as np
import pandas as pd


def extend_app_icon_url(df: pd.DataFrame) -> pd.DataFrame:
    """Extend the app icon url."""
    if "icon_url_512" in df.columns:
        df["app_icon_url"] = np.where(
            df["icon_url_100"].notna(),
            "https://media.appgoblin.info/app-icons/"
            + df["store_id"]
            + "/"
            + df["icon_url_100"],
            df["icon_url_512"],
        )
    else:
        df["app_icon_url"] = np.where(
            df["icon_url_100"].notna(),
            "https://media.appgoblin.info/app-icons/"
            + df["store_id"]
            + "/"
            + df["icon_url_100"],
            None,
        )
    return df
