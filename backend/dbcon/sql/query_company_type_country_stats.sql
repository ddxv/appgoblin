SELECT
    country,
    SUM(company_count) AS company_count
FROM
    frontend.category_type_country_stats
WHERE
    type_url_slug = :type_url_slug
    AND country IS NOT NULL
    AND country != ''
    AND (cast(:app_category AS TEXT) IS NULL OR app_category = :app_category)
GROUP BY
    country
ORDER BY
    company_count DESC;
