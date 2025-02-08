SELECT
    ar.rank,
    sa.name,
    sa.store_id,
    sa.icon_url_512
FROM
    app_rankings AS ar
LEFT JOIN
    stores AS s
    ON ar.store = s.id
LEFT JOIN
    store_apps AS sa ON ar.store_app = sa.id
LEFT JOIN
    countries AS c ON ar.country = c.id
WHERE
    ar.crawled_date
    = (
        SELECT max(arr.crawled_date)
        FROM app_rankings AS arr
        WHERE arr.store = :store
    )
    AND ar.store = :store
    AND ar.store_collection = :collection_id
    AND ar.store_category = :category_id
    AND c.alpha2 = :country
LIMIT :mylimit;
