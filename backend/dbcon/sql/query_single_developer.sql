SELECT *
FROM
    developer_store_apps
WHERE
    developer_id = :developer_id
UNION
SELECT dsa.*
FROM
    developer_store_apps AS dsa
INNER JOIN (
    SELECT DISTINCT domain_id
    FROM
        developer_store_apps
    WHERE
        developer_id = :developer_id
) AS domains
    ON
        dsa.domain_id = domains.domain_id
WHERE
    dsa.developer_id <> :developer_id;
