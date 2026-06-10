SELECT
    vc.version_code AS app_version_code,
    vcssr.scan_result AS sdk_scan_result,
    max(vcssr.scanned_at) AS sdks_last_scanned_at,
    max(vc.created_at) AS downloaded_at
FROM
    version_code_sdk_scan_results AS vcssr
LEFT JOIN version_codes AS vc
    ON
        vcssr.version_code_id = vc.id
LEFT JOIN store_apps AS sa ON vc.store_app = sa.id
WHERE
    sa.store_id = :store_id
GROUP BY 1, 2
ORDER BY
    sdks_last_scanned_at DESC;
