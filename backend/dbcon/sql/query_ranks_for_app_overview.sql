WITH myrankings AS (
    SELECT
        sa.store_id,
        sar.crawled_date,
        c.alpha2 AS country,
        sar.store_collection,
        sar.store_category,
        sar.rank AS current_rank,
        MIN(sar.rank) OVER (
            PARTITION BY
                c.alpha2,
                sar.store_collection,
                sar.store_category
        ) AS best_rank,
        ROW_NUMBER() OVER (
            PARTITION BY
                c.alpha2,
                sar.store_collection,
                sar.store_category
            ORDER BY
                sar.crawled_date DESC
        ) AS orderedrow
    FROM
        frontend.store_apps_rankings AS sar
    LEFT JOIN countries AS c
        ON
            sar.country = c.id
    LEFT JOIN store_apps AS sa
        ON
            sar.store_app = sa.id
    WHERE
        sa.store_id = :store_id
        AND sar.crawled_date >= :start_date
)

SELECT
    mr.store_id,
    mr.crawled_date,
    mr.country,
    sc.collection,
    sca.category,
    mr.current_rank,
    mr.best_rank
FROM
    myrankings AS mr
LEFT JOIN store_collections AS sc
    ON
        mr.store_collection = sc.id
LEFT JOIN store_categories AS sca
    ON
        mr.store_category = sca.id
WHERE
    mr.orderedrow = 1
