SELECT
    run_id,
    run_at,
    pub_name,
    adv_name,
    pub_store_id,
    adv_store_id,
    host_domain,
    host_domain_company_domain,
    host_domain_company_name,
    ad_domain,
    ad_domain_company_domain,
    ad_domain_company_name,
    vhash,
    md5_hash,
    file_extension,
    pub_icon_url_512,
    adv_icon_url_512,
    mmp_name,
    mmp_domain,
    mmp_urls,
    additional_ad_domain_urls
FROM frontend.advertiser_creatives
WHERE
    (advertiser_store_id = :advertiser_store_id OR :advertiser_store_id IS NULL) AND (pub_store_id = :pub_store_id OR :pub_store_id IS NULL);
