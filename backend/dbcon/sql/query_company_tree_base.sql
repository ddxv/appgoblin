-- Query 1: If no company mapping returns nothing 
-- Queried domain, company_id, parent_id and is_secondary_domain
SELECT
    c.id AS company_id,
    c.name AS company_name,
    c.logo_url AS company_logo_url,
    cd.domain_name AS company_domain,
    pc.id AS parent_id,
    pc.name AS parent_name,
    pc.logo_url AS parent_logo_url,
    pd.domain_name AS parent_domain,
    -- Was the match on a secondary domain (not the primary)?
    (cd.domain_name != :queried_domain) AS is_secondary_domain
FROM domains AS d
INNER JOIN adtech.company_domain_mapping AS cdm ON d.id = cdm.domain_id
INNER JOIN adtech.companies AS c ON cdm.company_id = c.id
INNER JOIN domains AS cd ON c.domain_id = cd.id
LEFT JOIN adtech.companies AS pc ON c.parent_company_id = pc.id
LEFT JOIN domains AS pd ON pc.domain_id = pd.id
WHERE d.domain_name = :queried_domain;
