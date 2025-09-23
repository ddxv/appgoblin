SELECT *
FROM frontend.apps_new_weekly
WHERE
    store = :store
    AND (category = :category OR :category IS NULL)
    AND rn <= :limit
;