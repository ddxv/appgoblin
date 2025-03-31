WITH
parent_companies AS (
    SELECT DISTINCT
        pc.id,
        pc.name
    FROM
        adtech.companies AS pc
    LEFT JOIN adtech.companies AS c
        ON
            pc.id = c.parent_company_id
    WHERE
        c.id IS NOT NULL
)

SELECT
    pc.id,
    ad.domain
FROM
    parent_companies AS pc
LEFT JOIN adtech.company_domain_mapping AS cdm
    ON
        pc.id = cdm.company_id
LEFT JOIN ad_domains AS ad ON
    cdm.domain_id = ad.id;
