SELECT
    relationship,
    store,
    publisher_id,
    developer_count,
    app_count
FROM frontend.adstxt_publishers_overview
WHERE
    ad_domain_url = :ad_domain_url
    AND (publisher_id = :publisher_id OR :publisher_id IS NULL)
    AND pubrank <= :pubrank_limit
ORDER BY store, pubrank;
