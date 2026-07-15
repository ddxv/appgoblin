SELECT
    company_domain,
    company_name,
    type_url_slug,
    sum(app_count) AS app_count,
    sum(installs_d30) AS installs_d30
FROM
    frontend.companies_category_tag_type_stats
WHERE
    app_count > 2 AND (company_name IS NOT NULL OR installs_d30 > 10000000)
GROUP BY
    company_domain,
     company_name,
    type_url_slug
;
