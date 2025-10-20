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
    THEN CONCAT('https://media.appgoblin.info/app-icons/', sa.store_id, '/', sa.icon_url_100)
  ELSE sa.icon_url_512
END AS app_icon_url
FROM
    frontend.store_apps_version_details AS cavd
LEFT JOIN public.store_apps AS sa
    ON
        cavd.store_id = sa.store_id
LEFT JOIN version_strings AS vs
    ON
        cavd.version_string_id = vs.id
WHERE
    vs.value_name LIKE :value_pattern || '%'
ORDER BY COALESCE(sa.installs, sa.rating_count) DESC NULLS LAST
LIMIT 200;
