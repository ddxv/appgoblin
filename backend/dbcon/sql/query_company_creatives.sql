SELECT DISTINCT ON (last_seen, advertiser_store_id)
    company_domain,
    advertiser_name,
    publisher_name,
    store,
    md5_hash,
    file_extension,
    publisher_store_id,
    advertiser_store_id,
    installs,
    rating_count,
    rating,
    installs_sum_1w,
    installs_sum_4w,
    last_seen,
    advertiser_icon_url,
    publisher_icon_url
FROM frontend.companies_creative_rankings_new
WHERE company_domain = :company_domain
ORDER BY last_seen DESC, advertiser_store_id ASC
LIMIT 6;
