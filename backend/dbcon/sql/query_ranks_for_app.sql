SELECT
    sar.crawled_date,
    c.alpha2 AS country,
    sar.rank,
    sar.collection,
    sar.category
FROM
    store_apps_rankings AS sar
LEFT JOIN countries AS c
    ON sar.country = c.id
WHERE
    sar.store_id = :store_id
    AND c.alpha2 = :country
    AND sar.crawled_date >= :start_date;
