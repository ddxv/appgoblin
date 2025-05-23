WITH
child_companies AS (
    SELECT DISTINCT
        c.id,
        c.name,
        c.domain_id
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
LEFT JOIN ad_domains AS ad ON
    cc.domain_id = ad.id;
