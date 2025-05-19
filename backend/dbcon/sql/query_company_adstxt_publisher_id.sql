SELECT
    sa.store,
    sa.store_id,
    sa.name AS app_name,
    sa.category AS app_category,
    sa.installs,
    sa.rating_count,
    d.developer_id,
    d.name AS developer_name,
    pd.url AS developer_domain_url,
    aae.relationship,
    pd.crawled_at AS developer_domain_crawled_at
FROM
    frontend.adstxt_entries_store_apps AS aesa
LEFT JOIN store_apps AS sa
    ON
        aesa.store_app = sa.id
LEFT JOIN developers AS d
    ON
        sa.developer = d.id
LEFT JOIN ad_domains AS ad
    ON
        aesa.ad_domain_id = ad.id
LEFT JOIN pub_domains AS pd
    ON
        aesa.pub_domain_id = pd.id
LEFT JOIN app_ads_entrys AS aae
    ON
        aesa.app_ad_entry_id = aae.id
WHERE
    ad.domain = :ad_domain_url
    AND aae.publisher_id = :publisher_id
    AND sa.store IS NOT NULL;
