WITH ranked_apps AS (
    SELECT *
    FROM
        frontend.company_top_apps
    WHERE
        company_domain = :company_domain
        AND app_company_rank <= :mylimit
)

SELECT
    ra.company_domain,
    ra.store,
    ra.name,
    ra.store_id,
    ra.developer_name,
    ra.icon_64,
    ra.app_company_rank AS rank,
    ra.installs_d30,
    ra.sdk,
    ra.api_call,
    ra.publisher,
    ra.app_ads_direct,
    sao.is_removed,
    c.alpha2 AS country
FROM ranked_apps AS ra
LEFT JOIN frontend.store_apps_overview AS sao
    ON ra.store_id = sao.store_id AND ra.store = sao.store
LEFT JOIN countries AS c ON sao.country_id = c.id;
