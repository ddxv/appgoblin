SELECT
    sa.store,
    sa.name,
    sa.store_id,
    sa.developer_name,
    sa.icon_url_100,
    sa.installs_sum_4w AS rank,
    sa.installs_sum_4w AS installs_d30,
    dac.status
FROM
    adtech.domain_app_changes AS dac
LEFT JOIN frontend.store_apps_overview AS sa ON dac.store_app = sa.id
WHERE
    dac.year = :myyear
    AND dac.quarter = :myquarter
    AND dac.domain_name = :mydomain
    AND dac.tag_source = :mytagsource
    AND (CAST(:mystatus AS text) IS NULL OR dac.status = :mystatus)
    AND sa.store_id IS NOT NULL
ORDER BY
    sa.installs_sum_4w DESC NULLS LAST,
    sa.name ASC;
