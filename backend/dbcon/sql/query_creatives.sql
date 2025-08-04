SELECT
sap.name AS pub_name,
sap.store_id AS pub_store_id,
sap.icon_url_512 AS pub_icon_url_512,
saa.name AS adv_name,
saa.store_id AS adv_store_id,
saa.icon_url_512 AS adv_icon_url_512,
md5_hash,
file_extension,
cr.updated_at
FROM creative_records cr
LEFT JOIN creative_assets ca
ON cr.creative_asset_id = ca.id
LEFT JOIN frontend.store_apps_overview sap ON cr.store_app_pub_id = sap.id
LEFT JOIN frontend.store_apps_overview saa ON ca.store_app_id = saa.id
WHERE saa.store_id = :store_id
;