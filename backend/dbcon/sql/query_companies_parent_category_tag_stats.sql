SELECT
    company_domain,
    store,
    app_category,
    tag_source,
    COALESCE(company_name, company_domain) AS company_name,
    SUM(app_count) AS app_count,
    SUM(installs_d30) AS installs_d30,
    SUM(rating_count_d30) AS rating_count_d30
FROM
    frontend.companies_parent_category_tag_stats
WHERE
    app_category LIKE :app_category
GROUP BY company_domain, company_name, store, app_category, tag_source;
