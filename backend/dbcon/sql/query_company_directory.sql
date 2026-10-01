SELECT
    id AS company_id,
    name
FROM adtech.companies
WHERE name IS NOT NULL
ORDER BY name;