SELECT
    ad.domain_name AS company_domain,
    COALESCE(c.logo_url, pc.logo_url) AS company_logo_url
FROM adtech.companies AS c
LEFT JOIN domains AS ad ON c.domain_id = ad.id
LEFT JOIN adtech.companies AS pc ON c.parent_company_id = pc.id
;