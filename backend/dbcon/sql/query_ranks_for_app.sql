SELECT
    sar.crawled_date,
    c.alpha2 AS country,
    sar.store,
    sar.rank,
    sar.collection,
    sar.category
FROM
    store_apps_rankings AS sar
LEFT JOIN countries AS c
    ON sar.country = c.id
WHERE
    sar.store_id = :store_id
    AND
    sar.crawled_date >= :start_date;
