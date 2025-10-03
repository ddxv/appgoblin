SELECT
    country,
    collection,
    category,
    best_rank
FROM
    frontend.store_app_ranks_best_monthly
WHERE
    store_id = :store_id
;

