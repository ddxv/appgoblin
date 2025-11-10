WITH extracted_keywords AS (
    SELECT
        sa.store,
        aek.keyword_id,
        aek.description_id
    FROM app_keywords_extracted AS aek
    LEFT JOIN store_apps AS sa
        ON
            aek.store_app = sa.id
    WHERE
        sa.store_id = :store_id
),

ranked_keywords AS (
    SELECT
        sa.store,
        akr.keyword_id,
        akr.latest_app_rank,
        akr.d30_best_rank
    FROM
        frontend.app_keyword_rank_stats AS akr
    LEFT JOIN store_apps AS sa
        ON
            akr.store_app = sa.id
    WHERE
        sa.store_id = :store_id
        AND akr.country = 840
),

all_apps_keywords AS (
    SELECT
        dk.store,
        dk.keyword_id
    FROM
        extracted_keywords AS dk
    UNION
    SELECT
        rk.store,
        rk.keyword_id
    FROM
        ranked_keywords AS rk
)

SELECT
    k.keyword_text,
    rk.latest_app_rank,
    rk.d30_best_rank,
    ks.app_count,
    ks.total_apps,
    ks.median_competitor_installs,
    ks.avg_competitor_rating,
    ks.major_competitors,
    ks.volume_competition_score,
    ks.keyword_difficulty,
    ks.opportunity_score,
    ks.competitiveness_score
FROM
    all_apps_keywords AS aak
LEFT JOIN keywords AS k ON aak.keyword_id = k.id
LEFT JOIN ranked_keywords AS rk
    ON
        aak.keyword_id = rk.keyword_id
LEFT JOIN frontend.keyword_scores AS ks
    ON
        aak.keyword_id = ks.keyword_id AND aak.store = ks.store
WHERE ks.app_count IS NOT NULL;
