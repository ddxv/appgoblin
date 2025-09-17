WITH latest_crawled_date AS (
    SELECT max(arr.crawled_date) AS crawled_date
    FROM frontend.store_app_ranks_weekly AS arr
    INNER JOIN countries AS c ON arr.country = c.id
    WHERE arr.store_collection = :collection_id AND c.alpha2 = :country
)

SELECT
    ar.rank,
    sa.name,
    sa.store_id,
    sa.icon_url_100,
    sa.icon_url_512
FROM
    frontend.store_app_ranks_weekly AS ar
INNER JOIN latest_crawled_date AS lcd ON ar.crawled_date = lcd.crawled_date
INNER JOIN countries AS c ON ar.country = c.id
LEFT JOIN store_apps AS sa ON ar.store_app = sa.id
WHERE
    ar.store_collection = :collection_id
    AND ar.store_category = :category_id
    AND c.alpha2 = :country
LIMIT :mylimit;
