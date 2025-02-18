WITH apps AS (
    SELECT DISTINCT ON
    (urs.store_id)
        urs.store_id,
        MAX(urs.created_at) AS sdk_crawled_at
    FROM
        user_requested_scan AS urs
    WHERE
        urs.created_at <= CURRENT_DATE - INTERVAL '12 hours'
    GROUP BY
        urs.store_id
    ORDER BY
        urs.store_id ASC,
        sdk_crawled_at DESC
)

SELECT *
FROM
    apps AS a
LEFT JOIN store_apps AS sa
    ON
        a.store_id = sa.store_id
ORDER BY
    a.sdk_crawled_at DESC
LIMIT 20;
