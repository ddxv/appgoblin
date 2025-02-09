WITH top_apps AS (
    -- First identify all apps that were ever in top 10 during the period
    SELECT DISTINCT ar.store_id
    FROM frontend.app_rankings_latest_by_week AS ar
    WHERE
        ar.store = ar.:store
        AND ar.store_collection = ar.:collection_id
        AND ar.store_category = ar.:category_id
        AND ar.country = ar.:country
        AND ar.crawled_date >= ar.:start_date
        AND ar.rank <= ar.:mylimit
)

SELECT
    ar.crawled_date,
    ar.rank,
    ar.name,
    ar.store_id
FROM frontend.app_rankings_latest_by_week AS ar
INNER JOIN top_apps AS ta
    ON ar.store_id = ta.store_id
WHERE
    ar.store = :store
    AND ar.store_collection = :collection_id
    AND ar.store_category = :category_id
    AND ar.country = :country
    AND ar.crawled_date >= :start_date
ORDER BY
    ar.store_id ASC,
    ar.crawled_date DESC;
