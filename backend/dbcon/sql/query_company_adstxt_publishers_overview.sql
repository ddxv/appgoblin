WITH ranked_data AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY
                store,
                relationship
            ORDER BY
                app_count DESC
        ) AS pubrank
    FROM
        adstxt_publishers_overview
    WHERE
        ad_domain_url = :ad_domain_url
        AND (publisher_id = :publisher_id OR :publisher_id IS NULL)
)

SELECT
    relationship,
    store,
    publisher_id,
    developer_count,
    app_count
FROM
    ranked_data
WHERE
    pubrank <= :pubrank_limit
ORDER BY
    store,
    pubrank;
