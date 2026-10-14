WITH sdk_apps AS (
    SELECT
        asd.store_app,
        asd.sdk_id,
        asd.version_code_id,
        asd.version_code_created_at
    FROM adtech.app_sdks AS asd
    WHERE asd.sdk_id = :sdk_id
)

SELECT
    asd.sdk_id,
    sd.sdk_name,
    sa.store,
    sa.store_id,
    sa.name AS app_name,
    vc.version_code AS app_version,
    asd.version_code_created_at AS downloaded_at,
    sa.category,
    sa.is_removed,
    sa.developer_name,
    sa.installs,
    sa.installs_sum_4w
FROM sdk_apps AS asd
INNER JOIN adtech.sdks AS sd
    ON asd.sdk_id = sd.id
LEFT JOIN version_codes AS vc
    ON asd.version_code_id = vc.id
LEFT JOIN frontend.store_apps_overview AS sa
    ON asd.store_app = sa.id;
