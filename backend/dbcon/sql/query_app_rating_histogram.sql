SELECT
    agmh.snapshot_date,
    agmh.one_star,
    agmh.two_star,
    agmh.three_star,
    agmh.four_star,
    agmh.five_star
FROM app_global_metrics_history AS agmh
LEFT JOIN store_apps AS sa ON agmh.store_app = sa.id
WHERE sa.store_id = :store_id
ORDER BY agmh.snapshot_date DESC
LIMIT 1;
