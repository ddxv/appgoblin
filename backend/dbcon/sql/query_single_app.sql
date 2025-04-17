SELECT
    id,
    name,
    store_id,
    store,
    category,
    rating,
    rating_count,
    review_count,
    installs,
    installs_sum_1w,
    installs_sum_4w,
    ratings_sum_1w,
    ratings_sum_4w,
    installs_z_score_2w,
    rating_z_score_2w,
    installs_z_score_4w,
    rating_z_score_4w,
    store_last_updated,
    created_at,
    updated_at,
    crawl_result,
    icon_url_512,
    release_date,
    featured_image_url,
    phone_image_url_1,
    phone_image_url_2,
    phone_image_url_3,
    tablet_image_url_1,
    tablet_image_url_2,
    tablet_image_url_3,
    description,
    description_short,
    developer_id,
    developer_name,
    developer_url,
    adstxt_last_crawled,
    adstxt_crawl_result,
    ad_supported,
    in_app_purchases,
    version_code,
    sdk_last_crawled,
    sdk_crawl_result,
    sdk_successful_last_crawled
FROM
    frontend.store_apps_overview_old
WHERE
    store_id = :store_id;
