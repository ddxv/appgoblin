WITH ranked_apps AS (
    SELECT
        tag_source,
        store,
        COALESCE(company_name, company_domain) AS company_name,
        SUM(app_count) AS app_count,
        ROW_NUMBER() OVER (
            PARTITION BY tag_source, store
            ORDER BY SUM(app_count) DESC
        ) AS rank
    FROM
        frontend.companies_parent_app_counts
    WHERE
        app_category = :app_category OR :app_category IS NULL
        AND tag_source != 'app_ads_reseller'
        AND company_domain NOT ILIKE 'no-%-found'
    GROUP BY COALESCE(company_name, company_domain), tag_source, store
)

SELECT
    tag_source,
    store,
    company_name,
    app_count
FROM ranked_apps
WHERE rank <= :mylimit
ORDER BY tag_source, rank;
