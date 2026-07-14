SELECT *, 
CASE
  WHEN icon_128 IS NOT NULL
    THEN CONCAT('https://media.appgoblin.info/app-icons/', store_id, '/', icon_128)
  ELSE NULL
END AS app_icon_url
FROM frontend.apps_new_weekly
WHERE
    store = :store
    AND (category = :category OR :category IS NULL)
    AND rn <= :limit
;