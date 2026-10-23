SELECT DISTINCT
    cso.company_domain,
    cso.sdk_slug
FROM frontend.store_apps_overview AS sa
INNER JOIN adtech.app_sdks AS asd
    ON asd.store_app = sa.id
INNER JOIN frontend.companies_sdks_overview AS cso
    ON cso.sdk_id = asd.sdk_id
WHERE sa.store_id = :store_id
  AND cso.company_domain IS NOT NULL
  AND cso.sdk_slug IS NOT NULL
ORDER BY cso.company_domain, cso.sdk_slug;
