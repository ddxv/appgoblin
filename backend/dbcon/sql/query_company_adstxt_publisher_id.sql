SELECT 
    store,
    store_id,
    app_name,
    installs,
    rating_count,
    developer_id,
    developer_name,
    developer_domain_url,
    relationship,
    developer_domain_crawled_at
FROM adstxt_entries_store_apps
WHERE
    ad_domain_url = :ad_domain_url
    AND publisher_id = :publisher_id;
