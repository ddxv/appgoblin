WITH mytree AS (
    SELECT
        c.name AS company_name,
        ad.domain AS company_domain,
        COALESCE(
            parad.domain,
            ad.domain
        ) AS parent_company_domain,
        COALESCE(
            pc.name,
            c.name,
            ad.domain
        ) AS parent_company_name
    FROM
        adtech.companies AS c
    LEFT JOIN adtech.companies AS pc
        ON
            c.parent_company_id = pc.id
    FULL OUTER JOIN ad_domains AS ad
        ON
            c.domain_id = ad.id
    LEFT JOIN ad_domains AS parad
        ON
            pc.domain_id = parad.id
)

SELECT *
FROM
    mytree
WHERE
    company_domain = :company_domain
    OR parent_company_domain = :company_domain;
