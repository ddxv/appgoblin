WITH domain_totals AS (
    SELECT
        tld_url,
        SUM(store_app_count) AS total_count
    FROM
        frontend.api_call_countries
    GROUP BY
        tld_url
),
domain_percent AS (
    SELECT
        a.company_domain,
        a.parent_company_domain,
        a.tld_url,
        a.org,
        a.country,
        a.store_app_count,
        dt.total_count,
        a.store_app_count::float / dt.total_count AS pct
    FROM
        frontend.api_call_countries a
    JOIN domain_totals dt
            USING (tld_url)
)
SELECT
    parent_company_domain,
    company_domain,
    tld_url,
    org,
    country,
    store_app_count
FROM
    domain_percent
WHERE
    pct >= 0.10
ORDER BY
    tld_url,
    store_app_count DESC;
