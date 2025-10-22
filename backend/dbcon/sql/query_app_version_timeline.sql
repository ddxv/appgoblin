SELECT
    vcssr.scanned_at,
--    vc.created_at AS app_downloaded, --this not accurate before 10/5
    vc.version_code AS app_version_code,
    vcssr.scan_result
FROM
    version_code_sdk_scan_results vcssr
LEFT JOIN version_codes vc ON
    vcssr.version_code_id = vc.id
LEFT JOIN store_apps sa ON vc.store_app = sa.id
WHERE
    sa.store_id = :store_id
ORDER BY
    vcssr.scanned_at DESC
LIMIT 5
;
