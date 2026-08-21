SELECT
    ad.domain_name AS company_domain,
    c.logo_url AS company_logo_url
FROM adtech.companies AS c
LEFT JOIN domains AS ad ON c.domain_id = ad.id;
