SELECT
    agmh.snapshot_date,
    agmh.installs,
    agmh.rating,
    agmh.rating_count,
    agmh.review_count,
    agmh.one_star,
    agmh.two_star,
    agmh.three_star,
    agmh.four_star,
    agmh.five_star
FROM app_global_metrics_history AS agmh
WHERE
    agmh.store_app = :store_app
    AND agmh.snapshot_date >= CURRENT_DATE - INTERVAL '375 days';
