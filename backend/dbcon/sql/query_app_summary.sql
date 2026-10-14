SELECT
    sao.store_id,
    sao.name,
    sao.installs,
    CASE
        WHEN sao.icon_128 IS NOT NULL
            THEN CONCAT(
                'https://media.appgoblin.info/app-icons/',
                sao.store_id,
                '/',
                sao.icon_128
            )
        ELSE sao.icon_url_512
    END AS icon
FROM frontend.store_apps_overview AS sao
WHERE sao.store_id = :store_id;
