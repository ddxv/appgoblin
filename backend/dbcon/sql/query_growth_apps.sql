SELECT *
FROM frontend.store_apps_z_scores
WHERE
    store = :store
    AND (app_category = :app_category OR :app_category IS NULL)
ORDER BY COALESCE(installs_z_score_2w, rating_z_score_2w) DESC
LIMIT 100;
