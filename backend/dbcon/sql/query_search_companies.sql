WITH company_results AS (
    SELECT
        cac.store,
        cac.tag_source,
        cac.company_domain,
        cac.company_name,
        cac.app_count
    FROM frontend.companies_category_tag_stats AS cac
    WHERE
        cac.company_name ILIKE '%' || cac.:searchinput || '%'
        OR cac.company_domain ILIKE '%' || cac.:searchinput || '%'
),

company_counts AS (
    SELECT
        company_domain,
        company_name,
        -- api_call
        SUM(CASE WHEN tag_source = 'api_call' THEN app_count END)
            AS api_call_app_count,
        -- sdks
        SUM(CASE WHEN tag_source = 'sdk' THEN app_count END) AS sdk_app_count,
        -- app_ads_direct
        SUM(CASE WHEN tag_source = 'app_ads_direct' THEN app_count END)
            AS app_ads_direct_app_count,
        -- app_ads_reseller
        SUM(CASE WHEN tag_source = 'app_ads_reseller' THEN app_count END)
            AS app_ads_reseller_app_count
    FROM company_results
    GROUP BY company_domain, company_name
)

SELECT
    company_domain,
    company_name,
    api_call_app_count,
    sdk_app_count,
    app_ads_direct_app_count,
    app_ads_reseller_app_count
FROM company_counts
ORDER BY
    COALESCE(api_call_app_count, 0) * 100
    + COALESCE(sdk_app_count, 0)
    + COALESCE(app_ads_direct_app_count, 0)
    + COALESCE(app_ads_reseller_app_count, 0)
    DESC
LIMIT :mylimit;
