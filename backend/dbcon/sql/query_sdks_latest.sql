WITH users_top_apps AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY
                store,
                crawl_result
            ORDER BY
                sdk_crawled_at DESC
        ) AS my_rank
    FROM
        frontend.latest_sdk_scanned_apps
)

SELECT *
FROM
    users_top_apps
WHERE
    crawl_result = 1
    AND my_rank <= 20
UNION ALL
SELECT *
FROM
    users_top_apps
WHERE
    crawl_result != 1
    AND my_rank <= 20;
