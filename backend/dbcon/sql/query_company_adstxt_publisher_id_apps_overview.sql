WITH ranked_apps AS (
    SELECT
        sa.store,
        sa.store_id,
        sa.name AS app_name,
        sa.installs,
        sa.rating_count,
        pd.url AS developer_domain_url,
        aae.relationship,
        pd.crawled_at AS developer_domain_crawled_at,
        ROW_NUMBER() OVER (PARTITION BY store, relationship) AS rn
    FROM frontend.adstxt_entries_store_apps AS aesa
    LEFT JOIN store_apps AS sa ON aesa.store_app = sa.id
    LEFT JOIN app_ad_entrys AS aae ON aesa.app_ad_entry_id = aae.id
    LEFT JOIN ad_domains AS ad ON aesa.ad_domain_id = ad.id
    LEFT JOIN pub_domains AS pd ON aesa.pub_domain_id = pd.id
    WHERE
        ad.domain = :ad_domain_url
        AND aae.publisher_id = :publisher_id
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
