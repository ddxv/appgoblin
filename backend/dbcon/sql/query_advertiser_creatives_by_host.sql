SELECT
    ac.run_at AS created_at,
    ac.ad_domain,
    ac.host_domain_company_name,
    ac.pub_store_id,
    ac.pub_name,
    ac.vhash,
    ac.md5_hash,
    ac.file_extension,
    ac.adv_store_id,
    ac.mmp_domain
FROM
    frontend.advertiser_creatives AS ac
WHERE
    ac.host_domain_company_domain = :host_domain OR ac.host_domain = :host_domain OR ac.ad_domain = :host_domain OR ac.ad_domain_company_domain = :host_domain;
