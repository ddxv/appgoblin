SELECT sach.*
FROM store_apps_country_history AS sach
LEFT JOIN countries AS c
    ON
        sach.country_id = c.id
WHERE
    sach.store_app = :store_app
    AND c.alpha2 = :country
    AND sach.crawled_date >= CURRENT_DATE - INTERVAL '375 days';
