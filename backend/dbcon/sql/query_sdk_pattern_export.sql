WITH matching_strings AS (
    SELECT
        id,
        xml_path,
        value_name
    FROM version_strings
    WHERE LOWER(value_name) LIKE LOWER(:value_pattern) || '%'
)

SELECT
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
FROM matching_strings AS vs
INNER JOIN adtech.app_sdk_strings AS sass
    ON vs.id = sass.string_id
LEFT JOIN frontend.store_apps_overview AS sa
    ON sass.store_app = sa.id;
