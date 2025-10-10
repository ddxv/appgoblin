SELECT DISTINCT
    c.name AS company_name,
    cad.domain_name AS company_domain,
    c.logo_url AS company_logo_url,
    subad.domain_name AS sub_domain,
    pc.logo_url AS parent_company_logo_url,
    COALESCE(
        pc.name,
        c.name,
        ad.domain_name
    ) AS parent_company_name,
    COALESCE(paad.domain_name, cad.domain_name) AS parent_company_domain
FROM
    domains AS ad
LEFT JOIN adtech.company_domain_mapping AS cdm
    ON
        ad.id = cdm.domain_id
LEFT JOIN adtech.companies AS c
    ON
        cdm.company_id = c.id
LEFT JOIN domains AS cad
    ON
        c.domain_id = cad.id
LEFT JOIN adtech.companies AS pc
    ON
        c.parent_company_id = pc.id
LEFT JOIN domains AS paad
    ON
        pc.domain_id = paad.id
LEFT JOIN adtech.company_domain_mapping AS subcdm
    ON
        c.id = subcdm.company_id
LEFT JOIN domains AS subad
    ON
        subcdm.domain_id = subad.id
WHERE
    ad.domain_name = :company_domain
    OR
    cad.domain_name = :company_domain
    OR paad.domain_name = :company_domain;
