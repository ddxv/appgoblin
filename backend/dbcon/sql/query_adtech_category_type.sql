SELECT *
FROM
    frontend.companies_categories_types_app_counts
WHERE
    type_url_slug = :type_slug
    AND (app_category LIKE :app_category OR :app_category IS NULL);
