SELECT
    c.id AS company_id,
    c.name AS company_name,
    ad.domain_name AS company_domain
FROM domains AS qd
LEFT JOIN adtech.company_domain_mapping AS cdm
    ON qd.id = cdm.domain_id
LEFT JOIN adtech.companies AS c
    ON cdm.company_id = c.id
LEFT JOIN domains AS ad
    ON c.domain_id = ad.id
WHERE qd.domain_name = :company_domain
ORDER BY
    CASE WHEN ad.domain_name = :company_domain THEN 0 ELSE 1 END,
    c.id
LIMIT 1;
