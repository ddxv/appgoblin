SELECT
    cavd.xml_path,
    cavd.value_name,
    sa.store,
    sa.store_id,
    sa.name AS app_name,
    sa.installs,
    sa.rating_count,
    sa.icon_url_512
FROM
    frontend.companies_apps_version_details AS cavd
LEFT JOIN public.store_apps AS sa
    ON
        cavd.store_id = sa.store_id
WHERE
    cavd.value_name LIKE :value_pattern || '%'
ORDER BY COALESCE(sa.installs, sa.rating_count) DESC NULLS LAST
LIMIT 200;
