SELECT
    store,
    tag_source,
    app_category,
    type_url_slug,
    app_count,
    installs_d30
FROM
    frontend.category_tag_type_stats
WHERE
    type_url_slug = :type_url_slug;
