WITH ranked_apps AS (
    SELECT
        sa.store,
        sa.store_id,
        sa.name AS app_name,
        sa.installs,
        sa.rating_count,
        aesa.developer_domain_url,
        aesa.relationship,
        aesa.developer_domain_crawled_at,
        ROW_NUMBER() OVER (PARTITION BY store, relationship) AS rn
    FROM frontend.adstxt_entries_store_apps AS aesa
    LEFT JOIN store_apps AS sa ON aesa.store_app = sa.id
    WHERE
        ad_domain_url = :ad_domain_url
        AND publisher_id = :publisher_id
)

SELECT
    store,
    store_id,
    app_name,
    installs,
    rating_count,
    developer_domain_url,
    relationship,
    developer_domain_crawled_at
FROM ranked_apps
WHERE rn <= 10;
