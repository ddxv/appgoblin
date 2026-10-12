SELECT DISTINCT
    cso.sdk_id,
    cso.sdk_slug,
    cso.company_name,
    cso.company_domain,
    cso.parent_company_domain,
    cso.parent_company_name,
    cso.sdk_name,
    cso.app_count
FROM frontend.companies_sdks_overview AS cso
WHERE cso.sdk_slug = :sdk_slug
ORDER BY cso.app_count DESC NULLS LAST;
