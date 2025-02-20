SELECT
    company_domain,
    store,
    app_category,
    tag_source,
    COALESCE(company_name, company_domain) AS company_name,
    SUM(app_count) AS app_count
FROM
    frontend.companies_parent_app_counts
WHERE
    app_category LIKE :app_category
GROUP BY company_domain, company_name, store, app_category, tag_source;
