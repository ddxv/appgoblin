SELECT
    cso.company_name,
    cso.sdk_name,
    cso.package_pattern,
    cso.path_pattern,
    cso.parent_company_name
FROM
    frontend.companies_sdks_overview AS cso
WHERE
    cso.company_domain = :company_domain
    OR cso.parent_company_domain = :company_domain;
