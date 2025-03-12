SELECT
    cao.store_id,
    cao.category_slug,
    cao.company_domain,
    cao.company_name
FROM
    frontend.companies_apps_overview AS cao
WHERE
    cao.store_id IN :store_ids
;