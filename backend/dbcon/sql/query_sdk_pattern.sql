SELECT
    vs.xml_path,
    vs.value_name,
    sa.store,
    sa.store_id,
    sa.name AS app_name,
    sa.installs,
    sa.rating_count,
    CASE
        WHEN sa.icon_url_100 IS NOT NULL
            THEN
                CONCAT(
                    'https://media.appgoblin.info/app-icons/',
                    sa.store_id,
                    '/',
                    sa.icon_url_100
                )
        ELSE sa.icon_url_512
    END AS app_icon_url
FROM
    adtech.store_app_sdk_strings sass
JOIN version_strings AS vs
    ON
        sass.version_string_id = vs.id
LEFT JOIN public.store_apps AS sa
    ON
        sass.store_app = sa.id
WHERE
    lower(vs.value_name) LIKE lower(:value_pattern) || '%'
ORDER BY COALESCE(sa.installs, sa.rating_count) DESC NULLS LAST
LIMIT 200;