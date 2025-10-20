SELECT
    rank,
    name,
    store_id,
    store,
    installs,
    rating_count,
    rating,
    review_count,
    installs_sum_1w,
    installs_sum_4w,
    ratings_sum_1w,
    ratings_sum_4w,
    icon_url_100,
    CASE
        WHEN icon_url_100 IS NOT NULL
            THEN
                CONCAT(
                    'https://media.appgoblin.info/app-icons/',
                    store_id,
                    '/',
                    icon_url_100
                )
        ELSE icon_url_512
    END AS app_icon_url
FROM
    frontend.store_app_ranks_latest
WHERE
    store_collection = :collection_id
    AND store_category = :category_id
    AND country = :country
ORDER BY rank ASC
LIMIT :mylimit;
