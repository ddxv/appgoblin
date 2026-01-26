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
    ra.app_company_rank AS rank,
    ra.rating_count_d30,
    ra.installs_d30,
    ra.sdk,
    ra.api_call,
    ra.app_ads_direct
FROM ranked_apps AS ra;
