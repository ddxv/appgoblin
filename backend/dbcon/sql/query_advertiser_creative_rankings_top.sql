SELECT
    advertiser_name,
    advertiser_store_id,
    advertiser_icon_url_100,
    advertiser_icon_url_512,
    unique_creatives,
    unique_publishers,
    first_seen,
    last_seen,
    file_types,
    avg_publisher_installs,
    top_md5_hashes
FROM frontend.advertiser_creative_rankings_recent_month
LIMIT 10;
