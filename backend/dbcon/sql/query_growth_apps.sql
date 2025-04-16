WITH ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY store
            ORDER BY COALESCE(installs_z_score_2w, rating_z_score_2w) DESC
        ) AS rn
    FROM frontend.store_apps_z_scores
    WHERE app_category = :app_category OR :app_category IS NULL
)

SELECT *
FROM ranked
WHERE rn <= 100;
