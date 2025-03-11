SELECT
    company_domain,
    company_name,
    store,
    'all' AS app_category,
    tag_source,
    sum(app_count) AS app_count
FROM
    frontend.companies_parent_category_tag_stats
GROUP BY company_domain, company_name, store, tag_source;
