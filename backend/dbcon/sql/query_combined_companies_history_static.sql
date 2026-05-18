SELECT
    ad_domain AS company_domain,
    company_id,
    parent_id,
    year,
    quarter,
    store,
    tag_source,
    pct_market_share,
    pct_apps_added,
    pct_apps_lost,
    COALESCE(total_apps, 0) AS total_apps,
    COALESCE(total_apps_in_quarter, 0) AS total_apps_in_quarter,
    COALESCE(apps_lost, 0) AS apps_lost,
    COALESCE(apps_added, 0) AS apps_added
FROM adtech.combined_companies_history
WHERE (year > 2025 OR (year = 2025 AND quarter >= 2))
ORDER BY company_domain ASC, year ASC, quarter ASC, store ASC, tag_source ASC;
