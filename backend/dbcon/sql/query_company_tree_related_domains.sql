-- Query 2 All domains for the company AND its children
SELECT
    c.id AS company_id,
    c.name AS company_name,
    d.domain_name,
    c.logo_url AS company_logo,
    (c.domain_id = d.id) AS is_primary
FROM adtech.company_domain_mapping AS cdm
INNER JOIN domains AS d ON cdm.domain_id = d.id
INNER JOIN adtech.companies AS c ON cdm.company_id = c.id
WHERE
    cdm.company_id = :company_id          -- the company itself
    OR (c.parent_company_id = :company_id AND :is_parent); -- all its children
