SELECT DISTINCT ON (advertiser_store_id)
    company_domain,
    md5_hash,
    file_extension,
    advertiser_store_id,
    icon_url_512,
    last_seen
FROM frontend.companies_creative_rankings
WHERE company_domain = :company_domain
ORDER BY advertiser_store_id ASC, last_seen DESC
LIMIT 5;
