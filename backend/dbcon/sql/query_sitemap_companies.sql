SELECT
    app_category,
    company_domain,
    type_url_slug,
    sum(app_count) AS app_count
FROM
    frontend.companies_category_tag_type_stats
WHERE
    app_count > 2
GROUP BY
    app_category,
    company_domain,
    type_url_slug
ORDER BY
    sum(app_count) DESC;
