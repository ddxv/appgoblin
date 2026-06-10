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
    adtech.domain_app_changes_quarterly AS dac
LEFT JOIN domains AS d ON dac.domain_id = d.id
LEFT JOIN frontend.store_apps_overview AS sa ON dac.store_app = sa.id
WHERE
    dac.year = :myyear
    AND dac.quarter = :myquarter
    AND d.domain_name = :mydomain
    AND dac.tag_source = :mytagsource
    AND (
        CAST(:mystatus AS text) IS NULL
        OR (
            CAST(:mystatus AS text) = 'added'
            AND CAST(dac.status AS text) IN ('added', 'added_initial')
        )
        OR (
            CAST(:mystatus AS text) = 'removed'
            AND CAST(dac.status AS text) = 'removed'
        )
        OR CAST(dac.status AS text) = CAST(:mystatus AS text)
    )
    AND sa.store_id IS NOT NULL
ORDER BY
    sa.installs_sum_4w DESC NULLS LAST,
    sa.name ASC;
