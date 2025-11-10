SELECT
    sa.name,
    sa.store,
    sa.store_id,
    sa.installs,
    sa.rating_count,
    sa.icon_url_100,
    sa.category,
    akr.latest_app_rank,
    akr.d30_best_rank
FROM frontend.app_keyword_rank_stats AS akr
LEFT JOIN keywords AS k ON akr.keyword_id = k.id
LEFT JOIN frontend.store_apps_overview AS sa ON akr.store_app = sa.id
WHERE
    k.keyword_text = :keyword_text
    AND akr.latest_app_rank < :max_rank
    AND akr.country = 840;
