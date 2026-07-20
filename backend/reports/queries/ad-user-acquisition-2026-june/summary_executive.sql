WITH advertiser_ids AS (
    SELECT cr.advertiser_store_app_id AS advertiser_id, 'direct' AS adv_type
    FROM api_calls AS ac
    LEFT JOIN creative_records AS cr ON ac.id = cr.api_call_id
    WHERE ac.called_at >= :start_date
      AND ac.called_at < :next_month_start_date
    UNION
    SELECT expanded.advertiser_store_app_id AS advertiser_id, 'multi' AS adv_type
    FROM api_calls AS ac
    LEFT JOIN creative_records AS cr ON ac.id = cr.api_call_id
    LEFT JOIN LATERAL UNNEST(cr.advertiser_store_app_ids) AS expanded(advertiser_store_app_id)
        ON TRUE
    WHERE ac.called_at >= :start_date
      AND ac.called_at < :next_month_start_date
)
SELECT
    count(DISTINCT store_app) AS apps_analyzed,
    count(*) AS https_tracked,
    count(DISTINCT tld_url) AS api_domains,
    count(DISTINCT cdm.company_id) AS adtech_companies,
    count(DISTINCT advertiser_store_app_id) AS advertisers,
    (SELECT count(DISTINCT advertiser_id) FROM advertiser_ids) AS advertisers_all,
    count(DISTINCT phash) AS creative_count
FROM
    api_calls AS ac
LEFT JOIN domains AS d ON ac.tld_url = d.domain_name
LEFT JOIN adtech.company_domain_mapping AS cdm ON d.id = cdm.domain_id
LEFT JOIN creative_records AS cr ON ac.id = cr.api_call_id
LEFT JOIN creative_assets AS ca ON cr.creative_asset_id = ca.id
WHERE
    called_at >= :start_date
    AND called_at < :next_month_start_date
;