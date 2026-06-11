SELECT
    store,
    tag_source,
    app_category,
    COUNT(DISTINCT company_domain) AS company_count
FROM frontend.companies_category_tag_stats
WHERE
    store IN (1, 2)
    AND (
        CAST(:app_category AS text) IS NULL
        OR app_category LIKE :app_category
    )
GROUP BY store, tag_source, app_category
