-- Optimized query: JOIN store_apps first to filter early, use INNER JOIN
SELECT
    c.alpha2 AS country,
    sc.collection,
    sca.category,
    min(sarw.best_rank) AS best_rank
FROM
    frontend.store_apps_overview AS sa
INNER JOIN frontend.store_app_ranks_weekly AS sarw
    ON sarw.store_app = sa.id
    AND sarw.crawled_date >= :start_date
LEFT JOIN store_collections AS sc
    ON sarw.store_collection = sc.id
LEFT JOIN store_categories AS sca
    ON sarw.store_category = sca.id
LEFT JOIN countries AS c 
    ON sarw.country = c.id
WHERE
    sa.store_id = :store_id
GROUP BY c.alpha2, sc.collection, sca.category
ORDER BY best_rank ASC;
