WITH all_devs AS (
    SELECT
        store,
        store_app,
        developer_name,
        developer_url,
        developer_store,
        domain_id,
        developer_id,
        'by_id' AS match_type
    FROM
        developer_store_apps
    WHERE
        developer_id = :developer_id
    UNION
    SELECT
        dsa.store,
        dsa.store_app,
        dsa.developer_name,
        dsa.developer_url,
        dsa.developer_store,
        dsa.domain_id,
        dsa.developer_id,
        'by_url' AS match_type
    FROM
        developer_store_apps AS dsa
    INNER JOIN (
        SELECT DISTINCT domain_id
        FROM
            developer_store_apps
        WHERE
            developer_id = :developer_id
    ) AS domains
        ON
            dsa.domain_id = domains.domain_id
)

SELECT
    dv.store,
    dv.developer_name,
    dv.developer_url,
    dv.developer_store,
    dv.developer_id,
    sa.store_id,
    sa.name,
    sa.rating,
    sa.installs,
    sa.rating_count,
    sa.icon_url_100,
    sa.icon_url_512,
    sa.featured_image_url,
    sa.tablet_image_url_1,
    sa.category AS app_category,
    dv.match_type
FROM
    all_devs AS dv
LEFT JOIN frontend.store_apps_overview AS sa ON dv.store_app = sa.id;
