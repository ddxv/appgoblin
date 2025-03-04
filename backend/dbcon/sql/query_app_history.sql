SELECT *
FROM store_apps_country_history
WHERE
    store_app = :store_app
    AND crawled_date >= CURRENT_DATE - INTERVAL '375 days';
