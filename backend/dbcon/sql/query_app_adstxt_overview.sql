WITH all_apps AS (
    SELECT DISTINCT
        sa.store_id,
        aesa.company_name,
        aesa.ad_domain_url,
        aesa.relationship
    FROM
        frontend.adstxt_entries_store_apps AS aesa
    LEFT JOIN store_apps AS sa ON
        aesa.store_app = sa.id
)

SELECT
    ad_domain_url AS company_domain,
    company_name,
    relationship,
    count(*)
FROM
    all_apps
WHERE
    store_id = :store_id
GROUP BY
    ad_domain_url,
    company_name,
    relationship;
