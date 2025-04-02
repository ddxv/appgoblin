SELECT
    company_domain,
    company_name,
    store,
    'all' AS app_category,
    tag_source,
    COALESCE(sum(app_count), 0) AS app_count,
    COALESCE(sum(installs_d30), 0) AS installs_d30,
    COALESCE(sum(rating_count_d30), 0) AS rating_count_d30
FROM
    frontend.companies_category_tag_stats
GROUP BY company_domain, company_name, store, tag_source;
