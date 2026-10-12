SELECT DISTINCT
    sd.id AS sdk_id,
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
        'https://media.appgoblin.info/app-icons/', sa.store_id, '/', sa.icon_64
    ) AS app_icon_url
FROM adtech.sdks AS sd
INNER JOIN adtech.app_sdk_strings AS sass ON sd.id = sass.sdk_id
LEFT JOIN frontend.store_apps_overview AS sa ON sass.store_app = sa.id
WHERE sd.id = :sdk_id
ORDER BY sa.installs DESC NULLS LAST
LIMIT :mylimit;
