SELECT *
FROM store_apps_country_history
WHERE store_app = :store_app
ORDER BY
    crawled_date DESC
LIMIT 52;
