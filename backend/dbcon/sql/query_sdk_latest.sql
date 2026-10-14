WITH latest_app_sdks AS (
    SELECT DISTINCT ON (asd.store_app)
        asd.store_app,
        asd.sdk_id,
        asd.version_code_id,
        asd.version_code_created_at
    FROM adtech.app_sdks AS asd
    WHERE asd.sdk_id = :sdk_id
    ORDER BY asd.store_app ASC, asd.version_code_id DESC NULLS LAST
)

SELECT
    asd.sdk_id,
    sd.sdk_name,
    sa.store,
    sa.store_id,
    sa.name AS app_name,
    sa.category,
    sa.is_removed,
    sa.developer_name,
    sa.installs,
    sa.installs_sum_4w,
    CONCAT(
        'https://media.appgoblin.info/app-icons/',
        sa.store_id,
        '/',
        sa.icon_64
    ) AS app_icon_url
FROM latest_app_sdks AS asd
INNER JOIN adtech.sdks AS sd ON asd.sdk_id = sd.id
LEFT JOIN frontend.store_apps_overview AS sa ON asd.store_app = sa.id
ORDER BY sa.installs DESC NULLS LAST
LIMIT :mylimit;
