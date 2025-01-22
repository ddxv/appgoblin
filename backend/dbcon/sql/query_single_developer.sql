SELECT *
FROM
    developer_store_apps
WHERE
    developer_id = :developer_id
    OR domain_id IN (
        SELECT DISTINCT dd.domain_id
        FROM
            developer_store_apps AS dd
        WHERE
            dd.developer_id = :developer_id
    );
