SELECT
    c.alpha2 AS country,
    sc.collection,
    sca.category,
    min(sarw.best_rank) AS best_rank
FROM
    frontend.store_app_ranks_weekly AS sarw
LEFT JOIN store_apps AS sa
    ON
        sarw.store_app = sa.id
LEFT JOIN store_collections AS sc
    ON
        sarw.store_collection = sc.id
LEFT JOIN store_categories AS sca
    ON
        sarw.store_category = sca.id
LEFT JOIN countries AS c ON sarw.country = c.id
WHERE
    sarw.crawled_date >= :start_date
    AND sa.store_id = :store_id
GROUP BY c.alpha2, sc.collection, sca.category
ORDER BY sarw.best_rank ASC;
