SELECT
    store_id,
    store_last_updated
FROM
    store_apps
WHERE
    crawl_result = 1
    AND installs > 100000
    OR rating_count > 10000
ORDER BY
    GREATEST(
        COALESCE(
            installs,
            0
        ),
        COALESCE(
            CAST(
                rating_count AS bigint
            ),
            0
        ) * 50
    ) DESC;
