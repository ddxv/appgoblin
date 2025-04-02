WITH
child_companies AS (
    SELECT DISTINCT
        c.id,
        c.name
    FROM
        adtech.companies AS c
    WHERE
        c.parent_company_id IS NOT NULL
)
SELECT
    cc.id,
    ad.domain
FROM
    child_companies AS cc
LEFT JOIN adtech.company_domain_mapping AS cdm
    ON
        cc.id = cdm.company_id
LEFT JOIN ad_domains AS ad ON
    cdm.domain_id = ad.id;
