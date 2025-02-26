SELECT
    sa.store,
    sa.store_id,
    sa.name AS app_name,
    sa.category AS app_category,
    sa.installs,
    sa.rating_count,
    d.developer_id,
    d.name AS developer_name,
    aesa.developer_domain_url,
    aesa.relationship,
    aesa.developer_domain_crawled_at
FROM
    frontend.adstxt_entries_store_apps AS aesa
LEFT JOIN store_apps AS sa
    ON
        aesa.store_app = sa.id
LEFT JOIN developers AS d
    ON
        sa.developer = d.id
WHERE
    aesa.ad_domain_url = :ad_domain_url
    AND aesa.publisher_id = :publisher_id
    AND sa.store IS NOT NULL;
