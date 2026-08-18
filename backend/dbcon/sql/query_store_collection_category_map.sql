SELECT DISTINCT
    s.id AS store_id,
    s.name AS store_name,
    sc.id AS collection_id,
    sc.collection AS collection_name,
    sca.id AS category_id,
    sca.category AS category_name
FROM
    stores AS s
LEFT JOIN store_collections AS sc
    ON
        s.id = sc.store
LEFT JOIN store_categories AS sca
    ON
        s.id = sca.store
WHERE sc.collection NOT IN ('NEW_IOS', 'NEW_PAID_IOS', 'NEW_FREE_IOS');
