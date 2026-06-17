SELECT
    domain_name AS company_domain,
    domain_name AS company_name,
    store,
    app_category,
    COALESCE(SUM(app_count), 0) AS app_count,
    COALESCE(SUM(installs_d30), 0) AS installs_d30,
    COALESCE(SUM(installs_total), 0) AS installs_total
FROM
    frontend.companies_secondary_domain_category_tag_stats
WHERE
    domain_name = :company_domain
GROUP BY
    store, app_category, domain_name;
