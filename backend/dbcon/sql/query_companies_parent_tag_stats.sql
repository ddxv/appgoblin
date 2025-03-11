SELECT
    company_domain,
    company_name,
    store,
    'all' AS app_category,
    tag_source,
    sum(app_count) AS app_count,
    sum(installs_d30) AS installs_d30,
    sum(rating_count_d30) AS rating_count_d30
FROM
    frontend.companies_parent_category_tag_stats
GROUP BY company_domain, company_name, store, tag_source;
