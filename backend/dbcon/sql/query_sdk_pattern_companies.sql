SELECT
    c.name AS company_name,
    ad.domain AS company_domain
FROM
    adtech.sdk_packages AS sp
LEFT JOIN adtech.sdks AS sd
    ON
        sp.sdk_id = sd.id
LEFT JOIN adtech.companies AS c
    ON
        sd.company_id = c.id
LEFT JOIN ad_domains AS ad
    ON
        c.domain_id = ad.id
WHERE
    sp.package_pattern LIKE :value_pattern || '%'
    OR :value_pattern ILIKE sp.package_pattern || '%';
