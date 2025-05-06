SELECT
    c.name AS company_name,
    saac.tld_url,
    saac.url
FROM
    store_app_api_calls AS saac
LEFT JOIN store_apps AS sa ON saac.store_app = sa.id
LEFT JOIN ad_domains AS ad ON saac.tld_url = ad.domain
LEFT JOIN adtech.company_domain_mapping AS cdm ON ad.id = cdm.domain_id
LEFT JOIN adtech.companies AS c ON cdm.company_id = c.id
WHERE
    sa.store_id = :store_id;
