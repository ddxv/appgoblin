SELECT
    domain_name AS company_domain,
    year,
    quarter,
    store,
    tag_source,
    COALESCE(total_apps, 0) AS total_apps,
    COALESCE(total_apps_in_quarter, 0) AS total_apps_in_quarter,
    COALESCE(apps_lost, 0) AS apps_lost,
    COALESCE(apps_added, 0) AS apps_added
FROM adtech.trend_domains
-- Historical Q2 report: deliberately exclude later quarters that may now exist.
WHERE year = 2026 AND quarter IN (1, 2)
UNION ALL
SELECT
    company_domain,
    year,
    quarter,
    store,
    tag_source,
    COALESCE(total_apps, 0),
    COALESCE(total_apps_in_quarter, 0),
    COALESCE(apps_lost, 0),
    COALESCE(apps_added, 0)
FROM adtech.trend_companies
WHERE year = 2026 AND quarter IN (1, 2)
UNION ALL
SELECT
    company_domain,
    year,
    quarter,
    store,
    tag_source,
    COALESCE(total_apps, 0),
    COALESCE(total_apps_in_quarter, 0),
    COALESCE(apps_lost, 0),
    COALESCE(apps_added, 0)
FROM adtech.trend_parent_companies
WHERE year = 2026 AND quarter IN (1, 2)
ORDER BY company_domain ASC, year ASC, quarter ASC, store ASC, tag_source ASC;
