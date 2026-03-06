SELECT
    store,
    app_category,
    company_domain,
    company_name,
    app_count,
    installs_d30,
    installs_total
FROM frontend.companies_parent_category_stats
WHERE company_domain = :company_domain;
