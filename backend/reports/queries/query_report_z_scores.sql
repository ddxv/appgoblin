WITH my_advs AS (
    SELECT DISTINCT cr.advertiser_store_app_id
    FROM creative_records AS cr
    LEFT JOIN api_calls AS ac ON cr.api_call_id = ac.id
    LEFT JOIN version_code_api_scan_results AS vcasr ON ac.run_id = vcasr.id
    LEFT JOIN
        adtech.company_domain_mapping AS hcdm
        ON cr.creative_host_domain_id = hcdm.domain_id
    LEFT JOIN adtech.companies AS hc ON hcdm.company_id = hc.id
    LEFT JOIN adtech.company_categories AS hcc ON hc.id = hcc.company_id
    WHERE
        vcasr.run_at > CAST(:target_week AS date) - interval '7 days'
        AND vcasr.run_at <= CAST(:target_week AS date)
        AND hcc.category_id = 1 AND cr.advertiser_store_app_id IS NOT NULL
),

windowed_metrics AS (
    SELECT
        ga.store_app,
        ga.week_start,
        ga.weekly_installs,
        ga.weekly_ratings,
        CAST(:target_week AS date) AS target_week,
        ga.weekly_installs AS target_week_installs,
        -- 2-Week and 4-Week Averages
        AVG(ga.weekly_installs) OVER w_2w AS installs_avg_2w,
        AVG(ga.weekly_installs) OVER w_4w AS installs_avg_4w,
        -- Baseline Metrics
        AVG(
            CASE
                WHEN
                    ga.week_start
                    >= CAST(:target_week AS date) - interval '112 days'
                    AND ga.week_start
                    <= CAST(:target_week AS date) - interval '28 days'
                    THEN ga.weekly_installs
            END
        ) OVER w_all AS b_avg_installs,
        STDDEV(
            CASE
                WHEN
                    ga.week_start
                    >= CAST(:target_week AS date) - interval '112 days'
                    AND ga.week_start
                    <= CAST(:target_week AS date) - interval '28 days'
                    THEN ga.weekly_installs
            END
        ) OVER w_all AS b_std_installs,
        -- Lagged Installs (with explicit frame)
        LAG(ga.weekly_installs, 1) OVER (
            PARTITION BY ga.store_app
            ORDER BY ga.week_start ASC
            ROWS BETWEEN 1 PRECEDING AND 1 PRECEDING
        ) AS installs_1w_ago,
        LAG(ga.weekly_installs, 2) OVER (
            PARTITION BY ga.store_app
            ORDER BY ga.week_start ASC
            ROWS BETWEEN 2 PRECEDING AND 2 PRECEDING
        ) AS installs_2w_ago,
        -- Non-overlapping Momentum Averages
        AVG(CASE
            WHEN ga.week_start > CAST(:target_week AS date) - interval '14 days'
                THEN ga.weekly_installs
        END)
            OVER (PARTITION BY ga.store_app) AS recent_2w_avg,
        AVG(CASE
            WHEN
                ga.week_start <= CAST(:target_week AS date) - interval '14 days'
                AND ga.week_start
                > CAST(:target_week AS date) - interval '28 days'
                THEN ga.weekly_installs
        END)
            OVER (PARTITION BY ga.store_app) AS prior_2w_avg
    FROM app_global_metrics_history AS ga
    INNER JOIN my_advs AS m ON ga.store_app = m.advertiser_store_app_id
    WHERE
        ga.week_start >= (CAST(:target_week AS date) - interval '130 days')
        AND ga.week_start <= CAST(:target_week AS date)
    WINDOW
        w_all AS (PARTITION BY ga.store_app),
        w_4w AS (
            PARTITION BY ga.store_app
            ORDER BY ga.week_start DESC
            ROWS BETWEEN CURRENT ROW AND 3 FOLLOWING
        ),
        w_2w AS (
            PARTITION BY ga.store_app
            ORDER BY ga.week_start DESC
            ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING
        )
),

final_calculation AS (
    SELECT
        wm.*,
        sa.store,
        sa.name AS app_name,
        sa.store_id,
        sa.ad_supported,
        sa.in_app_purchases,
        -- Baseline Comparisons
        b_avg_installs AS baseline_installs,
        (
            (installs_avg_2w - b_avg_installs)::numeric
            / NULLIF(b_avg_installs, 0)
        )
        * 100 AS baseline_installs_pct,
        (
            (weekly_installs - b_avg_installs)::numeric
            / NULLIF(b_avg_installs, 0)
        )
        * 100 AS weekly_installs_pct,
        -- Z-Scores
        (installs_avg_2w - b_avg_installs)::numeric
        / NULLIF(b_std_installs, 0::numeric) AS installs_z_score_2w,
        (installs_avg_4w - b_avg_installs)::numeric
        / NULLIF(b_std_installs, 0::numeric) AS installs_z_score_4w,
        -- Acceleration
        (installs_avg_2w - installs_avg_4w)::numeric
        / NULLIF(installs_avg_4w, 0::numeric) AS installs_acceleration,
        -- Growth Metrics (with numeric casting to avoid integer division)
        CASE
            WHEN installs_1w_ago IS NOT NULL AND installs_1w_ago > 0
                THEN
                    (weekly_installs - installs_1w_ago)::numeric
                    / installs_1w_ago
                    * 100
        END AS wow_growth_pct,
        CASE
            WHEN installs_2w_ago IS NOT NULL AND installs_2w_ago > 0
                THEN
                    (weekly_installs - installs_2w_ago)::numeric
                    / installs_2w_ago
                    * 100
        END AS two_week_growth_pct,
        CASE
            WHEN prior_2w_avg IS NOT NULL AND prior_2w_avg > 0
                THEN
                    (recent_2w_avg - prior_2w_avg)::numeric / prior_2w_avg * 100
        END AS momentum_pct,
        -- Reliability
        b_std_installs IS NOT NULL
        AND b_avg_installs > 0 AS has_reliable_baseline,
        -- Ranking
        ROW_NUMBER() OVER (
            PARTITION BY sa.store
            ORDER BY
                (installs_avg_2w - b_avg_installs)::numeric
                / NULLIF(b_std_installs, 0::numeric) DESC NULLS LAST
        ) AS rn
    FROM windowed_metrics AS wm
    INNER JOIN store_apps AS sa ON wm.store_app = sa.id
    WHERE wm.week_start = wm.target_week
)

SELECT
    target_week,
    store,
    store_app,
    store_id,
    app_name,
    in_app_purchases,
    ad_supported,
    target_week_installs,
    baseline_installs,
    baseline_installs_pct,
    weekly_installs_pct,
    installs_z_score_2w,
    installs_z_score_4w,
    installs_acceleration,
    wow_growth_pct,
    two_week_growth_pct,
    momentum_pct,
    has_reliable_baseline
FROM final_calculation;
