SELECT
    store,
    app_category,
    company_domain,
    company_name,
    app_count,
    installs_total,
    installs_d30
FROM frontend.companies_category_stats
WHERE company_domain = :company_domain;
