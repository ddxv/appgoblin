SELECT
    relationship,
    store,
    publisher_id_count,
    developer_count,
    app_count
FROM
    adstxt_ad_domain_overview aado
WHERE
    ad_domain_url = :ad_domain_url
;
