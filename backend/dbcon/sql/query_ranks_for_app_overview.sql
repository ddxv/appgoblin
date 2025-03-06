WITH myrankings AS (
    SELECT
        sar.crawled_date,
        c.alpha2 AS country,
        sar.store_collection,
        sar.store_category,
        sar.rank,
        ROW_NUMBER() OVER (
            PARTITION BY
                c.alpha2,
                sar.store_collection,
                sar.store_category
            ORDER BY
                sar.rank ASC,
                sar.crawled_date DESC
        ) AS row_num
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
    mr.crawled_date,
    mr.country,
    sc.collection,
    sca.category,
    mr.rank AS best_rank
FROM
    myrankings AS mr
LEFT JOIN store_collections AS sc
    ON
        mr.store_collection = sc.id
LEFT JOIN store_categories AS sca
    ON
        mr.store_category = sca.id
WHERE
    row_num = 1
ORDER BY
    best_rank,
    crawled_date;
