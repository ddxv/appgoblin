SELECT
    acmh.snapshot_date,
    c.alpha2 AS country,
    acmh.rating,
    acmh.rating_count,
    acmh.review_count,
    acmh.one_star,
    acmh.two_star,
    acmh.three_star,
    acmh.four_star,
    acmh.five_star
FROM app_country_metrics_history AS acmh
INNER JOIN store_apps AS sa ON acmh.store_app = sa.id
INNER JOIN countries AS c ON acmh.country_id = c.id
WHERE
    sa.store_id = :store_id
    AND acmh.snapshot_date >= CURRENT_DATE - INTERVAL '375 days'
ORDER BY acmh.snapshot_date;
