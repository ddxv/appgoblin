WITH myrankings AS (
    SELECT
        sar.store_id,
        sar.crawled_date,
        c.alpha2 AS country,
        sar.collection,
        sar.category,
        sar."rank" AS current_rank,
        MIN(sar.rank) OVER (
            PARTITION BY c.alpha2,
            sar.collection,
            sar.category
        ) AS best_rank,
        ROW_NUMBER() OVER (
            PARTITION BY c.alpha2,
            sar.collection,
            sar.category
        ORDER BY
            sar.crawled_date DESC
        ) AS orderedrow
    FROM
        store_apps_rankings AS sar
    LEFT JOIN countries AS c
        ON
        sar.country = c.id
    WHERE
        sar.store_id = :store_id
        AND sar.crawled_date >= :start_date
)
SELECT
    store_id,
    crawled_date,
    country,
    collection,
    category,
    current_rank,
    best_rank
FROM
    myrankings
WHERE
    orderedrow = 1
;
