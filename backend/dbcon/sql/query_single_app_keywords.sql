WITH ranked_keywords AS (
    SELECT
        sa.store,
        akr.keyword_id,
        akr.latest_app_rank,
        akr.d30_best_rank
    FROM frontend.app_keyword_rank_stats AS akr
    LEFT JOIN store_apps AS sa ON akr.store_app = sa.id
    WHERE
        sa.store_id = :store_id
        AND akr.country = 840
),

extracted_keywords AS (
    SELECT
        sa.store,
        aek.keyword_id
    FROM app_keywords_extracted AS aek
    LEFT JOIN store_apps AS sa ON aek.store_app = sa.id
    WHERE sa.store_id = :store_id
),

all_keywords AS (
    SELECT
        store,
        keyword_id,
        TRUE AS is_ranking,
        FALSE AS is_extracted,
        FALSE AS is_user_added
    FROM ranked_keywords
    UNION
    SELECT
        store,
        keyword_id,
        FALSE AS is_ranking,
        TRUE AS is_extracted,
        FALSE AS is_user_added
    FROM extracted_keywords
)

SELECT
    ak.keyword_id,
    k.keyword_text,
    -- Origin flags (a keyword can appear in multiple sources)
    rk.latest_app_rank,
    rk.d30_best_rank,
    -- Rank data (null if not crawled for this app)
    ks.app_count,
    ks.total_apps,
    -- Market/difficulty data
    ks.median_competitor_installs,
    ks.avg_competitor_rating,
    ks.major_competitors,
    ks.volume_competition_score,
    ks.keyword_difficulty,
    ks.opportunity_score,
    ks.competitiveness_score,
    BOOL_OR(ak.is_ranking) AS is_keyword_ranking,
    BOOL_OR(ak.is_extracted) AS is_keyword_generated
FROM all_keywords AS ak
LEFT JOIN keywords AS k ON ak.keyword_id = k.id
LEFT JOIN ranked_keywords AS rk ON ak.keyword_id = rk.keyword_id
LEFT JOIN frontend.keyword_scores AS ks
    ON ak.keyword_id = ks.keyword_id AND ak.store = ks.store
WHERE ks.app_count IS NOT NULL
GROUP BY
    ak.keyword_id,
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
    ks.competitiveness_score;
