WITH user_requests AS (
    SELECT DISTINCT ON
    (urs.store_id)
        urs.store_id,
        MAX(urs.created_at) AS requested_at
    FROM
        user_requested_scan AS urs
    GROUP BY
        urs.store_id
    ORDER BY
        urs.store_id ASC,
        requested_at DESC
),

latest_version_codes AS (
    SELECT DISTINCT ON
    (version_codes.store_app)
        version_codes.id,
        version_codes.store_app,
        version_codes.version_code,
        version_codes.updated_at,
        version_codes.crawl_result
    FROM
        version_codes
    ORDER BY
        version_codes.store_app ASC,
        version_codes.updated_at DESC,
        STRING_TO_ARRAY(
            version_codes.version_code,
            '.'
        )::bigint [] DESC
)

SELECT
    ur.store_id,
    ur.requested_at,
    sa.name,
    sa.store,
    sa.installs,
    sa.rating_count,
    CASE
        WHEN sa.icon_url_100 IS NOT NULL
            THEN
                CONCAT(
                    'https://media.appgoblin.info/app-icons/',
                    sa.store_id,
                    '/',
                    sa.icon_url_100
                )
        ELSE sa.icon_url_512
    END AS app_icon_url,
    CASE
        WHEN lvc.updated_at < ur.requested_at THEN NULL
        ELSE lvc.updated_at
    END AS app_scanned_at,
    CASE
        WHEN lvc.updated_at < ur.requested_at THEN NULL
        ELSE cr.outcome
    END AS crawl_result
FROM
    user_requests AS ur
LEFT JOIN store_apps AS sa
    ON
        ur.store_id = sa.store_id
LEFT JOIN latest_version_codes AS lvc
    ON
        sa.id = lvc.store_app
LEFT JOIN crawl_results AS cr
    ON
        lvc.crawl_result = cr.id
ORDER BY
    ur.requested_at DESC
LIMIT 20;
