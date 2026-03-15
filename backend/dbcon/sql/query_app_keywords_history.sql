SELECT
    crawled_date,
    store,
    country,
    keyword_id,
    store_app,
    app_rank
FROM
    frontend.app_keyword_ranks_daily
WHERE
    store_app = :store_app_id
    AND keyword_id IN :keyword_ids
    AND crawled_date >= :start_date
ORDER BY
    crawled_date DESC;
