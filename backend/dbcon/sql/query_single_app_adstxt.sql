SELECT
    company_name,
    ad_domain_url,
    publisher_id,
    relationship,
    developer_domain_crawled_at
FROM
    frontend.adstxt_entries_store_apps AS aesa
LEFT JOIN store_apps AS sa
    ON
        aesa.store_app = sa.id
WHERE
    sa.store_id = :store_id;
