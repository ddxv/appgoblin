exclude_apps AS (
    SELECT DISTINCT c.store_app
    FROM adtech.combined_app_companies AS c
    WHERE
        cardinality(cast(:exclude_company_ids AS int [])) > 0
        AND c.company_id = any(cast(:exclude_company_ids AS int []))
)