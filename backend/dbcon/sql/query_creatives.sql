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
    mmp_name,
    mmp_domain,
    mmp_urls,
    additional_ad_domain_urls,
    CASE
        WHEN pub_icon_url_100 IS NOT NULL
            THEN
                CONCAT(
                    'https://media.appgoblin.info/app-icons/',
                    pub_store_id,
                    '/',
                    pub_icon_url_100
                )
        ELSE pub_icon_url_512
    END AS pub_icon_url,
    CASE
        WHEN adv_icon_url_100 IS NOT NULL
            THEN
                CONCAT(
                    'https://media.appgoblin.info/app-icons/',
                    adv_store_id,
                    '/',
                    adv_icon_url_100
                )
        ELSE adv_icon_url_512
    END AS adv_icon_url
FROM frontend.advertiser_creatives
WHERE
    (advertiser_store_id = :advertiser_store_id OR :advertiser_store_id IS NULL) AND (pub_store_id = :pub_store_id OR :pub_store_id IS NULL);
