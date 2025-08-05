SELECT
    run_id,
    run_at,
    pub_name,
    pub_store_id,
    host_domain,
    host_domain_company_domain,
    host_domain_company_name,
    ad_domain,
    ad_domain_company_domain,
    ad_domain_company_name,
    md5_hash,
    file_extension
FROM frontend.advertiser_creatives
WHERE advertiser_store_id = :store_id;
