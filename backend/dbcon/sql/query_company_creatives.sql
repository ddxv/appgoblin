SELECT DISTINCT ON (last_seen, advertiser_store_id)
    company_domain,
    advertiser_name AS name,
    store,
    md5_hash,
    file_extension,
    advertiser_store_id,
    installs,
    rating_count,
    rating,
    installs_sum_1w,
    installs_sum_4w,
    last_seen,
    CASE
        WHEN icon_url_100 IS NOT NULL
            THEN
                CONCAT(
                    'https://media.appgoblin.info/app-icons/',
                    advertiser_store_id,
                    '/',
                    icon_url_100
                )
        ELSE icon_url_512
    END AS advertiser_icon_url
FROM frontend.companies_creative_rankings
WHERE company_domain = :company_domain
ORDER BY last_seen DESC, advertiser_store_id ASC
LIMIT 6;
