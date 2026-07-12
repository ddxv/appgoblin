WITH top_companies AS (
    -- Stage 1: Find the absolute top domains globally
    SELECT
        ccts.company_domain,
        SUM(ccts.installs_d30) AS total_global_installs
    FROM frontend.companies_category_tag_type_stats AS ccts
    WHERE
        ccts.type_url_slug = :type_slug
        AND (
            CAST(:tag_sources AS text []) IS NULL
            OR ccts.tag_source = ANY(CAST(:tag_sources AS text []))
        )
        AND (
            CAST(:app_category AS text) IS NULL
            OR ccts.app_category LIKE :app_category
        )
        AND ccts.tag_source != 'app_ads_reseller'
        AND ccts.company_domain NOT ILIKE 'no-%-found'
    GROUP BY ccts.company_domain
    ORDER BY total_global_installs DESC NULLS LAST
    LIMIT :mylimit
),

detailed_data AS (
    -- Stage 2: Pull the granular breakdowns ONLY for those top domains
    SELECT
        ccts.store,
        ccts.tag_source,
        ccts.company_domain,
        ccts.type_url_slug,
        tc.total_global_installs,
        COALESCE(ccts.company_name, ccts.company_domain) AS company_name,
        COALESCE(parent_domain.domain_name, resolved_domain.domain_name)
            AS parent_company_domain,
        COALESCE(parent_company.name, resolved_company.name)
            AS parent_company_name,
        SUM(ccts.app_count) AS app_count,
        -- Reference the global metric from our first CTE for ordering consistency
        SUM(ccts.installs_d30) AS installs_d30
    FROM frontend.companies_category_tag_type_stats AS ccts
    -- Inner join forces Postgres to drop any domain not in the top limit list immediately
    INNER JOIN top_companies AS tc
        ON ccts.company_domain = tc.company_domain
    LEFT JOIN domains AS input_domain
        ON ccts.company_domain = input_domain.domain_name
    LEFT JOIN adtech.company_domain_mapping AS cdm
        ON input_domain.id = cdm.domain_id
    LEFT JOIN adtech.companies AS resolved_company
        ON cdm.company_id = resolved_company.id
    LEFT JOIN domains AS resolved_domain
        ON resolved_company.domain_id = resolved_domain.id
    LEFT JOIN adtech.companies AS parent_company
        ON resolved_company.parent_company_id = parent_company.id
    LEFT JOIN domains AS parent_domain
        ON parent_company.domain_id = parent_domain.id
    WHERE
        ccts.type_url_slug = :type_slug
        AND (
            CAST(:tag_sources AS text []) IS NULL
            OR ccts.tag_source = ANY(CAST(:tag_sources AS text []))
        )
        AND (
            CAST(:app_category AS text) IS NULL
            OR ccts.app_category LIKE :app_category
        )
    GROUP BY
        ccts.store,
        ccts.tag_source,
        ccts.company_domain,
        ccts.company_name,
        resolved_domain.domain_name,
        resolved_company.name,
        parent_domain.domain_name,
        parent_company.name,
        ccts.type_url_slug,
        tc.total_global_installs
)

SELECT
    store,
    tag_source,
    company_domain,
    company_name,
    parent_company_domain,
    parent_company_name,
    type_url_slug,
    app_count,
    installs_d30
FROM detailed_data
ORDER BY
    -- Keeps the top companies grouped together at the top
    total_global_installs DESC,
    company_domain ASC,
    -- Sorts internal breakdowns (e.g. Google Play vs App Store)
    installs_d30 DESC;
