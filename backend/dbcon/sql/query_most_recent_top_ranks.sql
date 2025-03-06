SELECT
    ar.rank,
    sa.name,
    sa.store_id,
    sa.icon_url_512
FROM
    app_rankings AS ar
LEFT JOIN
    store_apps AS sa ON ar.store_app = sa.id
LEFT JOIN
    countries AS c ON ar.country = c.id
WHERE
    ar.crawled_date
    = (
        SELECT max(arr.crawled_date)
        FROM app_rankings AS arr
        LEFT JOIN countries AS c ON arr.country = c.id
        WHERE
            arr.store_collection = :collection_id
            AND c.alpha2 = :country
    )
    AND ar.store_collection = :collection_id
    AND ar.store_category = :category_id
    AND c.alpha2 = :country
LIMIT :mylimit;
