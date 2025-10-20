SELECT
    advertiser_name,
    advertiser_store_id,
        CASE
  WHEN advertiser_icon_url_100 IS NOT NULL
    THEN CONCAT('https://media.appgoblin.info/app-icons/', advertiser_store_id, '/', advertiser_icon_url_100)
  ELSE advertiser_icon_url_512
END AS advertiser_icon_url,
    advertiser_category,
    advertiser_installs,
    rating,
    rating_count,
    installs_sum_1w,
    installs_sum_4w,
    unique_creatives,
    unique_publishers,
    first_seen,
    last_seen,
    file_types,
    avg_publisher_installs,
    top_md5_hashes,
    mmp_domains,
    ad_network_domains
FROM frontend.advertiser_creative_rankings;
