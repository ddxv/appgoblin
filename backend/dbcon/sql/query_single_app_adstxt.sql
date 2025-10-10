SELECT
    c.name AS company_name,
    ad.domain_name AS ad_domain_url,
    aae.publisher_id,
    aae.relationship,
    pd.crawled_at AS developer_domain_crawled_at
FROM
    frontend.adstxt_entries_store_apps AS aesa
LEFT JOIN store_apps AS sa
    ON
        aesa.store_app = sa.id
LEFT JOIN app_ads_entrys AS aae
    ON
        aesa.app_ad_entry_id = aae.id
LEFT JOIN domains AS ad
    ON
        aesa.ad_domain_id = ad.id
LEFT JOIN pub_domains AS pd
    ON
        aesa.pub_domain_id = pd.id
LEFT JOIN adtech.companies AS c
    ON
        aesa.company_id = c.id
WHERE
    sa.store_id = :store_id;
