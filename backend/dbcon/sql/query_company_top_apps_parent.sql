WITH ranked_apps AS (
    SELECT *
    FROM
        frontend.company_parent_top_apps
    WHERE
        company_domain = :company_domain
        AND app_company_rank <= :mylimit
)

SELECT
    ranked_apps.company_domain,
    ranked_apps.store,
    ranked_apps.tag_source,
    ranked_apps.name,
    ranked_apps.store_id,
    ranked_apps.app_company_rank AS rank,
    ranked_apps.rating_count,
    ranked_apps.rating_count_d30,
    ranked_apps.installs,
    ranked_apps.installs_d30
FROM ranked_apps;
