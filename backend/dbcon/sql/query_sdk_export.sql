SELECT DISTINCT
    sd.sdk_name,
    vs.xml_path,
    vs.value_name,
    sa.store,
    sa.store_id,
    sa.name AS app_name,
    sa.category,
    sa.is_removed,
    sa.developer_name,
    sa.installs,
    sa.installs_sum_4w
FROM adtech.sdks AS sd
INNER JOIN adtech.app_sdk_strings AS sass ON sass.sdk_id = sd.id
INNER JOIN version_strings AS vs ON vs.id = sass.string_id
LEFT JOIN frontend.store_apps_overview AS sa ON sass.store_app = sa.id
WHERE sd.id = :sdk_id;
