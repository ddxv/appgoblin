WITH matching_apps AS (
    SELECT
        store_app
    FROM
        adtech.combined_store_apps_companies c
    WHERE
        c.ad_domain = ANY (:include_domains :: text[])
        AND (
            NOT :require_sdk_api :: boolean
            OR c.sdk = TRUE
            OR c.api_call = TRUE
        )
    GROUP BY
        store_app
    HAVING
        COUNT(DISTINCT c.ad_domain) = cardinality(:include_domains :: text[])
)
SELECT
    sao.*
FROM
    matching_apps ma
JOIN frontend.store_apps_overview sao
    ON ma.store_app = sao.id
WHERE
    sao.store_last_updated > :mydate :: date
    AND (NOT :require_iap :: boolean OR sao.in_app_purchases)
    AND (NOT :require_ads :: boolean OR sao.ad_supported)
    AND NOT EXISTS (
        SELECT 1
        FROM adtech.combined_store_apps_companies x
        WHERE
            x.store_app = ma.store_app
            AND x.ad_domain = ANY (:exclude_domains :: text[])
    )
ORDER BY
    installs DESC NULLS LAST
LIMIT 100;
