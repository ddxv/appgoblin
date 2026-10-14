SELECT DISTINCT
    cso.sdk_id,
    cso.sdk_slug,
    cso.sdk_name,
    cso.pattern_type,
    cso.pattern_value,
    cso.app_count
FROM frontend.companies_sdks_overview AS cso
WHERE cso.sdk_slug = :sdk_slug
ORDER BY
    cso.pattern_type ASC, cso.app_count DESC NULLS LAST, cso.pattern_value ASC;
