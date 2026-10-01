include_apps AS (
    SELECT c.store_app
    FROM adtech.combined_app_companies AS c
    WHERE
        cardinality(cast(:include_company_ids AS int [])) > 0
        AND c.company_id = any(cast(:include_company_ids AS int []))
        AND (
            NOT cast(:require_sdk_api AS boolean)
            OR c.sdk = TRUE
            OR c.api_call = TRUE
        )
    GROUP BY c.store_app
    HAVING
        count(DISTINCT c.company_id)
        = cardinality(cast(:include_company_ids AS int []))
)