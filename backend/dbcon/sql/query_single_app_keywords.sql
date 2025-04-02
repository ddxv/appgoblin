WITH latest_en_descriptions AS (
    SELECT DISTINCT ON
    (store_app)
        sad.store_app,
        sad.id AS description_id
    FROM
        store_apps_descriptions AS sad
    LEFT JOIN store_apps AS sa
        ON
            sad.store_app = sa.id
    WHERE
        sad.language_id = 1
        AND sa.store_id = :store_id
    ORDER BY
        sad.store_app ASC,
        sad.updated_at DESC
)

SELECT keyword_text
FROM
    description_keywords AS dk
LEFT JOIN keywords AS k
    ON
        dk.keyword_id = k.id
WHERE
    dk.description_id IN (
        SELECT description_id
        FROM
            latest_en_descriptions
    );
