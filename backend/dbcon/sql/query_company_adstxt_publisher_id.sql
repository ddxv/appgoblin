SELECT *
FROM adstxt_entries_store_apps
WHERE
    ad_domain_url = :ad_domain_url
    AND publisher_id = :publisher_id;
