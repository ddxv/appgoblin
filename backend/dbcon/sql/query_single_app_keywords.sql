WITH latest_en_descriptions AS (
    SELECT DISTINCT ON
    (store_app)
        sa.store,
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
),

desc_keywords AS (
    SELECT dk.keyword_id
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
        )
),

ranked_keywords AS (
    SELECT
        akr.keyword,
        min(rank) AS d30_best_rank
    FROM
        app_keyword_rankings AS akr
    LEFT JOIN store_apps AS sa
        ON
            akr.store_app = sa.id
    WHERE
        sa.store_id = :store_id
        AND crawled_date >= current_date - INTERVAL '30 days'
        AND lang = 1
        AND country = 840
    GROUP BY
        akr.keyword
),

all_apps_keywords AS (
    SELECT dk.keyword_id
    FROM
        desc_keywords AS dk
    UNION
    SELECT rk.keyword AS keyword_id
    FROM
        ranked_keywords AS rk
)

SELECT
    aak.keyword_id,
    rk.d30_best_rank,
    ks.keyword_text,
    ks.app_count,
    ks.total_apps,
    ks.competitiveness_score
FROM
    all_apps_keywords AS aak
LEFT JOIN ranked_keywords AS rk
    ON
        aak.keyword_id = rk.keyword
LEFT JOIN frontend.keyword_scores AS ks
    ON
        aak.keyword_id = ks.keyword_id
WHERE
    ks.store IN (
        SELECT store
        FROM
            latest_en_descriptions
    );
