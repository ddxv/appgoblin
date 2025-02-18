WITH user_requests AS (
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

SELECT
    ur.store_id,
    ur.sdk_crawled_at,
    sa.name,
    sa.category,
    sa.store,
    sa.installs,
    sa.rating_count,
    sa.icon_url_512
FROM
    user_requests AS ur
LEFT JOIN store_apps AS sa
    ON
        ur.store_id = sa.store_id
ORDER BY
    ur.sdk_crawled_at DESC
LIMIT 20;
