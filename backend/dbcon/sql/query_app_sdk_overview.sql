SELECT
    cao.company_name,
    cao.company_domain,
    cao.category_slug
FROM
    companies_apps_overview AS cao
WHERE
    cao.store_id = :store_id