WITH countries_with_ranks AS (
    SELECT
        cs.name AS scenario_name,
        cscc.country_id
    FROM crawl_scenario_country_config AS cscc
    LEFT JOIN crawl_scenarios AS cs ON cscc.scenario_id = cs.id
    WHERE cs.name = 'app_ranks'
),

countries_with_details AS (
    SELECT
        cs.name AS scenario_name,
        cscc.country_id
    FROM crawl_scenario_country_config AS cscc
    LEFT JOIN crawl_scenarios AS cs ON cscc.scenario_id = cs.id
    WHERE cs.name = 'app_details'
)

SELECT
    c.id,
    c.alpha2,
    c.langen,
    coalesce(
        c.id IN (SELECT cwr.country_id FROM countries_with_ranks AS cwr),
        FALSE
    ) AS app_ranks,
    coalesce(
        c.id IN (SELECT cwd.country_id FROM countries_with_details AS cwd),
        FALSE
    ) AS app_details
FROM countries AS c;
