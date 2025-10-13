SELECT
    store_id,
    store_last_updated
FROM
    frontend.store_apps_overview
WHERE
    crawl_result = 1
    AND (store = 1 and installs > 20000000 AND (ad_creative_count > 0 OR ad_mon_creatives > 0))
    OR (store = 2 and rating_count > 20000 AND sdk_successful_last_crawled  IS NOT NULL) 
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
        ) * 100
    ) DESC
;
