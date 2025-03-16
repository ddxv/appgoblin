SELECT
    cao.store_id,
    sa.store,
    sa.name AS app_name,
    cao.category_slug,
    cao.company_domain,
    cao.company_name,
    cosp.percent_open_source 
FROM
    frontend.companies_apps_overview AS cao
LEFT JOIN 
    frontend.store_apps_overview AS sa
ON
    cao.store_id = sa.store_id
LEFT JOIN frontend.companies_open_source_percent cosp 
ON
    cao.company_domain = cosp.company_domain
WHERE
    cao.store_id IN :store_ids
;