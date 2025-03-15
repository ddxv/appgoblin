SELECT
    cao.store_id,
    sa.store,
    sa.name AS app_name,
    cao.category_slug,
    cao.company_domain,
    cao.company_name
FROM
    frontend.companies_apps_overview AS cao
LEFT JOIN 
    store_apps AS sa
ON
    cao.store_id = sa.store_id
WHERE
    cao.store_id IN :store_ids
;